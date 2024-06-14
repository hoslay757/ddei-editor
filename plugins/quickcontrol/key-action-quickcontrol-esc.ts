import {DDeiConfig} from "ddei-framework";
import {DDei} from "ddei-framework";
import { DDeiEnumBusCommandType, DDeiEditorEnumBusCommandType } from "ddei-framework";
import {DDeiEditor} from "ddei-framework";
import {DDeiEditorUtil} from "ddei-framework";
import {DDeiEditorState} from "ddei-framework";
import {DDeiKeyAction} from "ddei-framework";

/**
 * 键行为:关闭快速创建弹框
 */
class DDeiKeyActionQuickControlEsc extends DDeiKeyAction {

  name: string = "ddei-ext-keyaction-quickcontrol-esc"


  /**
   * 缺省实例
   */
  static defaultIns: DDeiKeyActionQuickControlEsc = new DDeiKeyActionQuickControlEsc();

  defaultOptions: object = {
    'keys': [
      { keys: "27" },
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
          if (options[DDeiKeyActionQuickControlEsc.defaultIns.name]) {
            for (let i in options[DDeiKeyActionQuickControlEsc.defaultIns.name]) {
              newOptions[i] = options[DDeiKeyActionQuickControlEsc.defaultIns.name][i]
            }
          }
        }
      } else {
        newOptions = options
      }
      if (newOptions && Object.keys(newOptions).length !== 0) {
        let panels = new DDeiKeyActionQuickControlEsc(newOptions);
        return panels;
      }
    }
    return DDeiKeyActionQuickControlEsc;
  }

  // ============================ 方法 ===============================
  action(evt: Event, ddInstance: DDei, editor: DDeiEditor): void {
    
  }



}


export default DDeiKeyActionQuickControlEsc
