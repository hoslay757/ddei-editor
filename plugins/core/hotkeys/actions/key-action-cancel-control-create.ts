import {DDei} from "ddei-framework";
import {DDeiKeyAction} from "ddei-framework";
import {DDeiEnumBusCommandType} from "ddei-framework";
import {DDeiEnumControlState} from "ddei-framework";
import {DDeiEditorState} from "ddei-framework";
import {DDeiEditor} from "ddei-framework";

/**
 * 键行为:取消控件创建
 * 取消控件创建
 */
class DDeiKeyActionCancelControlCreate extends DDeiKeyAction {

  name: string = "ddei-core-keyaction-cancel-control-create"


  /**
   * 缺省实例
   */
  static defaultIns: DDeiKeyActionCancelControlCreate = new DDeiKeyActionCancelControlCreate();

  defaultOptions: object = {
    'keys': [
      {
        keys: "27", editorState: DDeiEditorState.CONTROL_CREATING
      }
    ]
  }

  getHotKeys(editor) {
    return [this];
  }


  static configuraton(options, fullConfig: boolean = false) {
    //解析options，只使用自己相关的
    if (options) {
      let newOptions = {}
      if (fullConfig) {
        if (fullConfig) {
          if (options[DDeiKeyActionCancelControlCreate.defaultIns.name]) {
            for (let i in options[DDeiKeyActionCancelControlCreate.defaultIns.name]) {
              newOptions[i] = options[DDeiKeyActionCancelControlCreate.defaultIns.name][i]
            }
          }
        }
      } else {
        newOptions = options
      }
      if (newOptions && Object.keys(newOptions).length !== 0) {
        let panels = new DDeiKeyActionCancelControlCreate(newOptions);
        return panels;
      }
    }
    return DDeiKeyActionCancelControlCreate;
  }
  // ============================ 方法 ===============================
  action(evt: Event, ddInstance: DDei, editor: DDeiEditor): void {
    if (editor.state == DDeiEditorState.CONTROL_CREATING) {
      if (editor.creatingControls) {
        let layer = ddInstance.stage.layers[ddInstance.stage.layerIndex];
        //从layer中移除控件
        layer.removeModels(editor.creatingControls);
        editor.creatingControls = null
        layer.opPoints = [];
        if (layer.opLine?.render) {
          layer.opLine.render.enableRefreshShape()
        }
        delete layer.opLine;
        //清除临时变量
        editor.bus.push(DDeiEnumBusCommandType.ClearTemplateVars);
        //渲染图形
        editor.bus.push(DDeiEnumBusCommandType.RefreshShape);
        editor.bus.executeAll();
      }
    }
  }

}


export default DDeiKeyActionCancelControlCreate
