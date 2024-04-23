<template>
  <div class="ddei-core-panel-share" v-if="file?.extData?.owner == 0">
    <div class="header"></div>
    <div class="content">
      <div class="part">
        <div :class="{ 'button-v': sslink?.can_edit, 'button-v-disabled': !sslink?.can_edit }"
          @click="sslink?.can_edit && save($event)" title="保存">
          <svg class="icon" aria-hidden="true">
            <use xlink:href="#icon-a-ziyuan487"></use>
          </svg>
          <div class="text">保存</div>
        </div>
      </div>
      <div class="part">
        <div :class="{ 'button-v': sslink?.can_coll, 'button-v-disabled': !sslink?.can_coll }"
          @click="sslink?.can_coll && collFile($event)" title="收藏">
          <svg class="icon" aria-hidden="true">
            <use xlink:href="#icon-shoucang"></use>
          </svg>
          <div class="text">收藏</div>
        </div>
      </div>
      <div class="part">
        <div :class="{ 'button-v': sslink?.can_down == 1, 'button-v-disabled': sslink?.can_down != 1 }"
          @click="sslink?.can_down == 1 && download($event)" title="下载">
          <svg class="icon" aria-hidden="true">
            <use xlink:href="#icon-a-ziyuan424"></use>
          </svg>
          <div class="text">下载</div>
        </div>
      </div>
      <div class="part">
        <div :class="{ 'button-v': sslink?.can_coll, 'button-v-disabled': !sslink?.can_coll }"
          @click="sslink?.can_down && showExportDialog($event, 1)" title="导出">
          <svg class="icon" aria-hidden="true">
            <use xlink:href="#icon-a-ziyuan423"></use>
          </svg>
          <div class="text">导出</div>
        </div>
      </div>
      <div class="part">
        <div :class="{ 'button-v': sslink?.can_coll, 'button-v-disabled': !sslink?.can_coll }"
          @click="sslink?.can_down && showExportDialog($event, 2)" title="打印">
          <svg class="icon" aria-hidden="true">
            <use xlink:href="#icon-a-ziyuan501"></use>
          </svg>
          <div class="text">打印</div>
        </div>
      </div>
    </div>
    <div class="tail">
      共享
    </div>
  </div>
</template>
<script lang="ts">
import {DDeiEditor} from "ddei-framework";
import {DDeiEditorEnumBusCommandType} from "ddei-framework";
import {DDeiEditorState} from "ddei-framework";
import Cookies from "js-cookie";
import {DDeiEditorUtil} from "ddei-framework";
import { collfile } from "@/lib/api/file";
import { userinfo } from "@/lib/api/login";
import {DDeiFileState} from "ddei-framework";
import {DDeiUtil} from "ddei-framework";

export default {
  name: "ddei-core-panel-share",
  extends: null,
  mixins: [],
  props: {
    //外部传入的插件扩展参数
    options: {
      type: Object,
      default: null
    }
  },
  data() {
    return {
      editor: null,
      file: {},
      fileNameEditing: false,
      fileDescEditing: false,
      sslink: null,
      user: null,
    };
  },
  computed: {},
  watch: {},
  created() { },
  mounted() {
    //获取编辑器
    this.editor = DDeiEditor.ACTIVE_INSTANCE;
    let file = this.editor?.files[this.editor?.currentFileIndex];
    let userCookie = Cookies.get("user");
    if (userCookie && file) {
      this.user = JSON.parse(userCookie)
      for (let i = 0; i < this.user?.sslinks?.length; i++) {
        if (this.user.sslinks[i].file_id == file.id) {
          this.sslink = this.user.sslinks[i]
          break;
        }
      }
    }
    this.file = file
  },
  methods: {

    showExportDialog(evt: Event, mode) {
      let srcElement = evt.currentTarget;
      DDeiEditorUtil.showOrCloseDialog("ddei-core-dialog-exportoption", {
        callback: {
        },
        mode: mode,
        group: "top-dialog",
        background: "white",
        opacity: "1%",
        event: -1
      }, {}, srcElement)

      if (DDeiEditor.ACTIVE_INSTANCE.tempDialogData && DDeiEditor.ACTIVE_INSTANCE.tempDialogData["ddei-core-dialog-exportoption"]) {
        this.editor.changeState(DDeiEditorState.PROPERTY_EDITING);
      } else {
        this.editor.changeState(DDeiEditorState.DESIGNING);
      }
    },

    /**
     * 保存
     * @param evt
     */
    save(evt) {
      this.editor.changeState(DDeiEditorState.DESIGNING);
      this.editor.bus.push(DDeiEditorEnumBusCommandType.ClearTemplateUI);
      this.editor.bus.push(DDeiEditorEnumBusCommandType.SaveFile, {}, evt);
      this.editor.bus.executeAll();
    },


    /**
     * 下载文件
     */
    download(evt) {
      if (this.editor?.ddInstance?.stage) {
        //获取json信息
        let file = this.editor?.files[this.editor?.currentFileIndex];
        if (file) {
          let json = file.toJSON();
          if (json) {
            // 创建隐藏的可下载链接
            let eleLink = document.createElement("a");
            eleLink.download = file.name + ".dei";
            eleLink.style.display = "none";
            // 字符内容转变成blob地址
            let blob = new Blob([JSON.stringify(json)]);
            eleLink.href = URL.createObjectURL(blob);
            // 触发点击
            document.body.appendChild(eleLink);
            eleLink.click();
            // 然后移除
            document.body.removeChild(eleLink);
            this.editor.changeState(DDeiEditorState.DESIGNING);
          }
        }
      }
    },

    /**
     * 收藏文件
     */
    collFile(evt) {
      if (this.editor?.ddInstance?.stage) {
        //获取json信息
        let file = this.editor?.files[this.editor?.currentFileIndex];
        if (file) {
          DDeiEditorUtil.showDialog("ddei-core-dialog-collfile", {
            msg: '是否将"' + this.file?.name + '"另存为您的私人文件?',
            callback: {
              cancel: this.cancelCollFile,
              ok: this.submitCollFile,
            },
            background: "white",
            opacity: "1%",
            event: -1
          })
        }
      }
    },
    //提交并重新加载自己的文件并替换
    async submitCollFile() {
      this.serverFunc = this.submitCollFile
      if (await this.getUserInfo()) {
        //执行收藏
        let file = this.editor?.files[this.editor?.currentFileIndex];
        let json = file.toJSON();
        if (json) {
          json.state = DDeiFileState.NONE;
        }
        delete json.id
        if (json.extData) {
          delete json.extData.owner
        }
        let thumbBase64 = await DDeiUtil.stageScreenToImage(this.editor.ddInstance, 400, 240)
        //收藏文件成功后替换文件
        let collFileRes = await collfile({ fv_id: this.sslink.fv_id, content: JSON.stringify(json), thumb: thumbBase64 })
        if (collFileRes.status == 200) {
          if (collFileRes.data.code == 0) {
            //替换当前打开的文件
            let fileInfo = collFileRes.data.data
            file.id = fileInfo.file_id
            file.state = DDeiFileState.NONE;
            file.version = fileInfo.version
            file.histroy = []
            file.extData.owner = 1
            this.editor.bus.push(DDeiEditorEnumBusCommandType.RefreshEditorParts);
            this.editor.bus.executeAll();
            this.editor.changeState(DDeiEditorState.DESIGNING);
          }
        }
      }
    },

    cancelCollFile() {
      DDeiEditorUtil.closeDialog("ddei-core-dialog-collfile")
      this.editor.changeState(DDeiEditorState.DESIGNING);
    },

    /**
     * 获取登录用户信息
     */
    async getUserInfo() {
      try {
        let response = await userinfo()
        let userJSON = response.data.data;
        if (userJSON.id == "-99") {
          throw new Error()
        }
        let user = JSON.stringify(userJSON, null, 4);
        Cookies.set("user", user);
        return true;
      } catch (e) {
        //弹出登录弹出框
        DDeiEditorUtil.showDialog("ddei-core-dialog-relogin", {
          icon: "#icon-a-ziyuan411",
          msg: "当前登录状态已失效，请重新登录.",
          callback: {
            ok: this.reExecFunc
          },
          background: "white",
          opacity: "1%",
          event: -1
        })

        return false;
      };
    },

    reExecFunc() {
      if (this.serverFunc) {
        this.serverFunc(this.serverFuncParam)
        delete this.serverFunc
        delete this.serverFuncParam
      } else {
        let ddInstance = DDei.INSTANCE_POOL['ddei_editor_view'];
        ddInstance.bus.restoreQueue();
        ddInstance.bus.executeAll();
      }
    },
  },
};
</script>

<style lang="less" scoped>
.ddei-core-panel-share {
  height: 103px;
  width: 250px;
  flex:0 1 250px;
  display: grid;
  grid-template-rows: 20px 57px 26px;
  grid-template-columns: 1fr;
  text-align: center;

  .content {
    display: flex;
    justify-content: center;
    align-items: center;
    border-right: 1px solid var(--panel-border);//darken(var(--panel-header), 13%);
    padding: 0px 4px;

    .part {
      padding: 0px 2px;
      flex: 1;
      display: flex;
      justify-content: center;
      align-items: center;

      .button-v {
        flex: 1;
        height: 50px;
        display: flex;
        flex-direction: column;
        align-items: center;

        .text {
          white-space: nowrap;
          flex: 0 0 13px;
          font-size: 14px;
          font-weight: 400;
          color: var(--panel-title);
        }

        &:hover {
          cursor: pointer;
          background-color: var(--panel-hover);
        }
      }

      .button-v-disabled {
        flex: 1;
        height: 50px;
        display: flex;
        flex-direction: column;
        cursor: not-allowed;
        align-items: center;
        background-color: var(--panel-disabled);

        .icon {
          filter: grayscale(1);
          opacity: 40%;
        }

        .text {
          color: var(--panel-title-disabled);
        }


      }

    }
  }

  .tail {
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 14px;
    font-weight: 400;
    color:var(--panel-title); // var(--panel-title); // fade(var(--panel-title), 40%);
    border-right: 1px solid var(--panel-border);//darken(var(--panel-header), 13%);
  }
}
</style>
