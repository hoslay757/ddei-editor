<template>
  <div :id="editor?.id + '_' + dialogId" v-show="selectedModels?.size > 0" v-if="forceRefresh" @mousedown="closeAllDialog()"
    class='ddei-core-dialog-quickpop'>
    <div v-if="operateState == 50" class="content">
      <div class="panel12">
        <div class="panel12-content-1">
          <component :is="editor?.panels['ddei-core-btn-fontfamily']"></component>
        </div>
        <div class="panel12-content-2">
          <component :is="editor?.panels['ddei-core-btn-fontsize']"></component>
        </div>
        <div class="panel12-content-5">
          <component :is="editor?.panels['ddei-core-btn-addfontsize']" :addValue="1" attrCode="font.size"
            img="icon-a-ziyuan456" extcls="magtop-2"></component>
        </div>
        <div class="panel12-content-5">
          <component :is="editor?.panels['ddei-core-btn-addfontsize']" :addValue="-1" attrCode="font.size"
            img="icon-a-ziyuan455" extcls="magtop-1"></component>
        </div>

        <div class="panel12-content-3">
          <component :is="editor?.panels['ddei-core-btn-editbox']" selectedValue="1" attrCode="textStyle.bold"
            img="icon-a-ziyuan461"></component>
        </div>
        <div class="panel12-content-3">
          <component :is="editor?.panels['ddei-core-btn-editbox']" selectedValue="1" attrCode="textStyle.italic"
            img="icon-a-ziyuan459"></component>
        </div>
        <div class="panel12-content-3">
          <component :is="editor?.panels['ddei-core-btn-editbox']" selectedValue="1" attrCode="textStyle.underline"
            img="icon-icon-text-underline" extcls="ext-underline"></component>
        </div>
        <div class="panel12-content-3">
          <component :is="editor?.panels['ddei-core-btn-editbox']" electedValue="1" attrCode="textStyle.deleteline"
            img="icon-a-ziyuan457">
          </component>
        </div>
        <div class="panel12-content-3">
          <component :is="editor?.panels['ddei-core-btn-editbox']" selectedValue="1" :onlyQuickEdit="true"
            attrCode="textStyle.subtype" img="icon-a-ziyuan394" extcls="magtop-1">
          </component>
        </div>
        <div class="panel12-split-3 panel12-content-4 panel1-split-4">
          <component :is="editor?.panels['ddei-core-btn-color']" attrCode="textStyle.bgcolor" img="icon-a-ziyuan452">
          </component>
        </div>
        <div class="panel12-content-4">
          <component :is="editor?.panels['ddei-core-btn-color']" attrCode="font.color" img="icon-a-ziyuan463">
          </component>
        </div>
      </div>

      <div class="panel2" title="格式刷" @click="execBrushAction($event)">
        <div :class="{ 'panel2-content': true, 'brush-selected': editor?.ddInstance?.stage?.brushDataText }">
          <svg class="icon" aria-hidden="true">
            <use xlink:href="#icon-a-ziyuan485"></use>
          </svg>
          <div class="text">格式刷</div>
        </div>
      </div>
    </div>
    <div v-if="operateState != 50 && allLine" class="content">
      <div class="panel6">
        <div class="panel6-content1 pointtype">
          <component :is="editor?.panels['ddei-core-btn-linepointtype']" attrCode="sp.type">
          </component>
          <div class="text">起点</div>
        </div>
        <div class="panel6-content1 exchange" @click="exchangeLinePoint">
          <svg class="icon" aria-hidden="true">
            <use xlink:href="#icon-zhihuan"></use>
          </svg>
        </div>
        <div class="panel6-content1 pointtype">
          <component :is="editor?.panels['ddei-core-btn-linepointtype']" attrCode="ep.type">
          </component>
          <div class="text">终点</div>
        </div>
      </div>
      <div class="panel6" style="border-left:1px solid #E2E2EB;">
        <div class="panel6-content type">
          <component :is="editor?.panels['ddei-core-btn-linetype']" attrCode="type" img="icon-a-ziyuan430">
          </component>
          <div class="text">类型</div>
        </div>
        <div class="panel6-content color2">
          <component :is="editor?.panels['ddei-core-btn-color']" attrCode="color" img="icon-border-pencil">
          </component>
          <div class="text">颜色</div>
        </div>
        <div class="panel6-content dash">
          <component :is="editor?.panels['ddei-core-btn-borderweight']" attrCode="weight" hiddenCombo="1">
          </component>

          <div class="text">粗细</div>
        </div>
        <div class="panel6-content dash">
          <component :is="editor?.panels['ddei-core-btn-borderdash']" attrCode="dash" hiddenCombo="1">
          </component>
          <div class="text">虚线</div>
        </div>
      </div>
      <div class="panel6" style="border-left:1px solid #E2E2EB;">
        <div :class="{ 'panel6-content brush': true, 'brush-selected': editor?.ddInstance?.stage?.brushData }"
          @click="execBrushAction($event)">
          <svg class="icon" aria-hidden="true">
            <use xlink:href="#icon-a-ziyuan485"></use>
          </svg>
          <div class="text">格式刷</div>
        </div>
      </div>

    </div>
    <div v-if="operateState != 50 && !allLine" class="content">
      <div class="panel1">
        <div class="panel1-content-1">
          <component :is="editor?.panels['ddei-core-btn-fontfamily']"></component>
        </div>
        <div class="panel1-content-2">
          <component :is="editor?.panels['ddei-core-btn-fontsize']"></component>
        </div>
        <div class="panel1-content-3">
          <component :is="editor?.panels['ddei-core-btn-editbox']" selectedValue="1" attrCode="textStyle.bold"
            img="icon-a-ziyuan461"></component>
        </div>
        <div class="panel1-content-3">
          <component :is="editor?.panels['ddei-core-btn-editbox']" selectedValue="1" attrCode="textStyle.italic"
            img="icon-a-ziyuan459"></component>
        </div>
        <div class="panel1-content-3">
          <component :is="editor?.panels['ddei-core-btn-textalign']" img="icon-a-ziyuan440"></component>

        </div>
        <div class="panel1-split-3 panel1-content-4 panel1-split-4">
          <component :is="editor?.panels['ddei-core-btn-color']" attrCode="textStyle.bgcolor" img="icon-a-ziyuan452">
          </component>
        </div>
        <div class="panel1-content-4 ">
          <component :is="editor?.panels['ddei-core-btn-color']" attrCode="font.color" img="icon-a-ziyuan463">
          </component>
        </div>
      </div>
      <div class="panel2" title="格式刷" @click="execBrushAction($event)">
        <div :class="{ 'panel2-content': true, 'brush-selected': editor?.ddInstance?.stage?.brushData }">
          <svg class="icon" aria-hidden="true">
            <use xlink:href="#icon-a-ziyuan485"></use>
          </svg>
          <div class="text">格式刷</div>
        </div>
      </div>
      <div class="panel3">
        <div class="panel3-content i1" @click="showSetStyleDialog($event)">
          <svg class="icon" aria-hidden="true">
            <use xlink:href="#icon-a-ziyuan94"></use>
          </svg>
          <div class="text">样式</div>
        </div>
        <div class="panel3-content i2">
          <component :is="editor?.panels['ddei-core-btn-color']" attrCode="fill.color" img="icon-a-ziyuan419">
          </component>
          <div class="text">填充</div>
        </div>
        <div class="panel3-content i3">
          <component :is="editor?.panels['ddei-core-btn-color']" attrCode="border.color" img="icon-border-pencil">
          </component>
          <div class="text">线条</div>
        </div>
      </div>
      <div class="panel4">
        <div class="panel4-content" @click="doPush('top')">
          <svg class="icon" aria-hidden="true">
            <use xlink:href="#icon-a-ziyuan435"></use>
          </svg>
          <div class="text">置于顶层</div>
        </div>
        <div class="panel4-content" @click="doPush('bottom')">
          <svg class="icon" aria-hidden="true">
            <use xlink:href="#icon-a-ziyuan436"></use>
          </svg>
          <div class="text">置于底层</div>
        </div>

      </div>
      <div class="panel5" :style="{ 'display': canMerge() || canCancelMerge() ? '' : 'none' }">
        <div class="panel5-content" v-show="canMerge()" @click="canMerge() && doMerge()">
          <svg class="icon" aria-hidden="true">
            <use xlink:href="#icon-a-ziyuan406"></use>
          </svg>
          <div class="text">组合</div>
        </div>
        <div class="panel5-content" v-show="canCancelMerge()" @click="canCancelMerge() && doCancelMerge()">
          <svg class="icon" aria-hidden="true">
            <use xlink:href="#icon-a-ziyuan405"></use>
          </svg>
          <div class="text">取消组合</div>
        </div>
        <div class="panel5-content" v-show="canMerge()" @click="canMerge() && showAlignDialog($event)">
          <svg class="icon" aria-hidden="true">
            <use xlink:href="#icon-a-ziyuan450"></use>
          </svg>
          <div class="text">对齐</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import {DDeiEditor,DDeiEnumBusCommandType} from "ddei-framework";
import {DDeiEditorUtil} from "ddei-framework";
import {DDeiEditorState} from "ddei-framework";

export default {
  name: 'ddei-core-dialog-quickpop',
  extends: null,
  props: {
    //外部传入的插件扩展参数
    options: {
      type: Object,
      default: null
    },
    editor: {
      type: DDeiEditor,
      default: null
    }
  },
  data() {
    return {
      dialogId: 'ddei-core-dialog-quickpop',
      //当前选中的控件
      selectedModels: null,
      //当前操作
      operateState: null,
      //全部都是线条
      allLine: false,
      forceRefresh: false,
    };
  },
  computed: {},
  components: {},
  watch: {

  },
  created() {

  },
  mounted() {
    this.editor.dialogs[this.dialogId].viewer = this
    this.refreshData()
  },
  methods: {

    forceRefreshView: function () {
      this.forceRefresh = false
      this.$nextTick(() => {
        this.forceRefresh = true;
        if (this.refreshData) {
          this.refreshData();
        }
      });
    },
    refreshData(){
      let stage = this.editor.ddInstance.stage
      if (stage) {
        this.selectedModels = stage.selectedModels
        this.operateState = stage.render.operateState
        if (this.selectedModels?.size > 0) {
          let allLine = true
          this.selectedModels.forEach(model => {
            if (model.baseModelType != 'DDeiLine') {
              allLine = false
            }
          });
          this.allLine = allLine
        }
      }
    },
    exchangeLinePoint() {

      this.selectedModels?.forEach(model => {
        if (model.baseModelType == "DDeiLine") {
          model.exchangeStartAndEnd();
        }
      });
      this.editor.bus.push(DDeiEnumBusCommandType.AddHistroy);
      this.editor.bus.push(DDeiEnumBusCommandType.RefreshShape);
      this.editor.bus.executeAll();
      this.editor.editorViewer?.changeFileModifyDirty();
    },

    showSetStyleDialog(evt: Event) {
      let srcElement = evt.currentTarget;
      DDeiEditorUtil.showOrCloseDialog(this.editor,'ddei-core-dialog-setstyle', {
        group: "top-dialog"
      }, { type: 5 }, srcElement, false, true)
    },

    closeAllDialog() {
      DDeiEditorUtil.closeDialogs(this.editor)
    },

    showAlignDialog(evt: Event) {
      let srcElement = evt.currentTarget;
      DDeiEditorUtil.showOrCloseDialog(this.editor, "ddei-core-align_dialog", {
        group: "top-dialog"
      }, { type: 5 }, srcElement, false, true)
    },





    //是否可以取消组合
    canCancelMerge() {
      //获取当前选择控件
      let file = this.editor?.files[this.editor.currentFileIndex];
      let sheet = file?.sheets[file?.currentSheetIndex];
      let stage = sheet?.stage;
      if (stage?.selectedModels?.size > 0) {
        let models = Array.from(stage?.selectedModels.values())
        if (models[0].baseModelType == 'DDeiContainer' && models[0].layout == "compose") {
          return true;
        }

      }
      return false;
    },
    //是否可以组合
    canMerge() {
      return this.operateState != 50 && !this.allLine && this.selectedModels?.size > 1
    },

    /**
   * 执行组合
   */
    doMerge() {
      //获取当前选择控件
      let file = this.editor?.files[this.editor.currentFileIndex];
      let sheet = file?.sheets[file?.currentSheetIndex];
      let stage = sheet?.stage;
      if (stage?.selectedModels?.size > 1) {
        this.editor.bus.push(DDeiEnumBusCommandType.ModelMerge);
        this.editor.bus.executeAll();
      }
    },

    /**
     * 执行取消组合
     */
    doCancelMerge() {
      //获取当前选择控件
      let file = this.editor?.files[this.editor.currentFileIndex];
      let sheet = file?.sheets[file?.currentSheetIndex];
      let stage = sheet?.stage;
      if (stage?.selectedModels?.size > 0) {
        this.editor.bus.push(DDeiEnumBusCommandType.ModelCancelMerge);
        this.editor.bus.executeAll();

      }
    },

    //修改图形层次
    doPush(v) {
      //获取当前选择控件
      let file = this.editor?.files[this.editor.currentFileIndex];
      let sheet = file?.sheets[file?.currentSheetIndex];
      let stage = sheet?.stage;
      let stageRender = stage?.render;
      let optContainer = stageRender?.currentOperateContainer;
      if (optContainer) {
        this.editor.bus.push(DDeiEnumBusCommandType.ModelPush, {
          container: optContainer,
          type: v,
        });
        //渲染图形
        this.editor.bus.push(DDeiEnumBusCommandType.RefreshShape);
        this.editor.bus.executeAll();
      }
    },

    /**
    * 执行格式刷
    */
    execBrushAction(evt: Event) {
      if (this.editor.state == DDeiEditorState.QUICK_EDITING) {
        if (!this.editor?.ddInstance?.stage?.brushDataText) {
          this.editor?.hotkeys['ddei-core-keyaction-brush-data']?.action(evt, this.editor.ddInstance,this.editor);
        } else {
          delete this.editor.ddInstance.stage.brushDataText
        }
      } else {
        if (!this.editor?.ddInstance?.stage?.brushData) {
          this.editor?.hotkeys['ddei-core-keyaction-brush-data']?.action(evt, this.editor.ddInstance, this.editor);
        } else {
          delete this.editor.ddInstance.stage.brushData
        }
      }
    },
  }
};
</script>

<style lang="less" scoped>
/**以下是快捷样式编辑的弹出框 */
.ddei-core-dialog-quickpop {

  border: 1px solid var(--panel-border);//darken(var(--panel-header), 13%);
  box-shadow: 0px 2px 24px 0px hsl(0deg 0% 0% /0.25);//darken(var(--panel-header), 10%);
  border-radius: 6px;
  display: none;
  overflow: hidden;
  position: absolute;
  background-color: var(--panel-background);
  height: 80px;
  z-index: 990;
  user-select: none;
  color: var(--panel-title);

  .content {
    width: 100%;
    max-height: 70px;
    overflow-y: hidden;
    display: flex;
    justify-content: start;
    align-items: center;


    .panel1 {
      margin-top: 20px;
      width: 170px;
      height: 70px;
      border-right: 1px solid var(--panel-border);//darken(var(--panel-header), 13%);

      .panel1-content-1 {
        width: 100px;
        margin-left: 10px;
        float: left;
      }

      .panel1-content-2 {
        width: 50px;
        float: left;
      }

      .panel1-content-3 {
        width: 30px;
        padding-left: 10px;
        margin-top: 7px;
        float: left;
      }

      .panel1-split-3 {
        margin-left: 15px;
      }

      .panel1-content-4 {
        padding: 0px 5px;
        margin-top: 10px;
        float: left;
        border-radius: 2px;
      }

      .panel1-split-4 {
        margin-right: 5px;
      }

      .panel1-content-4:hover {
        background-color: var(--panel-hover);
        cursor: pointer
      }
    }

    .panel2 {
      margin-top: 10px;
      width: 60px;
      height: 60px;
      display: flex;
      justify-content: center;
      align-items: center;
      text-align: center;
      border-right: 1px solid var(--panel-border);//darken(var(--panel-header), 13%);

      .panel2-content {
        flex: 1;
        border-radius: 4px;
      }

      .panel2-content:hover {
        background-color: var(--panel-hover);
        cursor: pointer
      }
    }

    .panel3 {
      margin-top: 10px;
      width: 150px;
      height: 60px;
      display: flex;
      justify-content: center;
      align-items: center;
      text-align: center;
      border-right: 1px solid var(--panel-border);//darken(var(--panel-header), 13%);

      .panel3-content {
        flex: 1;
        border-radius: 4px;
      }

      .panel3-content:hover {
        background-color: var(--panel-hover);
        cursor: pointer
      }

      .i1 {
        .icon {
          font-size: 20px;
          margin-top: 5px;
          margin-bottom: 2px;
        }
      }

      .i2 {
        .ddei-editor-quick-fat-item-box {
          width: 22px;
          height: 26px;
          margin: 0 auto;
          margin-top: 4px;

          :deep(.icon) {
            flex: 0 0 22px !important;
          }
        }
      }

      .i3 {
        .ddei-editor-quick-fat-item-box {
          width: 22px;
          height: 28px;
          margin: 0 auto;
          margin-top: 3px;

          :deep(.icon) {
            flex: 0 0 24px !important;
          }
        }
      }
    }

    .panel4 {
      margin-top: 10px;
      padding-left: 10px;
      height: 60px;
      display: flex;
      justify-content: center;
      align-items: center;
      text-align: center;

      .panel4-content {
        margin-right: 10px;
        flex: 1;

        .icon {
          margin-top: 2px;
          margin-bottom: 1px;
        }

        border-radius: 4px;
      }


      .panel4-content:hover {
        background-color: var(--panel-hover);
        cursor: pointer
      }

    }

    .panel5 {
      margin-top: 10px;
      height: 60px;
      padding-left: 10px;
      display: flex;
      justify-content: center;
      align-items: center;
      text-align: center;

      border-left: 1px solid var(--panel-border);//darken(var(--panel-header), 13%);

      .panel5-content {
        margin-right: 10px;
        flex: 1;

        .text {
          white-space: nowrap;
        }

        .icon {
          margin-top: 2px;
          margin-bottom: 1px;
        }

        border-radius: 4px;
      }


      .panel5-content:hover {
        background-color: var(--panel-hover);
        cursor: pointer
      }

    }

    .panel12 {
      margin-top: 20px;
      width: 225px;
      height: 70px;
      border-right: 1px solid var(--panel-border);//darken(var(--panel-header), 13%);

      .panel12-content-1 {
        width: 100px;
        margin-left: 10px;
        float: left;
      }

      .panel12-content-2 {
        width: 50px;
        float: left;
      }

      .panel12-content-5 {

        padding-left: 5px;
        float: left;
      }

      .panel12-content-3 {
        width: 30px;
        padding-left: 10px;
        margin-top: 10px;
        float: left;
      }


      .panel12-split-3 {
        margin-left: 12px !important;
      }

      .panel12-content-4 {
        padding: 0px 5px;
        margin-left: 2px;
        margin-top: 12px;
        float: left;
        border-radius: 2px;
      }

      .panel12-split-4 {
        margin-right: 5px;
      }

      .panel12-content-4:hover {
        background-color: var(--panel-hover);
        cursor: pointer
      }
    }

    .panel6 {
      margin-top: 10px;
      padding-left: 10px;
      height: 60px;
      display: flex;
      justify-content: center;
      align-items: center;
      text-align: center;

      &-content1 {
        margin-right: 10px;
        white-space: nowrap;
        flex: 1;

        .icon {
          margin-top: 2px;
          margin-bottom: 1px;
        }

        border-radius: 4px;
      }

      &-content {
        margin-right: 10px;

        .icon {
          margin-top: 2px;
          margin-bottom: 1px;
        }

        border-radius: 4px;
      }

      .type {
        padding-left: 5px;
        padding-right: 5px;

        .ddei-pv-line-type-combox {
          width: 22px;
          height: 28px;
          margin: 5px auto 1px auto;

          :deep(.icon) {
            flex: 0 0 26px !important;
          }
        }
      }

      .color2 {

        padding-left: 5px;
        padding-right: 5px;

        .ddei-editor-quick-fat-item-box {
          width: 22px;
          height: 28px;
          margin: 5px auto 3px auto;

          :deep(.icon) {
            flex: 0 0 26px !important;
          }
        }
      }

      .dash {
        width: 50px;
        margin-top: 8px;
      }

      .brush {
        width: 50px;
        margin-top: 4px;
      }

      .pointtype {
        width: 70px;
        margin-top: 4px;
      }

      .exchange {
        flex: 0 0 20px !important;
        margin-top: -20px;
        padding: 0px 2px;

        .icon {
          font-size: 22px;
        }
      }




      &-content:hover {
        background-color: var(--panel-background);
        cursor: pointer
      }

      &-content1:hover {
        background-color: var(--panel-background);
        cursor: pointer
      }

    }

  }

  .brush-selected {
    background-color: var(--panel-selected);
  }


}
</style>
