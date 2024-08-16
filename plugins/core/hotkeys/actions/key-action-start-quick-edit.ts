import {DDeiConfig} from "ddei-framework";
import { DDei, DDeiEnumOperateType } from "ddei-framework";
import {DDeiEnumBusCommandType} from "ddei-framework";
import {DDeiLineLink} from "ddei-framework";
import {DDeiUtil} from "ddei-framework";
import { Matrix3, Vector3 } from 'three';
import {DDeiEditor} from "ddei-framework";
import {DDeiEditorEnumBusCommandType} from "ddei-framework";
import {DDeiEditorState} from "ddei-framework";
import {DDeiKeyAction} from "ddei-framework";
import {DDeiEnumOperateState} from "ddei-framework";
import {DDeiAbstractShape} from "ddei-framework";

/**
 * 键行为:开启快捷编辑
 * 开启快捷编辑
 */
class DDeiKeyActionStartQuickEdit extends DDeiKeyAction {

  name: string = "ddei-core-keyaction-quickedit-start"


  /**
   * 缺省实例
   */
  static defaultIns: DDeiKeyActionStartQuickEdit = new DDeiKeyActionStartQuickEdit();

  defaultOptions: object = {
    'keys': [
      //F2快捷编辑
      { keys: "113", editorState: DDeiEditorState.DESIGNING },
    ]
  }

  getHotKeys(editor) {
    return [this];
  }


  static configuration(options, fullConfig: boolean = false) {
    //解析options，只使用自己相关的
    if (options) {
      let newOptions = {}
      if (fullConfig) {
        if (fullConfig) {
          if (options[DDeiKeyActionStartQuickEdit.defaultIns.name]) {
            for (let i in options[DDeiKeyActionStartQuickEdit.defaultIns.name]) {
              newOptions[i] = options[DDeiKeyActionStartQuickEdit.defaultIns.name][i]
            }
          }
        }
      } else {
        newOptions = options
      }
      if (newOptions && Object.keys(newOptions).length !== 0) {
        let panels = new DDeiKeyActionStartQuickEdit(newOptions);
        return panels;
      }
    }
    return DDeiKeyActionStartQuickEdit;
  }
  // ============================ 方法 ===============================
  action(evt: Event, ddInstance: DDei): void {
    //获取当前编辑控件
    if (ddInstance.stage?.selectedModels?.size == 1) {
      let model = Array.from(ddInstance.stage?.selectedModels.values())[0]
      let rsState1 = DDeiUtil.invokeCallbackFunc("EVENT_CONTROL_VIEW", DDeiEnumOperateType.VIEW, { models: [model] }, ddInstance, null)
      if (rsState1 == 0 || rsState1 == 1) {
        let editor = DDeiEditor.ACTIVE_INSTANCE;

        let editState = DDeiUtil.invokeCallbackFunc("EVENT_CONTROL_EDIT_BEFORE", DDeiEnumOperateType.EDIT, { models: [model] }, ddInstance, null)
        if (editState == 0 || editState== 1){
          let stage = ddInstance.stage;
          let stageRatio = stage.getStageRatio()
          if (model?.render) {
            let ex = -1;
            let ey = -1;
            if (evt.offsetX || evt.offsetY) {
              ex = evt.offsetX
              ey = evt.offsetY
              ex /= window.remRatio
              ey /= window.remRatio
              ex -= stage.wpv.x;
              ey -= stage.wpv.y;
              ex = ex / stageRatio
              ey = ey / stageRatio

            }
            if (model.baseModelType == 'DDeiTable') {
              let selectCells = model.getSelectedCells();
              if (selectCells?.length == 1) {
                model = selectCells[0];
                editor.quickEditorModel = model;
              } else {
                editor.quickEditorModel = null;
                return;
              }
            } else if (model.baseModelType == 'DDeiLine') {
              //计算事件发生在线的哪个位置,键盘为中间，鼠标则需要判断位置
              let type = 3;
              let linePoint = null;
              //鼠标事件
              if (evt.offsetX || evt.offsetY) {
                let cdist = DDeiUtil.getPointDistance(model.pvs[0].x, model.pvs[1].y, model.pvs[model.pvs.length - 1].x, model.pvs[model.pvs.length - 1].y);
                let sdist = DDeiUtil.getPointDistance(ex, ey, model.pvs[0].x, model.pvs[0].y);
                let edist = DDeiUtil.getPointDistance(ex, ey, model.pvs[model.pvs.length - 1].x, model.pvs[model.pvs.length - 1].y);
                //开始
                if (sdist < cdist / 5) {
                  type = 1;
                }
                //结束
                else if (edist < cdist / 5) {
                  type = 2;
                }
              }
              if (type == 1) {
                linePoint = model.startPoint;
              }
              else if (type == 2) {
                linePoint = model.endPoint;
              }
              else if (type == 3) {
                //奇数，取正中间
                let pi = Math.floor(model.pvs.length / 2)
                if (model.pvs.length % 3 == 0) {
                  linePoint = model.pvs[pi];
                }
                //偶数，取两边的中间点
                else {
                  linePoint = {
                    x: (model.pvs[pi - 1].x + model.pvs[pi].x) / 2,
                    y: (model.pvs[pi - 1].y + model.pvs[pi].y) / 2
                  }
                }
              }
              let realModel = null;

              model.linkModels.forEach(lm => {
                if (lm.type == type) {
                  realModel = lm.dm;
                }
              });

              //如果控件不存在，则创建控件并创建链接
              if (!realModel) {

                //根据control的定义，初始化临时控件，并推送至上层Editor
                let dataJson = {

                  modelCode: "100200",

                };
                let controlDefine = DDeiUtil.getControlDefine(dataJson)
                for (let i in controlDefine?.define) {
                  dataJson[i] = controlDefine.define[i];
                }
                dataJson["id"] = "lsm_" + (stage.idIdx++)
                dataJson["width"] = 80
                dataJson["height"] = 25
                dataJson["font"] = { size: 12 }
                realModel = ddInstance.controlModelClasses["DDeiPolygon"].initByJSON(
                  dataJson,
                  { currentStage: stage, currentDdInstance: ddInstance, currentContainer: model.pModel }
                );
                let move1Matrix = new Matrix3(
                  1, 0, linePoint.x,
                  0, 1, linePoint.y,
                  0, 0, 1);
                realModel.transVectors(move1Matrix)
                model.layer.addModel(realModel);

                realModel.initRender()
                let lineLink = new DDeiLineLink({
                  line: model,
                  type: type,
                  dm: realModel,
                  dx: 0,
                  dy: 0
                })
                model.linkModels.set(realModel.id, lineLink);
              }
              model = realModel;
              editor.quickEditorModel = model;
            }

            //获取控件所占区域
            //判断控件是否有composes，如果被composes拦截了，则启用componses的编辑
            model = DDeiAbstractShape.findBottomComponseByArea(model, ex, ey);

            let fillArea = model.textArea

            if (fillArea?.length > 0) {
              editor.quickEditorModel = model;
              let canvasPos = DDeiUtil.getDomAbsPosition(ddInstance.render.canvas);
              //创建大文本框
              let inputEle = DDeiUtil.getEditorText();
              let rotate = model.rotate
              let stageRatio = ddInstance.stage.getStageRatio();
              let pos = new Vector3(model.pvs[0].x, model.pvs[0].y, 1)
              if (rotate != 0) {
                let pvc = new Vector3(model.cpv.x, model.cpv.y, 1);
                let angle = (rotate * DDeiConfig.ROTATE_UNIT).toFixed(4);
                //计算input的正确打开位置，由节点0
                let move1Matrix = new Matrix3(
                  1, 0, -pvc.x,
                  0, 1, -pvc.y,
                  0, 0, 1);
                let rotateMatrix = new Matrix3(
                  Math.cos(angle), Math.sin(angle), 0,
                  -Math.sin(angle), Math.cos(angle), 0,
                  0, 0, 1);
                let move2Matrix = new Matrix3(
                  1, 0, pvc.x,
                  0, 1, pvc.y,
                  0, 0, 1);
                let m1 = new Matrix3().premultiply(move1Matrix).premultiply(rotateMatrix).premultiply(move2Matrix);
                pos.applyMatrix3(m1)
              }

              inputEle.value = model.text ? model.text : ''
              inputEle.style.fontSize = (model.render.getCachedValue("font.size") * stageRatio) + "px"
              inputEle.style.color = DDeiUtil.getColor(model.render.getCachedValue("font.color"))
              inputEle.style.width = (fillArea.width) * stageRatio + "px";
              inputEle.style.height = (fillArea.height) * stageRatio + "px";


              inputEle.style.left = canvasPos.left + pos.x + ddInstance.stage.wpv.x + 1 + "px";
              inputEle.style.top = canvasPos.top + pos.y + ddInstance.stage.wpv.y + 10 + "px";
              // inputEle.style.transform = "rotate(" + rotate + "deg)";
              // inputEle.style.backgroundColor = "grey"
              inputEle.style.display = "block";

              let textAreaRect = DDeiAbstractShape.pvsToOutRect(model.textArea);
              inputEle.style.width = textAreaRect.width + "px"
              inputEle.style.height = textAreaRect.height + "px"
              //创建编辑影子元素
              ddInstance.stage.render.editorShadowControl = DDeiUtil.getShadowControl(model);
              //清空当前opPoints
              model.layer.opPoints = [];
              if (model.layer.opLine?.render) {
                model.layer.opLine.render.enableRefreshShape()
              }
              delete model.layer.opLine;
              ddInstance.stage.render.editorShadowControl.render.isEditoring = true
              inputEle.focus()

              inputEle.selectionStart = 0 // 选中开始位置
              inputEle.selectionEnd = inputEle.value.length // 获取输入框里的长度。
              //修改编辑器状态为快捷编辑中
              editor.changeState(DDeiEditorState.QUICK_EDITING);
              delete ddInstance.stage.brushData
              delete ddInstance.stage.brushDataText
              ddInstance.stage.render.operateState = DDeiEnumOperateState.QUICK_EDITING
              //发出通知，选中的焦点发生变化
              editor.bus.push(DDeiEnumBusCommandType.StageChangeSelectModels);
              editor.bus.push(DDeiEnumBusCommandType.TextEditorChangeSelectPos);
              editor.bus.push(DDeiEditorEnumBusCommandType.ClearTemplateUI);
              editor.bus.executeAll();
            }
          }
        }
      }
    }
  }

}


export default DDeiKeyActionStartQuickEdit
