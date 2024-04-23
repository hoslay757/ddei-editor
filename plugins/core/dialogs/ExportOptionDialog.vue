<template>
  <div :id="dialogId" class="ddei-core-dialog-exportoption" v-if="forceRefresh">
    <div class="content">
      <div class="header">
        <svg v-if="mode == 1" class="icon warn" aria-hidden="true">
          <use xlink:href="#icon-a-ziyuan423"></use>
        </svg>
        <svg v-if="mode == 2" class="icon warn" aria-hidden="true">
          <use xlink:href="#icon-a-ziyuan501"></use>
        </svg>
        <span v-if="mode == 1">导出设置</span>
        <span v-if="mode == 2">打印设置</span>
        <div style="flex: 1"></div>
        <svg class="icon close" aria-hidden="true" @click="abort">
          <use xlink:href="#icon-a-ziyuan422"></use>
        </svg>
      </div>
      <div class="fields">
        <div class="row">
          <div class="title">范围：</div>
          <div class="field" @click="checkOrUnCheckAll">
            <input type="checkbox" v-model="exportAll" />全部
          </div>
          <a-select style="width: 100px;overflow:hidden" :disabled="exportAll" v-model:value="exportSheets"
            mode="multiple">
            <option :value="sheet.name" v-for="sheet in sheets">{{ sheet.name }}</option>
          </a-select>
        </div>
        <div class="row">
          <div class="title">大小：</div>
          <select class="field" v-model="size">
            <option :value="data.value" v-for="data in ds2">{{ data.text }}</option>
          </select>
          <div class="title">方向：</div>
          <select class="field" v-model="direct">
            <option :value="data.value" v-for="data in ds3">{{ data.text }}</option>
          </select>
        </div>
        <div class="row">
          <div class="title">质量：</div>
          <div class="field" v-for="data in ds1" @click="selectResolutionType(data.value)">
            <input type="radio" :value="data.value" v-model="resolutionType" name="ddei-share-code"
              autocomplete="off" />
            {{ data.text }}
          </div>
        </div>
        <div class="row row-last">
          <div class="field" @click="checkOrUnCheckBG">
            <input type="checkbox" v-model="exportBG" />背景
          </div>
          <div class="field" @click="checkOrUnCheckMask">
            <input type="checkbox" v-model="exportMask" />水印
          </div>
          <div class="field" @click="checkOrUnCheckScale">
            <input type="checkbox" v-model="exportScale" />缩放
          </div>
        </div>
      </div>

      <div class="tail">
        <div v-if="mode == 1" class="button button-main" @click="execExport">导出</div>
        <div v-if="mode == 2" class="button button-main" @click="execExport">打印</div>
        <div class="button" @click="abort">取消</div>
      </div>
    </div>
    <iframe ref="ddei_print_iframe" width="0" height="0" style="display:none"></iframe>
  </div>
</template>

<script lang="ts">
import {DDeiEditor} from "ddei-framework";
import {DDeiEditorUtil} from "ddei-framework";
import {DDeiUtil} from "ddei-framework";
import JsPDF from "jspdf";
import {DDeiModelArrtibuteValue} from "ddei-framework";
import {DDeiConfig} from "ddei-framework";
import DialogBase from "./dialog"

export default {
  name: "ddei-core-dialog-exportoption",
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
      dialogId: "ddei-core-dialog-exportoption",
      ds1: [
        { value: 2, text: "普通" },
        { value: 3, text: "高清" },
        { value: 4, text: "超清" },
      ],
      ds2: [
        { value: "a3", text: "A3" },
        { value: "a4", text: "A4" },
        { value: "a5", text: "A5" },
        { value: "b3", text: "B3" },
        { value: "b4", text: "B4" },
        { value: "b5", text: "B5" },
        { value: "letter", text: "Letter" },
      ],
      ds3: [
        { value: 1, text: "纵向" },
        { value: 2, text: "横向" },
      ],
      size: "a4", //纸张大小
      direct: 1, //方向
      exportBG: true, //背景
      exportMask: true, //水印
      resolutionType: 2, //清晰度
      exportScale: false, //缩放至一页
      exportAll: true, //全部导出
      exportSheets: [], //导出范围
      sheets: [],
      mode: 1
    };
  },
  computed: {},
  components: {},
  watch: {},
  created() { },
  mounted() {
    this.refreshData();
    
  },
  methods: {
    refreshData(){
      let file = this.editor?.files[this.editor?.currentFileIndex];
      if (file) {
        let stage = this.editor?.ddInstance.stage;
        //获取纸张信息
        let paperType = DDeiModelArrtibuteValue.getAttrValueByState(
          stage,
          "paper.type",
          true
        );
        let paperDirect = DDeiModelArrtibuteValue.getAttrValueByState(
          stage,
          "paper.direct",
          true
        );
        this.direct = paperDirect ? paperDirect : this.direct;

        this.size = paperType ? paperType.toLowerCase() : this.size;

        this.sheets = file.sheets;
      }
      if (this.editor?.tempDialogData && this.editor?.tempDialogData[this.dialogId]?.mode) {
        this.mode = this.editor?.tempDialogData[this.dialogId].mode
      }
    },

    checkOrUnCheckBG() {
      this.exportBG = !this.exportBG;
    },
    checkOrUnCheckMask() {
      this.exportMask = !this.exportMask;
    },
    checkOrUnCheckScale() {
      this.exportScale = !this.exportScale;
    },

    checkOrUnCheckAll() {
      this.exportAll = !this.exportAll;
    },

    selectResolutionType(code) {
      this.resolutionType = code;
    },

    selectShareEnd(code) {
      this.shareDate = code;
    },

    abort() {
      DDeiEditorUtil.closeDialog("ddei-core-dialog-exportoption");
    },

    /**
     * 导出pdf
     */
    async execExport() {
      let file = this.editor?.files[this.editor?.currentFileIndex];
      if (file) {
        let stage = this.editor?.ddInstance.stage;
        //获取纸张信息
        let paperType = this.size?.toUpperCase()
        if (!paperType) {
          paperType = "A4"
        }
        let paperConfig = DDeiConfig.PAPER[paperType];
        //获取缩放比例
        let paperWidth, paperHeight;
        if (this.direct == 1 || this.direct == "1") {
          paperWidth = paperConfig.width;
          paperHeight = paperConfig.height;
        } else {
          paperHeight = paperConfig.width;
          paperWidth = paperConfig.height;
        }
        let pdf = new JsPDF(
          this.direct == 2 || this.direct == "2" ? "l" : "",
          paperConfig.unit,
          paperConfig.code
        );
        //剪切成多张图片
        let first = true;
        let sheets = file.sheets;
        for (let i = 0; i < sheets.length; i++) {
          let sheet = sheets[i];
          if (this.exportAll || this.exportSheets.indexOf(sheet.name) != -1) {
            //计算纸张的有效区域大小
            let paperArea = sheet.stage.getPaperArea(paperType);
            let stageImages = await DDeiUtil.cutStageToImages(
              this.editor.ddInstance,
              sheet.stage,
              paperArea.unitWidth,
              paperArea.unitHeight,
              paperArea.x,
              paperArea.y,
              paperArea.x + paperArea.w,
              paperArea.y + paperArea.h,
              this.resolutionType,
              this.exportBG,
              this.exportMask,
              this.exportScale
            );
            for (let k = 0; k < stageImages.length; k++) {
              let imageBase64 = stageImages[k];
              if (imageBase64) {
                if (!first) {
                  pdf.addPage();
                }
                pdf.addImage(imageBase64, "PNG", 0, 0, paperWidth, paperHeight);
                first = false;
              }
            }
          }
        }

        let exportName = file.name;
        if (file.version) {
          exportName += "-v" + file.version + ".pdf";
        }
        if (this.mode == 1) {
          pdf.save(exportName);
        } else if (this.mode == 2) {
          const data = pdf.output('blob')
          const blobUrl = URL.createObjectURL(data);
          let printIframe = this.$refs.ddei_print_iframe
          printIframe.setAttribute("src", blobUrl)
          printIframe.onload = function () {
            printIframe.contentWindow.print();
          }
        }
      }
      DDeiEditorUtil.closeDialog("ddei-core-dialog-exportoption");
    },


  },
};
</script>

<style lang="less" scoped>
/**以下为询问框的样式 */
.ddei-core-dialog-exportoption {
  width: 420px;
  height: 300px;
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
    height: 290px;
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
          background: var(--panel-background);
          color: var(--panel-title);

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

      .row-last {
        justify-content: end;

        .field {
          flex: 0 0 87px;
        }
      }

      .row-large {
        flex: 0 0 70px;
        padding-right: 0px;
      }
    }

    .fields-large {
      margin-top: 10px;
    }

    .tail {
      flex: 0 0 50px;
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
