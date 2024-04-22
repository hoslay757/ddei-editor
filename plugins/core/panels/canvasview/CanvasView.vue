<template>
  <div :id="editor?.id+'_canvas'" ref="middleCanvas" class="ddei-editor-canvasview" @mousedown="mouseDown($event)" ondragstart="return false;"
    @wheel="mouseWheel($event)" @mousemove="mouseMove($event)" @mouseup="mouseUp($event)"
    @dblclick="canvasDBClick" @contextmenu.prevent>
  </div>
</template>

<script lang="ts">
import {DDei} from "ddei-framework1";
import {DDeiEditor} from "ddei-framework1";
import {DDeiEditorState} from "ddei-framework1";
import {DDeiEnumControlState} from "ddei-framework1";
import {DDeiAbstractShape} from "ddei-framework1";
import {DDeiKeyAction} from "ddei-framework1";
import {DDeiEnumOperateState} from "ddei-framework1";
import {DDeiEnumBusCommandType} from "ddei-framework1";
import {DDeiEnumState} from "ddei-framework1";
import {DDeiUtil} from "ddei-framework1";
import { throttle } from "lodash";
import {DDeiEditorEnumBusCommandType} from "ddei-framework1";

export default {
  name: "ddei-core-panel-canvasview",
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
      //当前编辑器
      editor: null,
    };
  },
  computed: {},
  watch: {},
  created() {
    // 监听obj对象中prop属性的变化
    this.$watch("editor.files.length", function (newVal, oldVal) {
      if (newVal == 0) {
        this.editor?.ddInstance?.render?.hidden();
      } else {
        this.editor?.ddInstance?.render?.show();
      }
    });
    this.mouseWheelThrottle = throttle(this.mouseWheelThrottle, 10);
    this.mouseMove = throttle(this.mouseMove, 20);
    //获取编辑器
    this.editor = DDeiEditor.ACTIVE_INSTANCE;

  },
  mounted() {
   
    let ddInstance = this.editor.ddInstance;
  
    ddInstance.initRender()
    //设置视窗位置到中央
    if (!ddInstance.stage.wpv) {
      //缺省定位在画布中心点位置
      ddInstance.stage.wpv = {
        x: -(ddInstance.stage.width - ddInstance.render.container.clientWidth) / 2, y: -(ddInstance.stage.height - ddInstance.render.container.clientHeight) / 2, z: 0
      };
    }
    //通过当前装载的stage更新图形
    ddInstance.render.drawShape();
    ddInstance.bus.push(DDeiEditorEnumBusCommandType.LoadFile)
    ddInstance.bus.executeAll();
  },
  methods: {
    /**
     * 画布双击
     */
    canvasDBClick(evt) {
      let middleCanvas = this.$refs.middleCanvas
      let middleCanvasPos = DDeiUtil.getDomAbsPosition(middleCanvas);
      if (
        middleCanvasPos.left + 5 <= evt.clientX &&
        middleCanvasPos.left + middleCanvas.offsetWidth - 5 >= evt.clientX
      ) {
        this.editor?.hotkeys['ddei-core-keyaction-quickedit-start']?.action(evt,this.editor.ddInstance);
      }
    },
    /**
     * 焦点进入当前区域
     */
    changeEditorFocus() {
      this.editor.changeState(DDeiEditorState.DESIGNING);
      this.editor.bus.push(DDeiEditorEnumBusCommandType.ClearTemplateUI);
      this.editor.bus.executeAll();
      return true;
    },

    /**
     * 触控板滑动事件
     */
    mouseWheel(evt) {
      if (this.editor.state == DDeiEditorState.DESIGNING) {
        this.mouseWheelThrottle(evt);
        evt.preventDefault();
        evt.cancelBubble = true;
        return false;
      }
    },

    mouseWheelThrottle(evt) {
      this.editor.ddInstance.render.mouseWheel(evt);
    },


    mouseDown(evt) {
      let middleCanvas = this.$refs.middleCanvas
      let middleCanvasPos = DDeiUtil.getDomAbsPosition(middleCanvas);
      if (
        middleCanvasPos.left + 5 <= evt.clientX &&
        middleCanvasPos.left + middleCanvas.offsetWidth - 5 >= evt.clientX
      ) {
        if (this.editor.state == DDeiEditorState.QUICK_EDITING) {
          //判定落点是否在正在编辑的影子控件上，如果是则识别坐标，制作选中效果
          if (this.editor?.ddInstance?.stage?.render?.editorShadowControl) {

            let stage = this.editor?.ddInstance?.stage;
            let rat1 = stage.ddInstance.render.ratio;

            //由于绘制缓存中的文本位置乘以了调整系数，因此这里判断时，需要利用这个系数反向判断
            let scaleSize = DDeiUtil.DRAW_TEMP_CANVAS && rat1 < 2 ? 2 / rat1 : 1
            let ex = evt.offsetX;
            let ey = evt.offsetY;
            ex /= window.remRatio
            ey /= window.remRatio
            ex -= stage.wpv.x;
            ey -= stage.wpv.y;
            let shadowControl =
              this.editor?.ddInstance?.stage?.render?.editorShadowControl;
            if (shadowControl?.isInTextArea(ex, ey)) {
              let cx = (ex - shadowControl.cpv.x) * rat1;
              let cy = (ey - shadowControl.cpv.y) * rat1;
              //先判断行，再判断具体位置
              //textUsedArea记录的是基于中心点的偏移量
              let startIndex = 0;
              let sx = 0;
              let i = 0;

              for (; i < shadowControl.render.textUsedArea.length; i++) {
                let rowData = shadowControl.render.textUsedArea[i];
                let ry = rowData.y / scaleSize
                let rh = rowData.height / scaleSize
                let rx = rowData.x / scaleSize
                let rw = rowData.width / scaleSize

                if (cy >= ry && cy <= ry + rh) {
                  if (cx >= rx && cx <= rx + rw) {
                    //判断位于第几个字符，求出光标的开始位置
                    let endI = startIndex + rowData.text.length;
                    for (let x = startIndex; x < endI; x++) {
                      let fx = shadowControl.render.textUsedArea[0].textPosCache[x].x / scaleSize;

                      let lx = x < endI - 1 ? shadowControl.render.textUsedArea[0].textPosCache[x + 1].x / scaleSize : rx + rw
                      let halfW = (lx - fx) / 2
                      if (cx >= fx && cx < lx) {
                        if (cx > fx + halfW) {
                          sx = x + 1
                        } else {
                          sx = x;
                        }
                        break;
                      }
                    }
                  }
                  if (!sx) {
                    if (ex < shadowControl.cpv.x) {
                      sx = startIndex
                    } else {
                      sx = startIndex + rowData.text.length;
                    }
                  }
                  break;
                }
                startIndex += rowData.text.length
              }
              if (!sx) {
                if (ex < shadowControl.cpv.x) {
                  sx = 0
                } else {
                  sx = startIndex + shadowControl.render.textUsedArea[i - 1].text.length;
                }
              }
              let editorText = DDeiUtil.getEditorText();
              editorText.selectionStart = sx
              editorText.selectionEnd = sx
              setTimeout(() => {
                editorText.focus()
              }, 10);

              this.editor.bus.push(DDeiEnumBusCommandType.RefreshShape);
              this.editor.bus.executeAll();
              this.editor.ddInstance.stage.render.tempTextStart = editorText.selectionStart
              this.editor.ddInstance.stage.render.operateState = DDeiEnumOperateState.QUICK_EDITING_TEXT_SELECTING;
              return;
            }
          }
        }

        //如果dialog未关闭就直接触发了canvas的mousedown事件，此时不下发mousedown，只关闭dialog和修改状态
        let isDialogOpen = false;
        for (let oid in DDeiEditor.ACTIVE_INSTANCE.tempDialogData) {
          if (DDeiEditor.ACTIVE_INSTANCE.tempDialogData[oid]) {
            isDialogOpen = true
            break;
          }
        }
        this.changeEditorFocus();
        this.editor.ddInstance.state = DDeiEnumState.NONE;
        if (!isDialogOpen) {
          this.editor.ddInstance.render.mouseDown(evt);
        }
      }
    },


    /**
     * 拖拽元素移动
     */
    mouseMove(e) {
      if (this.editor.state == DDeiEditorState.CONTROL_CREATING) {
        DDeiKeyAction.updateKeyState(e);

        let ddInstance = this.editor.ddInstance;
        let stage = ddInstance.stage;
        let ex = e.offsetX;
        let ey = e.offsetY;
        ex /= window.remRatio
        ey /= window.remRatio
        ex -= stage.wpv.x;
        ey -= stage.wpv.y;
        if (this.editor.creatingControls) {
          //当前激活的图层
          let layer = stage.layers[stage.layerIndex];
          if (layer) {
            stage.render.currentOperateContainer = layer;
            stage.render.operateState = DDeiEnumOperateState.CONTROL_CREATING;
            let controls = this.editor.creatingControls;
            stage.render.currentOperateShape = controls[0];
            //在画布上创建临时对象
            if (!layer.models.has(controls[0].id)) {
              this.editor.bus.push(
                DDeiEnumBusCommandType.ModelChangeContainer,
                { newContainer: layer, models: controls },
                e
              );
              //记录当前的拖拽的x,y,写入dragObj作为临时变量

              let dragObj = {
                x: ex,
                y: ey,

                model: controls[0],
                num: 0,
              }
              controls.forEach(c => {
                dragObj[c.id] = {
                  dx: c.cpv.x - controls[0].cpv.x, //鼠标在控件中心坐标的增量位置
                  dy: c.cpv.y - controls[0].cpv.y
                }
              });
              this.editor.bus.push(
                DDeiEnumBusCommandType.UpdateDragObj,
                { dragObj: dragObj },
                e
              );
              //归零坐标
              this.editor.bus.push(
                DDeiEnumBusCommandType.ModelChangePosition,
                {
                  models: controls,
                  x: ex,
                  y: ey,
                  sample: 1,
                  dragObj: dragObj,
                },
                e
              );


              this.editor.bus.push(DDeiEnumBusCommandType.RefreshShape);
            } else {
              let ex1 = e.offsetX / window.remRatio;
              let ey1 = e.offsetY / window.remRatio;

              let rat1 = ddInstance.render?.ratio;
              let canvasWidth = ddInstance.render.canvas.width / rat1;
              let canvasHeight = ddInstance.render.canvas.height / rat1;
              let edgeWeight = 25;
              //判断是否在边缘
              if (ex1 < edgeWeight) {
                ddInstance.render.inEdge = 4;
              } else if (ex1 > canvasWidth - edgeWeight) {
                ddInstance.render.inEdge = 2;
              } else if (ey1 < edgeWeight) {
                ddInstance.render.inEdge = 1;
              } else if (ey1 > canvasHeight - edgeWeight) {
                ddInstance.render.inEdge = 3;
              } else {
                ddInstance.render.inEdge = 0;
              }
              if (!ddInstance.render.inEdge) {
                //显示辅助对齐线、坐标文本等图形
                let selectedModels: Map<string, DDeiAbstractShape> =
                  new Map();
                controls.forEach(control => {
                  selectedModels.set(control.id, control);
                });


                //修改辅助线
                this.editor?.bus?.push(
                  DDeiEnumBusCommandType.SetHelpLine,
                  { models: selectedModels },
                  e
                );

                this.editor.bus.push(
                  DDeiEnumBusCommandType.ModelChangePosition,
                  {
                    models: controls,
                    x: ex,
                    y: ey,
                    dx: 0,
                    dy: 0,
                    sample: 1,
                    dragObj: ddInstance.stage.render.dragObj,
                  },
                  e
                );
                let isAlt = DDei.KEY_DOWN_STATE.get("alt");
                this.editor.bus.push(
                  DDeiEnumBusCommandType.ChangeSelectorPassIndex,
                  { passIndex: 10 },
                  e
                );
                let lastOnContainer = layer;
                if (isAlt) {
                  //寻找鼠标落点当前所在的容器
                  let mouseOnContainers =
                    DDeiAbstractShape.findBottomContainersByArea(
                      layer,
                      ex,
                      ey
                    );
                  if (mouseOnContainers && mouseOnContainers.length > 0) {
                    lastOnContainer =
                      mouseOnContainers[mouseOnContainers.length - 1];
                  }
                  //如果最小层容器不是当前容器，则修改鼠标样式，代表可能要移入
                  if (lastOnContainer != layer) {
                    this.editor.bus.push(
                      DDeiEnumBusCommandType.ChangeSelectorPassIndex,
                      { passIndex: 11 },
                      e
                    );
                  }
                }

                //渲染图形
                this.editor?.bus?.push(DDeiEnumBusCommandType.RefreshShape);
              }

            }
            this.editor.bus.executeAll();
            e.preventDefault();
          }
        }
      }
      //如果正在拖拽内部画布的滚动条
      else if (
        this.editor.ddInstance.stage.render.operateState ==
        DDeiEnumOperateState.STAGE_SCROLL_WORKING
      ) {
        this.editor.ddInstance.render.mouseMove(e);
      }
      else{
        //事件下发到绘图区
        this.editor.ddInstance.render.mouseMove(e);
      }
    },

    /**
     * 拖拽元素放开
     */
    mouseUp(e) {
      if (this.editor.state == DDeiEditorState.CONTROL_CREATING) {
        let ddInstance = this.editor.ddInstance;
        let stage = ddInstance.stage;
        let ex = e.offsetX / window.remRatio;
        let ey = e.offsetY / window.remRatio;
        ex -= stage.wpv.x;
        ey -= stage.wpv.y;
        if (this.editor.creatingControls) {
          let isAlt = DDei.KEY_DOWN_STATE.get("alt");
          let ddInstance: DDei = this.editor.ddInstance;
          ddInstance.stage.idIdx++;
          let layer = ddInstance.stage.layers[ddInstance.stage.layerIndex];
          //如果按下了alt键，则移入容器
          if (isAlt) {
            //寻找鼠标落点当前所在的容器
            let mouseOnContainers: DDeiAbstractShape[] =
              DDeiAbstractShape.findBottomContainersByArea(layer, ex, ey);
            let lastOnContainer = layer;
            if (mouseOnContainers && mouseOnContainers.length > 0) {
              lastOnContainer = mouseOnContainers[mouseOnContainers.length - 1];
            }
            //如果最小层容器不是当前容器，执行的移动容器操作
            if (lastOnContainer != layer) {
              this.editor.bus.push(
                DDeiEnumBusCommandType.ModelChangeContainer,
                {
                  newContainer: lastOnContainer,
                  oldContainer: layer,
                  models: this.editor.creatingControls,
                }
              );
            }
          }
          //移除其他选中
          this.editor.bus.push(
            DDeiEnumBusCommandType.CancelCurLevelSelectedModels,
            { container: layer, curLevel: true }
          );

          this.editor.bus.push(DDeiEnumBusCommandType.ModelChangeSelect,
            [{
              id: this.editor.creatingControls[0].id,
              value: DDeiEnumControlState.SELECTED,
            }]
          );

          this.editor.bus.push(DDeiEnumBusCommandType.StageChangeSelectModels);

          this.editor.bus.push(DDeiEnumBusCommandType.UpdatePaperArea);
          this.editor.bus.push(DDeiEnumBusCommandType.NodifyControlCreated, {
            models: this.editor.creatingControls,
          });

          //清除临时变量
          this.editor.bus.push(DDeiEnumBusCommandType.ClearTemplateVars);
          this.editor.bus.push(DDeiEnumBusCommandType.NodifyChange);
          this.editor.bus.push(DDeiEnumBusCommandType.AddHistroy);
          //渲染图形
          this.editor.bus.push(DDeiEnumBusCommandType.RefreshShape);
          this.editor.creatingControls = null;
          //切换到设计器
          this.editor.state = DDeiEditorState.DESIGNING;
          this.editor.bus.executeAll();
        }
        e.preventDefault()
      } else if (this.editor.state == DDeiEditorState.DESIGNING || this.editor.state == DDeiEditorState.QUICK_EDITING) {
        //事件下发到绘图区
        this.editor.ddInstance.render.mouseUp(e);
      }
    },


  },
};
</script>

<style scoped>
.ddei-editor-canvasview {
  flex: 1;
  overflow: hidden;
}
</style>
