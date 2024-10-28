<template>
  <div @mousedown="changeEditorFocus" v-if="forceRefresh" ref="toolbox" class="ddei-core-panel-toolbox-simple">
    <div
      :class="{ 'item-drag': options?.drag == 1 && options?.direct != 2, 'item-drag-2': options?.drag == 1 && options?.direct == 2, 'item-block': options?.drag != 1 }"
      @mousedown="options?.drag == 1 && prepareDragBox()">
    </div>
    <div v-if="forceRefreshGroup" :class="{'item':true,'item-selected':group.editMode == editor.editMode}"
      :title="group.currentControl?.desc ? group.currentControl.desc : group.controls?.length > 0 && group.controls[0]?.desc ? group.controls[0].desc  : group.desc ? group.desc : ''"
      @mouseenter="showGroupControlBox(group,$event)"
      @mousedown="changeEditMode(group?.editMode) && createControlPrepare(group, $event)"
      @click="group.controls?.length > 0 && changeEditMode(group?.editMode) && createControlCenter(group,$event)"
      v-for="group in groups">
      <div v-if="group?.editMode == 1 || group?.editMode == 2" v-html="group.icon"></div>
      <img class="icon"
        v-if="(group.currentControl && !group.currentControl.icon) || (!group.currentControl && group.controls?.length > 0 && !group.controls[0]?.icon)"
        :src="editor?.icons[group.currentControl ? group.currentControl.id : group.controls[0].id]" />
      <div class="item-icon-html"
        v-if="(group.currentControl && group.currentControl.icon) || (!group.currentControl && group.controls?.length > 0 && group.controls[0]?.icon) "
        v-html="group.currentControl?.icon ? group.currentControl.icon : group.controls?.length > 0 ? group.controls[0]?.icon : ''">
      </div>
    </div>
    <div class="item-block"></div>
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
  name: "ddei-core-panel-toolbox-simple",
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
  },
  data() {
    return {
      groups:null,
      forceRefresh: true,
      forceRefreshGroup: true,
    };
  },
  computed: {},
  watch: {},
  created() {
    
  },
  mounted() {
    let middleCanvas = document.getElementById(this.editor.id + "_canvas");
    // 创建 ResizeObserver 实例
    const resizeObserver = new ResizeObserver(entries => {
      // entries 是一个 ResizeObserverEntry 对象数组，包含目标元素的大小信息
      for (const entry of entries) {
        // 获取宽度和高度
        const { width, height } = entry.contentRect;
        if (width != 0 && height != 0) {
          this.width = width
          this.height = height
          this.resetPosition(width,height)
          
        }
      }
    });

    //开始监听目标元素的大小变化
    resizeObserver.observe(middleCanvas);
    this.refreshData();
  },
  methods: {
    resetPosition(width,height){
      
      //横向
      if (this.options?.direct == 2) {
        this.$refs['toolbox'].style.maxWidth = (width - 80) + "px"
        this.$refs['toolbox'].style.flexDirection = ""
        if (this.options?.width) {
          this.$refs['toolbox'].style.width = this.options.width
        } else {
          this.$refs['toolbox'].style.width = ""
        }
        if (this.options?.height) {
          this.$refs['toolbox'].style.height = this.options.height
        } else {
          this.$refs['toolbox'].style.height = "40px"
        }

      }
      //纵向
      else {
        this.$refs['toolbox'].style.flexDirection = "column";
        this.$refs['toolbox'].style.maxHeight = (height - 80) + "px"
        if (this.options?.width) {
          this.$refs['toolbox'].style.width = this.options.width
        } else {
          this.$refs['toolbox'].style.width = "40px"
        }
        if (this.options?.height) {
          this.$refs['toolbox'].style.height = this.options.height
        } else {
          this.$refs['toolbox'].style.height = ""
        }
      }
      //读取缓存位置
      let cachePos = null;
      if (this.options?.drag == 1) {
        cachePos = localStorage.getItem("pos-" + this.editor.id + "-ddei-core-panel-toolbox-simple")
      }
      if (!cachePos) {
        //位置
        switch (this.options?.position) {
          case 2:
            this.$refs['toolbox'].style.left = (width - this.$refs['toolbox'].clientWidth) / 2 + "px";
            this.$refs['toolbox'].style.top = "30px";
            break;
          case 3:
            this.$refs['toolbox'].style.left = (width - this.$refs['toolbox'].clientWidth - 30) + "px";
            this.$refs['toolbox'].style.top = "30px";
            break;
          case 4:
            this.$refs['toolbox'].style.left = (width - this.$refs['toolbox'].clientWidth - 30) + "px";
            this.$refs['toolbox'].style.top = (height - this.$refs['toolbox'].clientHeight) / 2 + "px";
            break;
          case 5:
            this.$refs['toolbox'].style.left = (width - this.$refs['toolbox'].clientWidth - 30) + "px";
            this.$refs['toolbox'].style.top = (height - this.$refs['toolbox'].clientHeight - 30) + "px";
            break;
          case 6:
            this.$refs['toolbox'].style.left = (width - this.$refs['toolbox'].clientWidth) / 2 + "px";
            this.$refs['toolbox'].style.top = (height - this.$refs['toolbox'].clientHeight - 30) + "px";
            break;
          case 7:
            this.$refs['toolbox'].style.left = "30px";
            this.$refs['toolbox'].style.top = (height - this.$refs['toolbox'].clientHeight - 30) + "px";
            break;
          case 8:
            this.$refs['toolbox'].style.left = "30px";
            this.$refs['toolbox'].style.top = (height - this.$refs['toolbox'].clientHeight) / 2 + "px";
            break;
          case 9:
            this.$refs['toolbox'].style.left = (width - this.$refs['toolbox'].clientWidth) / 2 + "px";
            this.$refs['toolbox'].style.top = (height - this.$refs['toolbox'].clientHeight) / 2 + "px";
            break;
          default:
            this.$refs['toolbox'].style.left = "30px";
            this.$refs['toolbox'].style.top = "30px";
            break;
        }

      } else {
        let posJson = JSON.parse(cachePos)
        this.$refs['toolbox'].style.left = posJson.left + "px";
        this.$refs['toolbox'].style.top = posJson.top + "px";
      }
      this.$refs['toolbox'].style.display="flex"
    },

    refreshData() {
      this.editor.needControlIcon = true;
      this.editor.toolBarViewer = this;
      if (this.editor.ddInstance && !this.editor.ddInstance.render) {
        this.editor.ddInstance.initRender()
      }
      //根据初始化参数，初始化groups
      if(!this.groups){
        let groups = []
        for(let i = 0;i < this.options?.groups?.length;i++){
          let group = clone(this.options.groups[i])
          let controls = []
          group.controls?.forEach(controlid => {
            let control = this.editor.controls.get(controlid)
            if(control){
              controls.push(control)
            }
          });
          if (controls.length > 0){
            group.controls = controls;
          }
          groups.push(group)
          
        }
        
        this.groups = groups
      }
      
    },

    //强制刷新当前以及下层组件
    forceRefreshParts(parts) {
      if (!parts || parts == 'toolbox' || parts.indexOf('toolbox') != -1){
        this.forceRefresh = false
        this.$nextTick(() => {
          this.forceRefresh = true;
          if (this.refreshData) {
            this.$nextTick(() => {
              this.resetPosition(this.width,this.height)
            });
          }
        });
      }
    },

    changeEditMode(editMode){
      if (!editMode) {
        this.editor.bus.push(DDeiEditorEnumBusCommandType.ChangeEditMode, {
          mode: 1,
        });
        
      }else{
        this.editor.bus.push(DDeiEditorEnumBusCommandType.ChangeEditMode, {
          mode: editMode,
        });
      }
      this.editor.bus.executeAll();
      return true;
    },

    /**
     * 准备创建
     */
    createControlPrepare(group, e) {
      let control = group.currentControl ? group.currentControl : group.controls?.length > 0 ? group.controls[0] : null
      

      let editMode = group.editMode
      //获取当前实例
      let ddInstance: DDei = this.editor.ddInstance;
      ddInstance.render.inEdge = 0;
      let stage = ddInstance.stage;
      let layer = stage.layers[stage.layerIndex];
      if ((layer.display == 0 && !layer.tempDisplay) || layer.lock) {
        return;
      }
      
      
      //创建控件
      if(control){
        if (editMode != 4){
          //创建并初始化控件以及关系
          let controlInitJSON = DDeiEditorUtil.getModelInitJSON(this.editor.ddInstance, null, [control])
          if (!controlInitJSON) {
            return;
          }
          let models = DDeiEditorUtil.createControl(controlInitJSON[0], this.editor)
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
        }
        //切换状态，设置线初始化JSON
        else{
          DDeiEditorUtil.lineInitJSON = {
            modelCode: control.id,
          };
          this.editor.changeState(DDeiEditorState.DESIGNING);
        }
      }
      DDeiEditorUtil.hiddenDialog(this.editor, "ddei-core-dialog-choosecontrol")
    },

    

    /**
     * 显示组控件列表
     * @param group 组
     * @param e 
     */
    showGroupControlBox(group,evt){
      DDeiEditorUtil.hiddenDialog(this.editor, "ddei-core-dialog-choosecontrol")
      if (this.editor.state != DDeiEditorState.CONTROL_CREATING) {
        

        if (group.controls?.length > 1){
          let el = evt.srcElement
          let type = 99;
          if (this.options?.direct == 2) {
            if (this.options?.position == 1 || this.options?.position == 2 || this.options?.position == 3 || this.options?.position == 4 || this.options?.position == 8 || this.options?.position == 9 || !this.options?.position){
              type = 5;
            } else if (this.options?.position == 5 || this.options?.position == 6 || this.options?.position == 7) {
              type = 3;
            }
          } else if (this.options?.direct == 1){
            if (this.options?.position == 1 || this.options?.position == 7 || this.options?.position == 8 || this.options?.position == 2 || this.options?.position == 6 || !this.options?.position || this.options?.position == 9) {
              type = 9;
            } else if (this.options?.position == 3 || this.options?.position == 4 || this.options?.position == 5) {
              type = 7;
            } 
          }
          DDeiEditorUtil.showDialog(this.editor, "ddei-core-dialog-choosecontrol", {
            controlGroup: group,
            callback: {
              ok: this.changeGroupControl,
              drag: this.options?.dragCreate == 1 ? this.dragCreateControlPrepare : null
            }
          }, { type: type,hiddenMask: true }, el, true, true)
        }
      }

    
    },

    changeGroupControl(group,control,evt){
      this.changeEditMode(group?.editMode)
      if(group?.editMode == 4){
        DDeiEditorUtil.lineInitJSON = {
          modelCode: control.id,
        };
      }
      group.currentControl = control
      if (this.options?.chooseCreate){
        this.createControlCenter(group)
      }
      DDeiEditorUtil.closeDialog(this.editor, "ddei-core-dialog-choosecontrol")
      this.forceRefreshGroup = false
      this.$nextTick(() => {
        this.forceRefreshGroup = true;
      });
    },

    dragCreateControlPrepare(group, control,evt){
      
      this.changeEditMode(group?.editMode)
      group.currentControl = control
      if (this.options?.dragCreate){
        this.createControlPrepare(group,evt)
      }
      this.forceRefreshGroup = false
      this.$nextTick(() => {
        this.forceRefreshGroup = true;
      });
    },

    /**
     * 准备拖拽
     */
    prepareDragBox(e) {
      this.editor.dragPart = this;
      this.$refs['toolbox'].style.userSelect = "none";
      this.$refs['toolbox'].children[0].style.backgroundColor = "var(--dot)";
      this.$refs['toolbox'].style.pointerEvents = "none";
      
    },

    /**
     * 拖拽中
     */
    boxDraging(e) {
      if (this.editor.dragPart) {
        let middleCanvas = document.getElementById(this.editor.id + "_canvas");
        let posLeft = e.offsetX - 15
        let posTop = e.offsetY - 5
        if(this.options?.direct == 2){
          posLeft = e.offsetX-5
          posTop = e.offsetY-15
        }
        if (posLeft < 0) {
          posLeft = 0
        }
        if (posLeft < 0) {
          posTop = 0
        }
        if (posLeft + this.$refs['toolbox'].offsetWidth > middleCanvas.offsetWidth) {
          posLeft = middleCanvas.offsetWidth - this.$refs['toolbox'].offsetWidth
        }
        if (posTop + this.$refs['toolbox'].offsetHeight > middleCanvas.offsetHeight) {
          posTop = middleCanvas.offsetHeight - this.$refs['toolbox'].offsetHeight
        }
        this.$refs['toolbox'].style.left = posLeft +"px";
        this.$refs['toolbox'].style.top = posTop +"px";
      }
    },

    /**
     * 拖拽完毕
     */
    boxDragEnd(e) {
      if (this.editor.dragPart) {
        let posJson = { left: this.$refs['toolbox'].offsetLeft, top: this.$refs['toolbox'].offsetTop}
        localStorage.setItem("pos-" + this.editor.id + "-ddei-core-panel-toolbox-simple", JSON.stringify(posJson))
        this.$refs['toolbox'].style.userSelect = "";
        this.$refs['toolbox'].style.pointerEvents = "";
        this.$refs['toolbox'].children[0].style.backgroundColor = "";
        delete this.editor.dragPart;
      }
    },

    /**
     * 创建控件在中心点处
     */
    createControlCenter(group, e) {
      if (group?.editMode != 4){
        let control = group.currentControl ? group.currentControl : group.controls?.length > 0 ? group.controls[0] : null
        
        //修改编辑器状态为控件创建中
        this.editor.changeState(DDeiEditorState.DESIGNING);
        this.editor.creatingControls = null;
        //获取当前实例
        if (control){
          let ddInstance: DDei = this.editor.ddInstance;
          ddInstance.render.inEdge = 0;
          let stage = ddInstance.stage;
          let layer = stage.layers[stage.layerIndex];
          if ((layer.display == 0 && !layer.tempDisplay) || layer.lock) {
            return;
          }
          let rsState = DDeiUtil.invokeCallbackFunc("EVENT_CONTROL_CREATE_BEFORE", DDeiEnumOperateType.CREATE, { models: [control] }, ddInstance, e)
          if (rsState == 0 || rsState == 1) {
            let controlInitJSON = DDeiEditorUtil.getModelInitJSON(this.editor.ddInstance, null, [{ model: control.id }])
            if (controlInitJSON){
              let models = this.editor.addControls(controlInitJSON)
              let pushDatas = []
              models.forEach((model, key) => {
                pushDatas.push({ id: model.id, value: DDeiEnumControlState.SELECTED });
              });
              this.editor.ddInstance?.bus?.push(DDeiEnumBusCommandType.CancelCurLevelSelectedModels, null, e);
              this.editor.ddInstance?.bus?.push(DDeiEnumBusCommandType.ModelChangeSelect, pushDatas, e);
              this.editor.ddInstance?.bus?.push(DDeiEnumBusCommandType.StageChangeSelectModels);
              this.editor.bus.executeAll()
              this.editor.changeState(DDeiEditorState.DESIGNING);
              DDeiUtil.invokeCallbackFunc("EVENT_CONTROL_CREATE_AFTER", DDeiEnumOperateType.CREATE, { models: models }, ddInstance, e)
            }
            
          }
        }
      }
    },

    
    /**
     * 焦点进入当前区域
     */
    changeEditorFocus() {
      this.editor.changeState(DDeiEditorState.TOOLBOX_ACTIVE);
      this.editor.bus.push(DDeiEditorEnumBusCommandType.ClearTemplateUI);
      this.editor.bus.executeAll();
    }
  },
};
</script>

<style lang="less" scoped>
.ddei-core-panel-toolbox-simple {
  text-align: center;
  position: absolute;
  
  z-index: 99999;
  border: 1px solid var(--panel-border);
  box-shadow: 0px 2px 24px 0px hsl(0deg 0% 0% /0.25);
  border-radius: 5px;
  overflow: hidden;
  background-color: var(--panel-background);
  display: flex;
  
  justify-content: start;
  align-items: center;

  .item {
    width: 30px;

    height: 30px;
    border-radius: 3px;
    display: flex;
    justify-content: center;
    align-items: center;

    >img {
      margin-top: -1px;
      margin-left: -1px;
    }

    &:hover {
      background-color: #e2dede;
      cursor: pointer;
    }

    &-icon-html{
      width: 30px;
      height: 30px;
      display: flex;
      justify-content: center;
      align-items: center;
      >*{
        width: 28px !important;
        height: 28px !important;
      }
    }
  }
  .item-selected {
    background-color: #e2dede;
  }

  .item-block {
    width: 10px;

    height: 10px;
  }

    .item-drag {
      width: 100%;
      height: 10px;
      background-color: #efefef;
  
      &:hover {
        background-color: var(--dot);
        cursor: grab;
      }
    }
    .item-drag-2 {
      height: 100%;
      width: 10px;
      background-color: #efefef;

      &:hover {
        background-color: var(--dot);
        cursor: grab;
      }
    }
}
</style>
