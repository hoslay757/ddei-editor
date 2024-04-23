import {DDeiConfig} from "ddei-framework";
import {DDei} from "ddei-framework";
import {DDeiEnumControlState} from "ddei-framework";
import {DDeiEnumOperateState} from "ddei-framework";
import {DDeiKeyAction} from "ddei-framework";
import {DDeiEnumBusCommandType} from "ddei-framework";
import {DDeiEditorState} from "ddei-framework";

/**
 * 键行为:取消组合
 * 取消已组合的图形，必须是容器类图形才能被取消组合
 */
class DDeiKeyActionCancelCompose extends DDeiKeyAction {
  
  name: string = "ddei-core-keyaction-cancel-compose"


  /**
   * 缺省实例
   */
  static defaultIns: DDeiKeyActionCancelCompose = new DDeiKeyActionCancelCompose();

  defaultOptions: object = {
    'keys': [
      {
        keys: "71", ctrl: 1, shift: 1, editorState: DDeiEditorState.DESIGNING
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
          if (options[DDeiKeyActionCancelCompose.defaultIns.name]) {
            for (let i in options[DDeiKeyActionCancelCompose.defaultIns.name]) {
              newOptions[i] = options[DDeiKeyActionCancelCompose.defaultIns.name][i]
            }
          }
        }
      } else {
        newOptions = options
      }
      if (newOptions && Object.keys(newOptions).length !== 0) {
        let panels = new DDeiKeyActionCancelCompose(newOptions);
        return panels;
      }
    }
    return DDeiKeyActionCancelCompose;
  }
  // ============================ 方法 ===============================
  action(evt: Event, ddInstance: DDei): void {
    //修改当前操作控件坐标
    if (ddInstance && ddInstance.stage) {
      //当前激活的图层
      let layer = ddInstance.stage.layers[ddInstance.stage.layerIndex]
      let selectedModels = layer.getSelectedModels();
      if (selectedModels.size > 0) {
        ddInstance.bus.push(DDeiEnumBusCommandType.ModelCancelMerge);
        ddInstance.bus.executeAll();
      }
    }
  }

}


export default DDeiKeyActionCancelCompose
