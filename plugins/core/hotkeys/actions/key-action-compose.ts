import {DDeiConfig} from "ddei-framework";
import {DDei} from "ddei-framework";
import {DDeiEnumControlState} from "ddei-framework";
import {DDeiEnumOperateState} from "ddei-framework";
import {DDeiRectContainer} from "ddei-framework";
import {DDeiAbstractShape} from "ddei-framework";
import {DDeiKeyAction} from "ddei-framework";
import {DDeiEnumBusCommandType} from "ddei-framework";
import {DDeiEditorState} from "ddei-framework";

/**
 * 键行为:组合
 * 组合已选择的图形，至少两个图形才可以完成组合
 */
class DDeiKeyActionCompose extends DDeiKeyAction {
  name: string = "ddei-core-keyaction-compose"


  /**
   * 缺省实例
   */
  static defaultIns: DDeiKeyActionCompose = new DDeiKeyActionCompose();

  defaultOptions: object = {
    'keys': [
      //组合
      { keys: "71", ctrl: 1, editorState: DDeiEditorState.DESIGNING },
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
          if (options[DDeiKeyActionCompose.defaultIns.name]) {
            for (let i in options[DDeiKeyActionCompose.defaultIns.name]) {
              newOptions[i] = options[DDeiKeyActionCompose.defaultIns.name][i]
            }
          }
        }
      } else {
        newOptions = options
      }
      if (newOptions && Object.keys(newOptions).length !== 0) {
        let panels = new DDeiKeyActionCompose(newOptions);
        return panels;
      }
    }
    return DDeiKeyActionCompose;
  }
  // ============================ 方法 ===============================
  action(evt: Event, ddInstance: DDei): void {
    //修改当前操作控件坐标
    if (ddInstance) {
      //当前激活的图层
      ddInstance.bus.push(DDeiEnumBusCommandType.ModelMerge, null, evt);
      ddInstance.bus.executeAll();

    }
  }

}


export default DDeiKeyActionCompose
