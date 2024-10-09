<template>
  <div @mousedown="changeEditorFocus" v-if="forceRefresh" @mouseup="cancelCreateControl($event)" ref="toolbox"
    class="ddei-core-panel-toolbox">
    <div class="ddei-core-panel-toolbox-header">
      <div class="header-1"></div>
      <svg class="icon icon1" v-if="custom" aria-hidden="true">
        <use xlink:href="#icon-a-ziyuan417"></use>
      </svg>
      <div class="header-3" v-if="custom"></div>
      <div class="ddei-core-panel-toolbox-header-morecontrol" v-if="custom" @click="showChooseDialog($event)">
        <div class="header-4">更多图形</div>
        <div class="header-3"></div>
        <svg class="icon icon2" aria-hidden="true">
          <use xlink:href="#icon-a-ziyuan466"></use>
        </svg>
      </div>
      <div style="flex:1"></div>
      <svg class="icon header-7" aria-hidden="true" v-if="expand" @click="hiddenToolBox">
        <use xlink:href="#icon-a-ziyuan475"></use>
      </svg>
    </div>
    <div class="ddei-core-panel-toolbox-searchbox" v-if="search">
      <div class="ddei-core-panel-toolbox-searchbox-group">
        <svg class="icon" aria-hidden="true" @click="searchControl" title="搜索">
          <use xlink:href="#icon-a-ziyuan416"></use>
        </svg>
        <input v-model="searchText" class="input" @keypress="searchInputEnter" placeholder="搜索控件" autocomplete="off"
          name="ddei_toolbox_search_input">
      </div>
    </div>

    <div class="ddei-core-panel-toolbox-groups" @mousewheel="mouseWheel($event)"
      :style="{ height: 'calc(100vh - ' + (editor?.topHeight + editor?.bottomHeight + 90) + 'px' }">
      <div v-for="group in groups" v-show="group.display == true" class="ddei-core-panel-toolbox-groups-group">
        <div
          :class="{ 'ddei-core-panel-toolbox-groups-group-box': true, 'ddei-core-panel-toolbox-groups-group--expanded': group.expand }"
          @click="groupBoxExpand(group)">
          <span class="title">{{ group.name }}</span>
          <svg v-if="custom && !group.cannotClose" class="icon close" aria-hidden="true" @click="groupBoxClose(group)"
            title="关闭">
            <use xlink:href="#icon-a-ziyuan422"></use>
          </svg>
        </div>
        <div class="ddei-core-panel-toolbox-groups-group-itempanel" v-if="group.expand == true">
          <div class="ddei-core-panel-toolbox-groups-group-itempanel-item" :title="control.desc"
            @mousedown="createControlPrepare(control, $event)" v-for="control in group.controls">
            <img class="icon" v-if="!control.icon" :src="editor?.icons[control.id]" />
            <div v-if="control.icon" v-html="control.icon"></div>
            <div class="text">{{ control.name }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import {DDeiEditor} from "ddei-framework";
import {DDeiEnumOperateType} from "ddei-framework";
import {DDei} from "ddei-framework";
import {DDeiEditorState} from "ddei-framework";
import { cloneDeep, trim } from "lodash";
import {DDeiAbstractShape} from "ddei-framework";
import {DDeiEditorUtil} from "ddei-framework";
import {DDeiEnumControlState} from "ddei-framework";
import { Matrix3 } from "three";
import {DDeiEditorEnumBusCommandType} from "ddei-framework";
import {DDeiUtil} from "ddei-framework";
import {DDeiRectContainer} from "ddei-framework";
import {DDeiLineLink} from "ddei-framework";
import {DDeiEnumBusCommandType} from "ddei-framework";
import { clone } from 'lodash'
import {DDeiEnumOperateState} from "ddei-framework";

export default {
  name: "ddei-core-panel-toolbox",
  extends: null,
  mixins: [],
  props: {
    //外部传入的插件扩展参数
    options: {
      type: Object,
      default: null
    },
    editor: {
      type: DDeiEditor,
      default: null,
    },
    //是否允许自定义控件工具箱
    custom: {
      type: Boolean,
      default: true
    },
    //是否允许搜索控件
    search: {
      type: Boolean,
      default: true
    },
    //定义分组
    customGroups:{
      type: Array,
      default: null
    },
    //是否允许展开收折
    expand: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      //分组数据
      groups: [],
      //用于搜索时保存原始的groups
      searchOriginGroups: null,
      //搜索控件时用的文本
      searchText: "",
      forceRefresh:true,
    };
  },
  computed: {},
  watch: {},
  created() {
   },
  mounted() {
    this.refreshData();
  },
  methods: {

    //强制刷新当前以及下层组件
    forceRefreshParts(parts) {
      if (!parts || parts == 'toolbox' || parts.indexOf('toolbox') != -1){
        this.forceRefresh = false
        this.$nextTick(() => {
          this.forceRefresh = true;
          if (this.refreshData) {
            this.refreshData();
          }
        });
      }
    },

    refreshData(){
      this.editor.needControlIcon = true;
      this.editor.toolBarViewer = this;
      if (this.editor.ddInstance && !this.editor.ddInstance.render) {
        this.editor.ddInstance.initRender()
      }
      //加载工具栏
      DDeiEditorUtil.readRecentlyToolGroups()
      let hisGroups = DDeiEditorUtil.recentlyToolGroups;
      if (hisGroups?.length > 0) {
        let groups = []
        hisGroups.forEach(hg => {
          let group = null;
          for (let i = 0; i < this.editor.groups.length; i++) {
            if (this.editor.groups[i].id == hg.id) {
              group = this.editor.groups[i]
              break;
            }
          }
          if (group) {
            group.expand = hg.expand
            groups.push(group)
          }
        })
        this.groups = groups;
      } else {
        this.groups = clone(this.editor.groups)
        DDeiEditorUtil.whiteRecentlyToolGroups(this.groups)
      }
      if (this.customGroups) {
        let newGroups = []
        this.customGroups?.forEach(cg => {
          for (let i = 0; i < this.groups.length; i++) {
            if (this.groups[i].id == cg) {
              newGroups.push(this.groups[i])
              break;
            }
          }

        });
        this.groups = newGroups
      }
      this.searchOriginGroups = this.groups;
    },

    mouseWheel(evt) {
      if (evt.currentTarget.clientHeight < evt.currentTarget.scrollHeight) {
        evt.cancelBubble = true;
        return false;
      }
    },

    cancelCreateControl(e) {
      if (this.editor.state == DDeiEditorState.CONTROL_CREATING) {
        if (this.editor.creatingControls) {
          let ddInstance: DDei = this.editor.ddInstance;
          let layer = ddInstance.stage.layers[ddInstance.stage.layerIndex];
          //从layer中移除控件
          layer.removeModels(this.editor.creatingControls,true,false);

          //清除临时变量
          this.editor.bus.push(DDeiEnumBusCommandType.ClearTemplateVars);
          //渲染图形
          this.editor.bus.push(DDeiEnumBusCommandType.RefreshShape, null, e);
        }
        this.editor.bus.push(DDeiEditorEnumBusCommandType.ClearTemplateUI);
        this.editor.changeState(DDeiEditorState.TOOLBOX_ACTIVE);
        this.editor.bus.executeAll();
        e.preventDefault()
        e.cancelBubble = true
      }

    },

    /**
     * 弹出选择控件Dialog
     */
    showChooseDialog(evt) {
      let srcElement = evt.currentTarget;
      let selectGroups = []
      this.groups.forEach(group => {
        if (group.display) {
          selectGroups.push(group.id)
        }
      });
      DDeiEditorUtil.showOrCloseDialog(this.editor,"ddei-core-dialog-choosecontrolgroup", {
        selectGroups: selectGroups,
        callback: {
          select: this.groupBoxChoose
        },
        group: "toolbox-dialog"
      }, { type: 4 }, srcElement)

    },

    

    /**
     * 隐藏工具栏
     */
    hiddenToolBox() {
      window.leftWidth = this.editor.leftWidth
      this.editor.leftWidth = 0;
      this.editor.changeState(DDeiEditorState.DESIGNING);

    },

    /**
     * 展开或收折groupbox
     */
    groupBoxExpand(group: object) {
      if (group) {
        group.expand = !group.expand;
        DDeiEditorUtil.whiteRecentlyToolGroups(this.groups)
      }
    },

    /**
     * 关闭groupbox
     */
    groupBoxClose(group: object) {
      if (group) {
        group.display = false;
        if (this.groups.indexOf(group) != -1) {
          this.groups.splice(this.groups.indexOf(group), 1)
        }
        DDeiEditorUtil.whiteRecentlyToolGroups(this.groups)
      }
    },
    /**
   * 关闭groupbox
   */
    groupBoxOpen(group: object) {
      if (group) {
        group.display = true;
        if (this.groups.indexOf(group) == -1) {
          this.groups.push(group)
        }
        DDeiEditorUtil.whiteRecentlyToolGroups(this.groups)
      }
    },

    /**
     * 选择groupBox
     */
    groupBoxChoose(groupid: object, choose: boolean) {
      let group = null
      for (let i = 0; i < this.editor.groups.length; i++) {
        if (this.editor.groups[i].id == groupid) {
          group = this.editor.groups[i]
          break;
        }
      }
      if (choose) {
        this.groupBoxOpen(group)
      } else {
        this.groupBoxClose(group)
      }
    },

    /**
     * 搜索按钮按下时，检测是否按下enter，按下后执行搜索
     * @param evt
     */
    searchInputEnter(evt) {
      if (evt.keyCode == 13) {
        this.searchControl();
      }
    },

    /**
     * 焦点进入当前区域
     */
    changeEditorFocus() {
      this.editor.changeState(DDeiEditorState.TOOLBOX_ACTIVE);
      this.editor.bus.push(DDeiEditorEnumBusCommandType.ClearTemplateUI);
      this.editor.bus.executeAll();
    },

    /**
     * 准备创建
     */
    createControlPrepare(control, e) {
      //获取当前实例
      let ddInstance: DDei = this.editor.ddInstance;
      ddInstance.render.inEdge = 0;
      let stage = ddInstance.stage;
      let layer = stage.layers[stage.layerIndex];
      if ((layer.display == 0 && !layer.tempDisplay) || layer.lock) {
        return;
      }
      let controlInitJSON = DDeiEditorUtil.getModelInitJSON(this.editor.ddInstance, null, [control])
      if (!controlInitJSON) {
        return;
      }
      //创建并初始化控件以及关系
      let models = DDeiEditorUtil.createControl(controlInitJSON[0],this.editor)
      //加载事件的配置
      
      let rsState = DDeiUtil.invokeCallbackFunc("EVENT_CONTROL_CREATE_BEFORE", DDeiEnumOperateType.CREATE, { models: models }, ddInstance, e)
      if (rsState == 0 || rsState == 1) {
        //选中前
        DDeiUtil.invokeCallbackFunc("EVENT_MOUSE_OPERATING", DDeiEnumOperateType.CREATE, null, ddInstance, e)
        let stageRatio = stage.getStageRatio();
        let moveMatrix = new Matrix3(
          1,
          0,
          -stage.wpv.x * stageRatio,
          0,
          1,
          -stage.wpv.y * stageRatio,
          0,
          0,
          1
        );
        models.forEach(model => {
          model.transVectors(moveMatrix);
          model.setState(DDeiEnumControlState.CREATING);
        })


        if (models?.length > 0) {

          let ddInstance = this.editor.ddInstance;
          let stage = ddInstance.stage;
          if (stage?.render?.operateState == DDeiEnumOperateState.QUICK_EDITING && stage?.render?.editorShadowControl) {
            DDeiUtil.getEditorText()?.enterValue()
          }
          //修改编辑器状态为控件创建中
          this.editor.changeState(DDeiEditorState.CONTROL_CREATING);
          //设置正在需要创建的控件
          this.editor.creatingControls = models;
          this.editor.bus?.push(DDeiEditorEnumBusCommandType.ClearTemplateUI);
          this.editor.bus?.executeAll();
        }
        e.preventDefault()
        e.cancelBubble = true
      }
    },


    /**
     * 搜索控件
     */
    searchControl() {
      //如果清空搜索框则还原
      let text = trim(this.searchText);
      if (text == "") {
        this.groups = this.searchOriginGroups;
      }
      //如果搜索框有内容则搜索
      else {
        let searchControls = [];
        let gp = {};
        gp.name = "搜索结果";
        this.searchOriginGroups.forEach((group) => {
          if (group.controls) {
            group.controls.forEach((control) => {
              if (
                control.code.indexOf(text) != -1 ||
                control.name.indexOf(text) != -1
              ) {
                searchControls.push(control);
              }
            });
          }
        });
        gp.controls = cloneDeep(searchControls);
        gp.display = true;
        gp.expand = true;
        gp.cannotClose = true;
        this.groups = [gp];
      }
    },
  },
};
</script>

<style lang="less" scoped>
.icon{
  color:var(--icon);
}
.ddei-core-panel-toolbox {
  user-select: none;
  text-align: center;
  display: flex;
  flex-flow: column;
  height: 100%;

  /**以下为收折框 */
  &-header {
    background:var(--toolbox-header);
    border-bottom: 1px solid var(--toolbox-header);//darken(@toolbox-header, 13%);
    flex: 0 0 30px;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 0px 8px;

    &-morecontrol {
      display: flex;
      justify-content: center;
      align-items: center;
      flex: 0 1 100px;

      .header-3 {
        flex: 0 1 8px
      }

      .header-4 {
        font-size: 16px;
        flex: 0 1 70px;
        font-weight: bold;
        color:var(--toolbox-title);
      }

      &:hover {
        background-color:var(--toolbox-hover);//darken(var(--toolbox-hover), 5%);
        cursor: pointer;
      }

    }


    .header-1 {
      flex: 0 1 17px
    }

    .header-2 {
      font-size: 14px;
    }



    .header-7 {
      font-size: 18px;
      &:hover{
        background-color:var(--toolbox-hover);
        cursor:pointer;
      }
    }

    .icon1 {
      font-size: 23px;
    }

    .icon2 {
      font-size: 16px;
    }
  }

  &-searchbox {
    flex: 0 0 52px;
    display: flex;
    justify-content: center;
    align-items: center;
    background:var(--toolbox-background);

    &-group {
      flex: 1;
      margin: 0 25px;
      height: 32px;
      background:var(--toolbox-header);
      border: 1px solid var(--toolbox-header);//darken(@toolbox-header,13%);
      border-radius: 4px;
      display: flex;
      justify-content: center;
      align-items: center;

      .icon {
        font-size: 24px;
        margin: 0 6px;
      }

      .input {
        flex: 1 1 140px;
        height: 28px;
        width: 100%;
        border: transparent;
        outline: none;
        background: transparent;
        font-size: 16px;
        font-weight: 400;
        color:var(--toolbox-title);

        &::placeholder {
          /* Chrome, Firefox, Opera, Safari 10.1+ */
          color:var(--placeholder);
        }

        &::-webkit-input-placeholder {
          /* WebKit browsers，webkit内核浏览器 */
          color:var(--placeholder);
        }

        &:-moz-placeholder {
          /* Mozilla Firefox 4 to 18 */
          color:var(--placeholder);
        }

        &::-moz-placeholder {
          /* Mozilla Firefox 19+ */
          color:var(--placeholder);
        }

        &:-ms-input-placeholder {
          /* Internet Explorer 10-11 */
          color:var(--placeholder);
        }

        &::-ms-input-placeholder {
          /* Microsoft Edge */
          color:var(--placeholder);
        }
      }
    }
  }

  &-groups {
    text-align: center;
    background: var(--toolbox-background,--panel-background);
    overflow-y: auto;
    display: flex;
    flex-flow: column;
    flex: 1 1 auto;
    

    &-group {
      text-align: center;
      margin-bottom: 1px;

      &-box {
        display: flex;
        height: 35px;
        background:var(--toolbox-header);
        user-select: none;
        justify-content: center;
        align-items: center;

        &:hover {
          background-color:var(--toolbox-header);
        }

        &:active {
          background-color:var(--toolbox-header);
        }
        .title {
          flex: 1;
          color:var(--toolbox-title);
          text-align: left;
          margin-left: 25px;
          font-size: 16px;
          font-weight: bold;
        }

        .close {
          margin-right: 10px;
          font-size: 18px;

          &:hover {
            color:var(--toolbox-title)-hover;
            cursor: pointer;
          }
        }
      }

      &-itempanel {
        display: flex;
        flex-flow: row wrap;
        background:var(--toolbox-background);
        padding: 15px 15px 15px 15px;

        &-item {
          flex: 0 0 62px !important;
          height: 60px;
          margin: 15px 0px;
          display: flex;
          overflow: hidden;
          justify-content: center;
          align-items: center;
          flex-flow: column;
          &:hover {
            background:var(--toolbox-control-hover);
            outline:var(--toolbox-control-hover-outline);
            cursor: all-scroll;
          }

          .text {
            white-space: nowrap;
            text-align: center;
            font-size: 13px;
            font-weight: 400;
            color:var(--toolbox-control-title);
          }
          .icon {
            width: 90%;
            height: 90%;
            object-fit: contain;
          }
        }
      }

      &--expanded {
        background-color:var(--toolbox-header);
      }
    }
  }

}
</style>
