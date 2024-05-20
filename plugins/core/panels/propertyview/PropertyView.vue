<template>
  <div v-if="forceRefresh" ref="propertyView"
    :class="{ 'propertyview': true, 'propertyview--disabled': propertyDisabled }" @mousedown="changeEditorFocus">
    <div class="propertyview-header">
      <svg aria-hidden="true" v-if="expand"
        :class="{ 'icon': true, 'header-7': propertyViewShow, 'header-7-expand': !propertyViewShow }"
        @click="hidOrShowPV">
        <use v-if="propertyViewShow" xlink:href="#icon-a-ziyuan474"></use>
        <use v-if="!propertyViewShow" xlink:href="#icon-a-ziyuan475"></use>
      </svg>
      <div style="flex:1"></div>
      <svg class="icon ding" aria-hidden="true" v-if="propertyViewShow">
        <use xlink:href="#icon-a-ziyuan410"></use>
      </svg>
    </div>
    <div class="content">
      <div class="propertyview-subgroup" v-show="editor?.rightWidth > pvGroupWidth">
        <div class="propertyview-subgroup-tabtitle">
          <div
            :class="currentTopGroup?.subGroups.length > 1 && subGroup.selected ? 'propertyview-subgroup-tabtitle-item--selected' : 'propertyview-subgroup-tabtitle-item'"
            v-show="!subGroup.empty" v-for="subGroup in currentTopGroup?.subGroups" :title="subGroup.name"
            @mouseup="changeSubGroup(subGroup)">{{
            subGroup.name }}</div>
        </div>
        <div class="propertyview-subgroup-tabpanel" @mousewheel="mouseWheel($event)" :style="panelStyle">
          <div
            :class="{ 'propertyview-subgroup-tabpanel-editors-column': attrDefine.display == 'column', 'propertyview-subgroup-tabpanel-editors-row': attrDefine.display != 'column', 'empty-value': attrDefine.value ? false : true }"
            v-for="attrDefine in currentSubGroup?.children" :title="attrDefine.desc"
            v-show="attrDefine?.visiable && !attrDefine?.forceHidden">
            <div class="title" v-if="!attrDefine.hiddenTitle && attrDefine?.visiable != false">{{ attrDefine.name
              }}<span v-if="attrDefine.notNull">*</span>：
            </div>
            <div class="editor" v-if="attrDefine.visiable != false">
              <component :editor="editor" :controlDefine="controlDefine"
                :is="editor?.getPropEditor(attrDefine.controlType)" v-if="reFresh && attrDefine?.visiable != false"
                :attrDefine="attrDefine"></component>
            </div>
          </div>
        </div>
      </div>
      <div class="propertyview-groupview" ref="propertyviewGroupview">
        <div class="propertyview-groupview-items">
          <div
            :class="topGroup.selected ? 'propertyview-groupview-items-item--selected' : 'propertyview-groupview-items-item'"
            v-for="topGroup in topGroups" v-show="!topGroup?.empty" @click="changeTopGroup(topGroup)"
            :title="topGroup.name">
            <svg class="icon img" aria-hidden="true">
              <use :xlink:href="'#' + topGroup.img"></use>
            </svg>
          </div>
        </div>
      </div>


    </div>
  </div>
</template>

<script lang="ts">
import {DDeiEditorUtil} from "ddei-framework";
import {DDeiEditor} from "ddei-framework";
import { cloneDeep, first } from "lodash";
import {DDeiUtil} from "ddei-framework";
import {DDeiAbstractShape} from "ddei-framework";
import {DDeiEditorArrtibute } from "ddei-framework";
import {DDeiEditorState} from "ddei-framework";
import {DDeiEditorEnumBusCommandType} from "ddei-framework";
import {DDeiEnumOperateType} from "ddei-framework";
export default {
  name: "ddei-core-panel-propertyview",
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
    //是否允许展开收折
    expand:{
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      //当前被选中控件的引用
      selectedModels: null,
      //属性定义的引用
      controlDefine: null,
      //当前的顶级group
      topGroups: null,
      currentTopGroup: null,
      currentSubGroup: null,
      reFresh: true,
      propertyDisabled: false,
      propertyViewShow: true,
      pvGroupWidth: 0,
      panelStyle: "height:calc(100vh - 202px)",
      rightRate: 0,//右边部分所占的比例
      forceRefresh:true,
    };
  },
  computed: {},
  watch: {
    currentSubGroup() {
      this.forceRefreshSub();
    },
  },
  components: {

  },
  created() {
    // 监听obj对象中prop属性的变化
    this.$watch("editor.ddInstance.stage.selectedModels", this.refreshAttrs);
    // 监听obj对象中prop属性的变化
    this.$watch("editor.maxWidth", function (newVal, oldVal) {
      if (this.rightRate == 0) {
        this.rightRate = this.editor.rightWidth / document.body.clientWidth
      }
    });
  },
  mounted() {
    
  },
  methods: {

    //强制刷新当前以及下层组件
    forceRefreshParts(parts) {
      if (!parts || parts == 'property' || parts.indexOf('property') != -1) {
        this.forceRefresh = false
        this.$nextTick(() => {
          this.forceRefresh = true;
          if (this.refreshData) {
            this.refreshData();
          }
        });
      }
    },

    refreshData() {
      this.editor.properyViewer = this;
      this.refreshAttrs();
    },

    mouseWheel(evt) {
      if (evt.currentTarget.clientHeight < evt.currentTarget.scrollHeight) {
        evt.cancelBubble = true;
        return false;
      }
    },
    forceRefreshSub() {
      this.reFresh = false;
      this.propertyDisabled = false
      this.$nextTick(() => {
        this.propertyDisabled = (this.editor.state == DDeiEditorState.QUICK_EDITING)
        this.reFresh = true;
      });
    },

    refreshAttrs(newVal, oldVal) {
      let firstControlDefine;
      let firstModel;
      if (!this.editor.currentControlDefine) {
        let models: DDeiAbstractShape[] = [this.editor.ddInstance.stage];
        firstModel = models[0];
        this.selectedModels = models;
        firstControlDefine = cloneDeep(
          this.editor.controls.get(firstModel?.modelCode)
        );
      } else {
        this.selectedModels = this.editor.ddInstance.stage.selectedModels;
        firstModel = Array.from(this.selectedModels.values());
        firstControlDefine = this.editor.currentControlDefine
      }
      //获取第一个组件及其定义
      if (firstControlDefine) {
        let topGroups = null;
        if (firstControlDefine.type == "DDeiStage") {
          //加载layer的配置
          let layerControlDefine = cloneDeep(
            this.editor.controls.get("DDeiLayer")
          );
          let layer = firstModel.layers[firstModel.layerIndex];
          layerControlDefine.attrDefineMap.forEach((attrDefine, attrKey) => {
            //当前属性的定义
            attrDefine.value = DDeiUtil.getDataByPathList(
              layer,
              attrDefine.code,
              attrDefine.mapping
            );
            attrDefine.model = layer;
          });
          firstControlDefine.groups.forEach(topGroup => {
            topGroup.img = topGroup.icon
          });
          layerControlDefine.groups.forEach(topGroup => {
            topGroup.img = topGroup.icon
          });
          topGroups = layerControlDefine.groups.concat(firstControlDefine.groups)

        }
        else {
          //同步引用关系
          firstControlDefine.groups.forEach(topGroup => {
            topGroup.img = topGroup.icon
          });
          topGroups = firstControlDefine.groups
        }
        if (topGroups?.length > 0) {
          //上一次编辑的名称
          let upName = this.currentTopGroup?.name;
          let currentTopGroup = null;
          if (upName) {
            for (let x = 0; x < firstControlDefine.groups.length; x++) {
              let topGroup = topGroups[x];
              if (!topGroup.empty &&
                upName == topGroup.name) {
                topGroup.selected = true;
                currentTopGroup = topGroup;
                break;
              }
            }
          }
          if (!currentTopGroup) {
            topGroups[0].selected = true
            currentTopGroup = topGroups[0]
          }
          this.currentTopGroup = currentTopGroup;
          this.controlDefine = firstControlDefine;
          this.topGroups = topGroups;
          //上一次编辑的名称
          let upSubGroupName = this.currentSubGroup?.name;
          let currentSubGroup = null;
          if (upSubGroupName) {
            for (let sgi = 0; sgi < currentTopGroup?.subGroups.length; sgi++) {
              if (
                !currentTopGroup?.subGroups[sgi]?.empty &&
                upSubGroupName == currentTopGroup?.subGroups[sgi]?.name
              ) {
                currentSubGroup = currentTopGroup?.subGroups[sgi];
                break;
              }
            }
          }
          if (!currentSubGroup) {
            for (let sgi = 0; sgi < currentTopGroup?.subGroups.length; sgi++) {
              if (!currentTopGroup?.subGroups[sgi]?.empty) {
                currentSubGroup = currentTopGroup?.subGroups[sgi];
                break;
              }
            }
          }
          this.changeSubGroup(currentSubGroup);
        } else {
          //清除信息
          this.controlDefine = null;
          this.topGroups = null;
          if (this.currentTopGroup) {
            this.currentTopGroup.subGroups = null;
          }
          if (this.currentSubGroup) {
            this.currentSubGroup.children = null;
          }
          this.editor.currentControlDefine = null;
        }
      }
    },

    getFirstChildAttrsGroup(control) {
      if (control.models?.size > 0) {
        let firstControl = control.models.get(control.midList[0])
        let curDefine = this.editor.controls.get(firstControl.modelCode);
        if (curDefine.groups?.length > 0) {
          let returnGroups = curDefine.groups;
          returnGroups.forEach(group => {
            group?.subGroups.forEach(subGroup => {
              subGroup.children?.forEach(attrDefine => {
                attrDefine.value = DDeiUtil.getDataByPathList(
                  firstControl,
                  attrDefine.code,
                  attrDefine.mapping
                );
                attrDefine.model = firstControl
              });
            });
          });
          return returnGroups;
        } else if (firstControl.baseModelType == 'DDeiContainer' && firstControl.layout == 'compose') {
          return this.getFirstChildAttrsGroup(firstControl)
        }
      }
      return null
    },

    /**
     * 展开顶级属性，收起其他顶级层级
     */
    changeTopGroup(pData) {
      if (this.currentTopGroup != pData) {
        this.topGroups.forEach((group) => {
          if (group != pData) {
            group.selected = false;
          }
        });
        pData.selected = true;
        this.currentTopGroup = pData;
        //上一次编辑的名称
        let upSubGroupName = this.currentSubGroup?.name;
        let currentSubGroup = null;
        if (upSubGroupName) {
          for (let sgi = 0; sgi < pData?.subGroups.length; sgi++) {
            if (
              !pData?.subGroups[sgi]?.empty &&
              upSubGroupName == pData?.subGroups[sgi]?.name
            ) {
              currentSubGroup = pData?.subGroups[sgi];
              break;
            }
          }
        }
        if (!currentSubGroup) {
          for (let sgi = 0; sgi < pData?.subGroups.length; sgi++) {
            if (!pData?.subGroups[sgi]?.empty) {
              currentSubGroup = pData?.subGroups[sgi];
              break;
            }
          }
        }
        this.changeSubGroup(currentSubGroup);
      }
    },

    /**
     * 展开次级属性，收起其他次级层级
     */
    changeSubGroup(pData) {
      if (this.currentSubGroup != pData) {
        this.currentTopGroup.subGroups.forEach((group) => {
          if (group != pData) {
            group.selected = false;
          }
        });

        pData.selected = true;
        this.selectedModels = this.editor.ddInstance.stage.selectedModels;
        let models: DDeiAbstractShape[] = null;
        if (this.selectedModels?.size > 0) {
          //获取当前所有组件的公共属性定义
          models = Array.from(this.selectedModels.values());
        } else {
          //获取当前所有组件的公共属性定义
          models = [this.editor.ddInstance.stage];
        }
        pData?.children?.forEach((attd) => {
          //判断当前属性是否可编辑
          let rsState = DDeiUtil.invokeCallbackFunc("EVENT_CONTROL_VIEW_BEFORE", DDeiEnumOperateType.VIEW, { models: models, propName: attd?.code }, this.editor.ddInstance, null)
          if (rsState == 0 || rsState == 1) {
            attd.forceHidden = false;
          } else {
            attd.forceHidden = true;
          }
        });
        this.currentSubGroup = pData;
      }
      setTimeout(() => {
        this.$forceUpdate();
      }, 100);
    },


    syncAttrsToGroup(firstControlDefine: object, pData: object): void {
      let newChildren = [];
      if (pData?.groups?.length > 0) {
        pData?.groups?.forEach((group) => {
          let newGroupChildren = [];
          group.children?.forEach((curAttr: DDeiEditorArrtibute) => {
            let mapObj = firstControlDefine?.attrDefineMap?.get(curAttr.code);
            if (mapObj && mapObj.visiable != false) {
              mapObj.topGroup = pData;
              mapObj.modelCode = firstControlDefine.type;
              newGroupChildren.push(mapObj);
              newChildren.push(mapObj);
            }
          });
          group.children = newGroupChildren;
          if (newGroupChildren.length == 0) {
            group.empty = true;
          }
        });
      }
      pData.children = newChildren;
      if (newChildren.length == 0) {
        pData.empty = true;
      }
    },

    /**
     * 隐藏or展示属性编辑器
     */
    hidOrShowPV() {
      this.propertyViewShow = !this.propertyViewShow
      let pvFullWidth = document.body.clientWidth * this.rightRate;
      //获取最右边区域的大小
      let pvGroupViewEle = this.$refs.propertyviewGroupview
      this.pvGroupWidth = pvGroupViewEle.clientWidth
      if (this.editor.rightWidth > this.pvGroupWidth) {
        let deltaX = pvFullWidth - this.pvGroupWidth;
        this.editor.rightWidth = this.pvGroupWidth;
        //重新设置画布大小
        this.editor.middleWidth += deltaX;
      } else {
        let deltaX = pvFullWidth - this.pvGroupWidth;
       
        this.editor.rightWidth = pvFullWidth;
        //重新设置画布大小
        this.editor.middleWidth -= deltaX;
      }
      this.editor.changeState(DDeiEditorState.DESIGNING);
    },

    /**
     * 焦点进入当前区域
     */
    changeEditorFocus() {
      if (this.editor.state != DDeiEditorState.PROPERTY_EDITING && this.editor.state != DDeiEditorState.QUICK_EDITING) {
        this.editor.changeState(DDeiEditorState.PROPERTY_EDITING);
      }
      this.editor.bus.push(DDeiEditorEnumBusCommandType.ClearTemplateUI);
      this.editor.bus.executeAll();

    },
  },
};
</script>

<style lang="less" scoped>
.propertyview {
  display: flex;
  flex-direction: column;
  background: var(--panel-background);
  display: flex;
  user-select: none;

  &-header {
    background: var(--panel-header);
    border-bottom: 1px solid #D5D5DF;
    flex: 0 0 30px;
    display: flex;
    justify-content: center;
    align-items: center;



    .header-7 {
      font-size: 18px;
      margin-left: 8px;
      margin-right: 4px;
    }

    .header-7-expand {
      font-size: 18px;
      margin-left: 4px;
      margin-right: 4px;
    }


    .ding {
      font-size: 20px;
      margin-right: 4px;
    }

  }

  .content {
    flex: 1;
    display: flex;
  }

  &-subgroup {
    flex: 1;
    display: flex;
    flex-flow: column;
    &-tabtitle {
      flex: 0 0 46px;
      display: flex;
      border-bottom: 1pt solid rgb(235, 235, 239);
      color: grey;
      &-item {
        flex: 1;
        text-align: center;
        font-size: 16px;
        font-weight: 400;
        color: var(--panel-title);
        display: flex;
        justify-content: center;
        align-items: center;
        &--selected {
          flex: 1;
          text-align: center;
          font-size: 16px;
          background-color: var(--background);
          font-weight: 400;
          color: var(--dot);
          border-bottom: 4px solid var(--dot);
          display: flex;
          justify-content: center;
          align-items: center;
        }
      
        &:hover {
          color: var(--dot);
          cursor: pointer;
        }
      }
    }

    &-tabpanel {
      text-align: center;
      background: var(--panel-background);
      overflow-y: auto;
      display: flex;
      flex-flow: column;
      flex: 1 1 auto;
      color: var(--panel-title);
      font-size: 15px;

      span {
        color: red;
      }
      &-editors-column {
        display: flex;
        flex-flow: column;
        margin-top: 10px;
        margin-bottom: 10px;
        .title {
          background: var(--panel-background);
          color: var(--panel-title);
          text-align: left;
          padding-left: 10px;
          margin: auto 0;
          margin-bottom: 5px;
          font-size: 15px;
        }
        .editor {
          text-align: left;
          padding-left: 10px;
        }
      }

      &-editors-row {
        display: flex;
        margin-top: 10px;
        margin-bottom: 10px;
        .title {
          text-align: left;
          padding-left: 10px;
          flex: 0 0 100px;
          white-space: nowrap;
          /*文字不换行*/
          overflow: hidden;
          /*超出部分隐藏*/
          text-overflow: ellipsis;
          /*溢出部分用省略号表示*/
          margin: auto 0;
          font-size: 15px;
        }
      
        .editor {
          text-align: center;
          flex: 1;
        }
      }
    }
    
  }

  .empty-value {
    filter: opacity(50%);
  }

  &-groupview {
    flex: 0 0 28px;
    display: flex;
    flex-flow: column;
    border-left: 1px solid #E0E3E9;
    &-items {
      flex: 1;
      display: flex;
      flex-flow: column;
      &-item {
        flex: 0 0 16px;
        margin-top: 8px;
        margin-bottom: 8px;
        display: flex;
        flex-flow: column;
        justify-content: center;
        align-items: center;
        &--selected {
          flex: 0 0 16px;
          margin-top: 8px;
          margin-bottom: 8px;
          display: flex;
          flex-flow: column;
          justify-content: center;
          align-items: center;
      
          >svg {
            color: #1F72FF;
          }
        }
      }
    }
  }

  &--disabled {
    pointer-events: none !important;
    user-select: none !important;
    filter: opacity(70%);

    .propertyview-subgroup-tabpanel {
      pointer-events: none !important;
      user-select: none !important;
      filter: opacity(70%) !important;
    }
  }
}

</style>
