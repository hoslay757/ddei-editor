<template>
  <div :id="dialogId" class="ddei-core-dialog-createshare" v-if="forceRefresh">
    <div class="content">
      <div class="header">
        <svg class="icon warn" aria-hidden="true">
          <use xlink:href="#icon-a-ziyuan378"></use>
        </svg>
        <span>分享链接</span>
        <div style="flex:1"></div>
        <svg class="icon close" aria-hidden="true" @click="abort">
          <use xlink:href="#icon-a-ziyuan422"></use>
        </svg>
      </div>
      <div v-show="!linkData" class="fields">
        <div class="row">
          <div class="title">提取码：</div>
          <div class="field" v-for="data in ds1" @click="selectShareCode(data.value)">
            <input type="radio" :value="data.value" v-model="shareCode" name="ddei-share-code" autocomplete="off" />
            {{ data.text }}
          </div>
        </div>
        <div class="row">
          <div class="title">有效期：</div>
          <div class="field" v-for="data in ds2" @click="selectShareEnd(data.value)">
            <input type="radio" :value="data.value" v-model="shareDate" name="ddei-share-date" autocomplete="off" />
            {{ data.text }}
          </div>
        </div>
        <div class="row">
          <div class="title">权限：</div>
          <div class="field" @click="checkOrUnCheckEdit">
            <input type="checkbox" v-model="canEdit">编辑
          </div>
          <div class="field" @click="checkOrUnCheckDown">
            <input type="checkbox" v-model="canDown">下载
          </div>
          <div class="field" @click="checkOrUnCheckColl">
            <input type="checkbox" v-model="canColl">收藏
          </div>
        </div>
      </div>
      <div v-show="linkData" class="fields fields-large">
        <div class="row row-large">
          <div class="link-input">
            <input :value="linkData?.url" readonly="true">
            <svg class="icon" aria-hidden="true" @click="copy(linkData?.url)">
              <use xlink:href="#icon-a-ziyuan490"></use>
            </svg>
          </div>
        </div>
        <div class="row row-large">
          <div class="link-end">
            <span v-if="linkData?.state != 0 && linkData?.endType == 99" style="color:green">永久生效</span>
            <span v-if="linkData?.state != 0 && linkData?.endType != 99 && linkData?.endDate" style="color:green">{{
              linkData?.endDate }}
              过期</span>
            <span v-if="linkData?.state == 0" style="color:red">已过期</span>
            <!-- <span v-if="linkData?.endType != 99 && linkData?.endDate" style="color:red">已过期</span> -->
          </div>
          <div class="link-code-title">提取码：</div>
          <div class="link-code">
            <input :value="linkData?.pwd" readonly="true">
            <svg class="icon" aria-hidden="true" @click="copy(linkData?.pwd)">
              <use xlink:href="#icon-a-ziyuan490"></use>
            </svg>
          </div>
        </div>
      </div>
      <div v-show="!linkData" class="tail">
        <div class="button button-main" @click="generateLink">确定</div>
        <div class="button" @click="abort">取消</div>
      </div>

      <div v-show="linkData" class="tail">
        <div class="button button-main" @click="copyLink">复制链接</div>
        <div class="button " @click="abort">关闭</div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import {DDeiEditor} from "ddei-framework1";
import {DDeiEditorUtil} from "ddei-framework1";
import { createshortlink } from "@/lib/api/shortlink"
import {DDeiUtil} from "ddei-framework1";
import DialogBase from "./dialog"

export default {
  name: "ddei-core-dialog-createshare",
  extends: null,
  mixins: [DialogBase],
  props: {
    //外部传入的插件扩展参数
    options: {
      type: Object,
      default: null
    }
  },
  data() {
    return {
      dialogId: 'ddei-core-dialog-createshare',
      ds1: [
        { value: 1, text: '需要' },
        { value: 0, text: '不需要' }
      ],
      ds2: [
        { value: 1, text: '三天' },
        { value: 2, text: '一周' },
        { value: 3, text: '一月' },
        { value: 99, text: '永久' },
      ],
      canDown: false,//下载权限
      canColl: false,//收藏权限
      canEdit: false,//编辑权限
      shareDate: 1,//分享日期
      shareCode: 1,//提取码
      linkData: null//生成后的短链接
    };
  },
  computed: {},
  components: {},
  watch: {},
  created() { },
  mounted() {
  },
  methods: {

    checkOrUnCheckDown() {
      this.canDown = !this.canDown
    },
    checkOrUnCheckColl() {
      this.canColl = !this.canColl
    },
    checkOrUnCheckEdit() {
      this.canEdit = !this.canEdit
    },
    selectShareCode(code) {
      this.shareCode = code
    },

    selectShareEnd(code) {
      this.shareDate = code
    },

    /**
     * 生成链接
     */
    async generateLink() {
      //构建数据

      //获取当前激活文件
      if (this.editor.files.length > 0 && this.editor.currentFileIndex != -1) {
        let file = this.editor.files[this.editor.currentFileIndex];
        if (file) {
          let postData = {
            pwd_code: this.shareCode ? 1 : 0,
            end_type: this.shareDate,
            can_down: this.canDown ? 1 : 0,
            can_edit: this.canEdit ? 1 : 0,
            can_coll: this.canColl ? 1 : 0,
            file_id: file.id,
            version: file.version
          }
          let linkData = await createshortlink(postData);
          if (linkData.status == 200) {
            if (linkData.data.code == 0) {
              let data = linkData.data.data

              let returnData = {
                url: window.origin + "/ss/" + data.url,
                pwd: data.pwd_code,
                endType: data.end_type,
                state: 1
              }
              if (data.end_type != 99 && data.end_time?.length > 10) {

                let nowTimeStr = DDeiUtil.formatDate(new Date(), "yyyy-MM-ddThh:MM:ss")
                returnData.endDate = data.end_time.substring(0, 10)
                if (nowTimeStr >= data.end_time) {
                  returnData.state = 0
                }
              }
              this.linkData = returnData
            }
          }
        }
      }




    },

    /**
     * 复制链接
     */
    async copyLink() {
      if (this.linkData) {

        let copyText = this.linkData.url
        if (this.linkData.pwd) {
          copyText += "\r\n" + "提取码:" + this.linkData.pwd
        }
        await navigator.clipboard.writeText(copyText);
      }
    },

    async copy(value) {
      if (value) {
        await navigator.clipboard.writeText(value);
      }
    },
    abort() {
      DDeiEditorUtil.closeDialog('ddei-core-dialog-createshare');
    },
  }
};
</script>

<style lang="less" scoped>
/**以下为询问框的样式 */
.ddei-core-dialog-createshare {
  width: 420px;
  height: 260px;
  color: var(--panel-title);
  background: var(--panel-background);
  border: 1px solid var(--panel-border);
  box-shadow: 0px 2px 24px 0px hsl(0deg 0% 0% /0.25);
  border-radius: 12px;
  display: none;
  position: absolute;
  overflow: hidden;
  z-index: 999;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);

  .content {
    width: 420px;
    height: 260px;
    display: flex;
    flex-direction: column;
    padding: 0 24px;

    .header {
      flex: 0 0 30px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 19px;
      font-weight: 400;
      margin-top: 10px;
      color: var(--panel-title);

      >span {
        margin: 0 2px;
      }


      .close {
        font-size: 22px;
      }

      .warn {
        font-size: 24px !important;
      }


    }

    .fields {
      flex: 1;
      display: flex;
      flex-direction: column;
      border-radius: 10px;
      text-align: center;

      .row {
        flex: 0 0 50px;
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 18px;
        padding-right: 10px;

        .title {
          flex: 0 0 100px;
          height: 30px;

          text-align: right;
        }

        .field {
          flex: 1;
          display: flex;
          justify-content: center;
          align-items: center;
          user-select: none;

          >input[type="checkbox"] {
            width: 18px;
            height: 18px;
            margin-top: 1px;
            margin-right: 3px;
          }

          >input[type="radio"] {
            width: 18px;
            height: 18px;
            margin-top: 1px;
            margin-right: 3px;
          }
        }
      }

      .row-large {
        flex: 0 0 70px;
        padding-right: 0px;
      }





      .link-input {
        flex: 1 1 100%;
        border: 1px solid var(--panel-border);
        border-radius: 4px;
        height: 50px;
        display: flex;
        justify-content: center;
        align-items: center;
        padding-left: 10px;
        

        >input {
          flex: 1 1 100%;
          outline: none;
          background: none;
          border: none;
          font-size: 20px;
          color: var(--panel-title);
        }

        .icon {
          flex: 0 0 40px;
          cursor: pointer;
        }
      }

      .link-code-title {
        flex: 0 0 100px;
        height: 30px;
        padding-left: 10px;
        text-align: left;
      }

      .link-end {
        flex: 0 0 150px;
        padding-left: 10px;
        text-align: left;
        font-size: 16px;
      }

      .link-code {
        flex: 0 0 120px;
        border: 1px solid var(--panel-border);
        border-radius: 4px;
        height: 50px;
        display: flex;
        justify-content: center;
        align-items: center;

        >input {
          flex: 0 0 80px;
          outline: none;
          background: none;
          border: none;
          width: 80px;
          color: var(--panel-title);
          font-size: 20px;
        }

        .icon {
          flex: 0 0 40px;
          cursor: pointer;
        }
      }
    }

    .fields-large {
      margin-top: 10px;
    }


    .tail {
      flex: 0 0 65px;
      display: flex;
      align-items: center;
      text-align: center;
      justify-content: end;
    }

    .button {
      flex: 0 0 80px;
      height: 36px;
      background: var(--panel-header);
      border: 1px solid var(--panel-border);
      border-radius: 6px;
      font-size: 17px;
      font-weight: 400;
      color: var(--panel-title);
      margin-left: 13px;
      display: flex;
      align-items: center;
      justify-content: center;

    }

    .button:hover {
      color: white;
      background: var(--dot);
      cursor: pointer;
    }

    .button-main {
      color: white;
      background: var(--dot);

    }
  }
}
</style>
