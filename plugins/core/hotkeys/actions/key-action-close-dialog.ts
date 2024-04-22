import {DDeiConfig} from "ddei-framework1";
import {DDei} from "ddei-framework1";
import {DDeiEnumControlState} from "ddei-framework1";
import {DDeiEnumOperateState} from "ddei-framework1";
import {DDeiRectContainer} from "ddei-framework1";
import {DDeiAbstractShape} from "ddei-framework1";
import {DDeiKeyAction} from "ddei-framework1";
import {DDeiEnumBusCommandType} from "ddei-framework1";
import {DDeiUtil} from "ddei-framework1";
import {DDeiEditorUtil} from "ddei-framework1";
import {DDeiEditorState} from "ddei-framework1";

/**
 * 键行为:关闭弹出框
 * 关闭已打开的的弹出框
 */
class DDeiKeyActionCloseDialog extends DDeiKeyAction {
  name: string = "ddei-core-keyaction-close-dialog"


  /**
   * 缺省实例
   */
  static defaultIns: DDeiKeyActionCloseDialog = new DDeiKeyActionCloseDialog();

  defaultOptions: object = {
    'keys': [
      //ESC关闭弹出框
      { keys: "27", editorState: DDeiEditorState.PROPERTY_EDITING },
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
          if (options[DDeiKeyActionCloseDialog.defaultIns.name]) {
            for (let i in options[DDeiKeyActionCloseDialog.defaultIns.name]) {
              newOptions[i] = options[DDeiKeyActionCloseDialog.defaultIns.name][i]
            }
          }
        }
      } else {
        newOptions = options
      }
      if (newOptions && Object.keys(newOptions).length !== 0) {
        let panels = new DDeiKeyActionCloseDialog(newOptions);
        return panels;
      }
    }
    return DDeiKeyActionCloseDialog;
  }
  // ============================ 方法 ===============================
  action(evt: Event, ddInstance: DDei): void {
    DDeiEditorUtil.closeDialogs(["bottom-dialog", "property-dialog", "top-dialog", "toolbox-dialog"])
  }

}


export default DDeiKeyActionCloseDialog
