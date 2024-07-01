<template>
  <div class="ddei-ext-panel-quickcontrol" ref="quickControlDiv">
    <div class="ddei-ext-panel-quickcontrol-left" :style="leftOffset">
      <svg width="16" height="11" v-if="leftState != 1" @mouseenter="mouseEnter(4,$el,$event)" @mousedown="createLineOk"
        @mouseleave="mouseleave" style="transform: rotate(-90deg);">
        <polygon points="8,0 1,10 15,10" />
      </svg>
    </div>
    <div class="ddei-ext-panel-quickcontrol-middle">
      <div class="ddei-ext-panel-quickcontrol-middle-top" :style="topOffset">
        <svg width="16" height="11" v-if="topState != 1" @mouseenter="mouseEnter(1, $el, $event)"
          @mouseleave="mouseleave" @mousedown="createLineOk">
          <polygon points="8,0 1,10 15,10" />
        </svg>
      </div>
      <div class="ddei-ext-panel-quickcontrol-middle-middle">
      </div>
      <div class="ddei-ext-panel-quickcontrol-middle-bottom" :style="bottomOffset">
        <svg width="16" height="11" v-if="bottomState != 1" @mouseenter="mouseEnter(3, $el, $event)"
          @mouseleave="mouseleave" @mousedown="createLineOk" style="transform: rotate(180deg);">
          <polygon points="8,0 1,10 15,10" />
        </svg>
      </div>
    </div>
    <div class="ddei-ext-panel-quickcontrol-right" :style="rightOffset">
      <svg width="16" height="11" v-if="rightState != 1" @mouseenter="mouseEnter(2, $el, $event)"
        @mouseleave="mouseleave" @mousedown="createLineOk" style="transform: rotate(90deg);">
        <polygon points="8,0 1,10 15,10" />
      </svg>
    </div>
  </div>
</template>
<script lang="ts">
import { DDeiEditor, DDeiEnumControlState, DDeiUtil } from "ddei-framework";
import {DDeiEditorUtil} from "ddei-framework";
import { DDeiAbstractShape } from "ddei-framework";
import {DDeiEditorState} from "ddei-framework";
import { DDeiEnumBusCommandType } from "ddei-framework";

export default {
  name: "ddei-ext-panel-quickcontrol",
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
      leftOffset: null,
      rightOffset: null,
      topOffset: null,
      bottomOffset: null,
      //四个方向的状态，0无连线，1有连线
      leftState: 0,
      rightState: 0,
      bottomState: 0,
      topState: 0
    };
  },
  computed: {},
  watch: {},
  created() {
  },
  mounted() {
    this.refreshData();
  },
  methods:{
    refreshData(){
      //获取model
      let model = this.editor.tempPopData['ddei-ext-dialog-quickcontrol'].model
      if (model) {
        let outRect = DDeiAbstractShape.getOutRectByPV([model])
        let width = this.editor.tempPopData['ddei-ext-dialog-quickcontrol'].width;
        width = width || width == 0 ? width : 40;
        let height = this.editor.tempPopData['ddei-ext-dialog-quickcontrol'].height;
        height = height || height == 0 ? height : 40;
        
        this.$refs.quickControlDiv.style.width = (outRect.width + width) + "px";
        this.$refs.quickControlDiv.style.height = (outRect.height + height) + "px";

   

        this.leftOffset = this.editor.tempPopData['ddei-ext-dialog-quickcontrol'].offset?.left;
        this.rightOffset = this.editor.tempPopData['ddei-ext-dialog-quickcontrol'].offset?.right;
        this.topOffset = this.editor.tempPopData['ddei-ext-dialog-quickcontrol'].offset?.top;
        this.bottomOffset = this.editor.tempPopData['ddei-ext-dialog-quickcontrol'].offset?.bottom;
        //查询当前控件的四个方向是否有线存在，控制显示状态
        for (let i in model.exPvs) {
          let mlPoint = model.exPvs[i]
          if (parseInt(mlPoint.y) == parseInt(outRect.y)) {
            this.topState = 1
          } else if (parseInt(mlPoint.x) == parseInt(outRect.x1)) {
            this.rightState = 1
          } else if (parseInt(mlPoint.y) == parseInt(outRect.y1)) {
            this.bottomState = 1
          } else if (parseInt(mlPoint.x) == parseInt(outRect.x)) {
            this.leftState = 1
          }
        }
      }
    },

    mouseEnter(type,el,evt) {
      if(this.editor.state == 'designing'){
        if (this.editor.tempPopData['ddei-ext-dialog-quickcontrol']){
          //显示弹出框
          let elPos = evt.currentTarget.getBoundingClientRect()
          // let elPos = DDeiUtil.getDomAbsPosition(evt.currentTarget)
          //向上区间寻找，是否有控件
          let existsControl = null;
          let model = this.editor.tempPopData['ddei-ext-dialog-quickcontrol'].model
          let layer = model.layer
          let outRect = DDeiAbstractShape.getOutRectByPV([model])
          if (type == 1) {
            let controls = layer.getSubModels([model.id], 100, { x: outRect.x, y: outRect.y-150, x1: outRect.x1, y1: outRect.y})
            if (this.validControls(controls)){
              existsControl = controls[0];
            }
          } else if (type == 2) {
            let controls = layer.getSubModels([model.id], 100, { x: outRect.x1, y: outRect.y, x1: outRect.x1+150, y1: outRect.y1 })
            if (this.validControls(controls)) {
              existsControl = controls[0];
            }
          } else if (type == 3) {
            let controls = layer.getSubModels([model.id], 100, { x: outRect.x, y: outRect.y1, x1: outRect.x1, y1: outRect.y1+150 })
            if (this.validControls(controls)) {
              existsControl = controls[0];
            }
          } else if (type == 4) {
            let controls = layer.getSubModels([model.id], 100, { x: outRect.x-150, y: outRect.y, x1: outRect.x, y1: outRect.y1 })
            if (this.validControls(controls)) {
              existsControl = controls[0];
            }
          }
          //如果没有控件，弹出创建控件框
          if (!existsControl){
            if (this.editor.tempLineModel){
              this.editor.ddInstance.stage.removeModel(this.editor.tempLineModel,true)
              delete this.editor.tempLineModel
            }
            let editorEle = document.getElementById(this.editor.id);
            let editorDomPos = DDeiUtil.getDomAbsPosition(editorEle);
            

            //显示弹出框
            let modelPos = DDeiUtil.getModelsDomAbsPosition([model])
            let width = this.editor.tempPopData['ddei-ext-dialog-quickcontrol'].width;
            width = width || width == 0 ? width : 40;
            let height = this.editor.tempPopData['ddei-ext-dialog-quickcontrol'].height;
            height = height || height == 0 ? height : 40;
            // let outRect = DDeiAbstractShape.getOutRectByPV([model])
            
            if (model.state == DDeiEnumControlState.SELECTED) {
              height = 70
             
            }
            // width = outRect.width + width
            // height = outRect.height + height
            
            let left = modelPos.left - editorDomPos.left - width / 2
            let top = modelPos.top - editorDomPos.top - height / 2
           
            
            let qcWidth = modelPos.width + width
            let qcHeight = modelPos.height + height
            
            if (type == 1) {
              left = left + qcWidth/2-120
              top = top-240
            } else if (type == 2) {
              left = left + qcWidth
              top = top + qcHeight/2-120
            } else if (type == 3) {
              left = left + qcWidth / 2 - 120
              top = top + qcHeight
            } else if (type == 4) {
              left = left - 240
              top = top + qcHeight / 2 - 120
            }
            if (model.state == DDeiEnumControlState.SELECTED) {
              top -= 10
            }
            
            DDeiEditorUtil.showDialog(this.editor, 'ddei-ext-dialog-quickchoosecontrol', {
              group: "canvas-pop-quickcreatecontrol",
              type:type,
              model: model
            }, { type: 99, left: left, top: top, hiddenMask: true }, null, true, true)
          }
          //如果有控件，创建连线(影子控件)
          else if (!this.editor.tempLineModel){
            //添加后的控件坐标，将其移动到特定位置
            let outRect1 = DDeiAbstractShape.getOutRectByPV([existsControl])
            let sx, sy, ex, ey
            let startSita, endSita
            //创建控件
            if (type == 1) {
              sx = (outRect.x + outRect.x1) / 2
              sy = outRect.y
              ex = (outRect1.x + outRect1.x1) / 2
              ey = outRect1.y1
              startSita = -90
              endSita = 90
            } else if (type == 2) {
              sx = outRect.x1
              sy = (outRect.y+outRect.y1)/2
              ex = outRect1.x
              ey = (outRect1.y + outRect1.y1) / 2
              startSita = 0
              endSita = 180
            } else if (type == 3) {
              sx = (outRect.x + outRect.x1) / 2
              sy = outRect.y1
              ex = (outRect1.x + outRect1.x1) / 2
              ey = outRect1.y
              startSita = 90
              endSita = -90
            } else if (type == 4) {
              sx = outRect.x
              sy = (outRect.y + outRect.y1) / 2
              ex = outRect1.x1
              ey = (outRect1.y + outRect1.y1) / 2
              startSita = 180
              endSita = 0
            }
            //创建连线
            let lines = this.editor.addLines([
              {
                model: '100401',
                type: 2,
                dash:[10,5],
                startPoint: { x: sx, y: sy },
                endPoint: { x: ex, y: ey },
                smodel: { id: model.id, x: sx, y: sy, rate: 0.5, sita: startSita },
                emodel: { id: existsControl.id, x: ex, y: ey, rate: 0.5, sita: endSita }
              },
            ],true,false)
            this.editor.tempLineModel = lines[0];
            DDeiEditorUtil.closeDialog(this.editor, 'ddei-ext-dialog-quickchoosecontrol', true)
            this.editor.bus.push(DDeiEnumBusCommandType.RefreshShape);
            this.editor.bus.executeAll();
          }
        }
      }
    },

    createLineOk(){
      if (this.editor.tempLineModel){
        delete this.editor.tempLineModel.dash
        this.editor.tempLineModel.render?.clearCachedValue()
        delete this.editor.tempLineModel
        this.refreshData();
      }
    },

    mouseleave(){
      if (this.editor.tempLineModel) {
        this.editor.ddInstance.stage.removeModel(this.editor.tempLineModel,true)
        delete this.editor.tempLineModel
      }
    },

    validControls(controls){
      if(controls?.length > 0){
        for(let i = 0;i < controls.length;i++){
          if (controls[i].baseModelType != 'DDeiLine'){
            return true;
          }
        }
      }
      return false
    }
  }
};
</script>

<style lang="less" scoped>
.ddei-ext-panel-quickcontrol {
    background:transparent;
    pointer-events: none;
    display: flex;
    justify-content: center;
    align-items: center;
    svg>{
      pointer-events: auto;
      fill: var(--icon);
      &:hover{
        fill:var(--dot);
        cursor: pointer;
      }
    }
    &-left {
      display: flex;
      justify-content: center;
      align-items: center;
      flex: 0 0 20px;
    }
    &-middle {
      flex: 1;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      height:100%;
      &-top {
        flex: 0 0 20px;
        display: flex;
        justify-content: center;
        align-items: center;
      }
      &-middle {
        flex: 1;
      }
      &-bottom {
        display: flex;
        justify-content: center;
        align-items: center;
        flex: 0 0 20px;
      }
    }
    &-right {
      flex: 0 0 20px;
      display: flex;
      justify-content: center;
      align-items: center;
    }
}
</style>
