<template>
  <div class="ddei-core-panel-eimport">
    <div class="header"></div>
    <div class="content">
      <div class="part">
        <div class="button-v" @click="download">
          <svg class="icon" aria-hidden="true">
            <use xlink:href="#icon-download"></use>
          </svg>
          <div class="text">下载</div>
        </div>
      </div>
      <!-- <div class="part">
        <div class="button-v" @click="showExportDialog($event)">
          <svg class="icon" aria-hidden="true">
            <use xlink:href="#icon-print"></use>
          </svg>
          <div class="text">打印</div>
        </div>
      </div> -->
    </div>
    <div class="tail"></div>
  </div>
</template>
<script lang="ts">
import {DDeiEditor} from "ddei-framework";
import {DDeiEditorEnumBusCommandType} from "ddei-framework";
import {DDeiEditorState} from "ddei-framework";
import {DDeiEditorUtil} from "ddei-framework";

export default {
  name: "ddei-core-panel-eimport",
  extends: null,
  mixins: [],
  props: {
    //外部传入的插件扩展参数
    options: {
      type: Object,
      default: null
    }
    , editor: {
      type: DDeiEditor,
      default: null,
    }
  },
  data() {
    return {
      file:null,
    };
  },
  computed: {},
  watch: {},
  created() { },
  mounted() {
    this.file = this.editor?.files[this.editor?.currentFileIndex];

  },
  methods: {

    // showExportDialog(evt: Event) {
    //   let srcElement = evt.currentTarget;
    //   DDeiEditorUtil.showOrCloseDialog("ddei-core-dialog-exportoption", {
    //     callback: {
    //     },
    //     mode: 2,
    //     group: "top-dialog",
    //     background: "white",
    //     opacity: "1%",
    //     event: -1
    //   }, {}, srcElement)

    //   if (this.editor.tempDialogData && this.editor.tempDialogData["ddei-core-dialog-exportoption"]) {
    //     this.editor.changeState(DDeiEditorState.PROPERTY_EDITING);
    //   } else {
    //     this.editor.changeState(DDeiEditorState.DESIGNING);
    //   }
    // },
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
  },
};
</script>

<style lang="less" scoped>
.ddei-core-panel-eimport {
  height: 103px;
  width: 260px;
  flex: 0 1 260px;
  display: grid;
  grid-template-rows: 20px 57px 26px;
  grid-template-columns: 1fr;
  text-align: center;

  .content {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 0px 4px;

    .part {
      flex: 1;
      padding: 0px 2px;
      display: flex;
      justify-content: center;
      align-items: center;

      .button-v {
        flex: 1;
        height: 50px;
        border-radius: 4px;
        display: flex;
        flex-direction: column;
        align-items: center;
        &:hover {
          cursor: pointer;
          background-color: var(--panel-hover);
        }
      }

      

      .button-v-selected {
        flex: 1;
        height: 50px;
        background-color: var(--panel-selected);
        border-radius: 4px;
        display: flex;
        flex-direction: column;
        align-items: center;
        .text {
          color: var(--panel-title-selected);
        }
      }

      .button-v-disabled {
        flex: 1;
        height: 50px;
        cursor: not-allowed;
        display: flex;
        flex-direction: column;
        align-items: center;
        background-color: var(--panel-disabled);

        >span {
          color: var(--panel-title-disabled);
        }

        .text {
          color: var(--panel-title-disabled);
        }
      }

      .text {
        flex: 0 0 20px;
        white-space: nowrap;
        font-size: 14px;
        font-weight: 400;
        color: var(--panel-title);
      }
    }
  }

  .tail {
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 14px;
    font-weight: 400;
    color: var(--panel-title); // fade(var(--panel-title), 40%);
    
  }
}
</style>
