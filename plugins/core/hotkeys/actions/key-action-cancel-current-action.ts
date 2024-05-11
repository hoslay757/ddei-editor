import {DDei} from "ddei-framework";
import {DDeiKeyAction} from "ddei-framework";
import {DDeiEnumBusCommandType} from "ddei-framework";
import {DDeiEnumControlState} from "ddei-framework";
import {DDeiEditorState} from "ddei-framework";
import {DDeiEditor} from "ddei-framework";
import {DDeiEnumOperateState} from "ddei-framework";

/**
 * 键行为:取消当前正在进行的动作
 * 取消当前正在进行的动作
 */
class DDeiKeyActionCancelCurrentAction extends DDeiKeyAction {


  name: string = "ddei-core-keyaction-cancel-current-action"


  /**
   * 缺省实例
   */
  static defaultIns: DDeiKeyActionCancelCurrentAction = new DDeiKeyActionCancelCurrentAction();

  defaultOptions: object = {
    'keys': [
      { keys: "27", editorState: DDeiEditorState.DESIGNING},
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
          if (options[DDeiKeyActionCancelCurrentAction.defaultIns.name]) {
            for (let i in options[DDeiKeyActionCancelCurrentAction.defaultIns.name]) {
              newOptions[i] = options[DDeiKeyActionCancelCurrentAction.defaultIns.name][i]
            }
          }
        }
      } else {
        newOptions = options
      }
      if (newOptions && Object.keys(newOptions).length !== 0) {
        let panels = new DDeiKeyActionCancelCurrentAction(newOptions);
        return panels;
      }
    }
    return DDeiKeyActionCancelCurrentAction;
  }

  // ============================ 方法 ===============================
  action(evt: Event, ddInstance: DDei, editor: DDeiEditor): void {
    if (editor.state == DDeiEditorState.DESIGNING) {
      let stage = ddInstance.stage;
      let layer = stage.layers[stage?.layerIndex];
      if (layer) {
        layer.opPoints = []
        if (layer.opLine?.render) {
          layer.opLine.render.enableRefreshShape()
        }
        delete layer.opLine;
        //清空shadows
        layer.shadowControls?.forEach(c => {
          c.destroyed()
        })
        layer.shadowControls = [];
        stage.render.operateState = DDeiEnumOperateState.NONE;
        //清空临时变量
        ddInstance.bus.push(DDeiEnumBusCommandType.ClearTemplateVars, null, evt);
        ddInstance.bus.push(DDeiEnumBusCommandType.UpdateSelectorBounds, null, evt);
        //渲染图形
        ddInstance.bus.push(DDeiEnumBusCommandType.RefreshShape, null, evt);
        //排序并执行所有action
        ddInstance.bus.executeAll();
      }
    }
  }

}


export default DDeiKeyActionCancelCurrentAction
