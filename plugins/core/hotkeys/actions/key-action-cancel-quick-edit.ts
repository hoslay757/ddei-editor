import {DDei} from "ddei-framework";
import {DDeiEditor} from "ddei-framework";
import {DDeiEditorEnumBusCommandType} from "ddei-framework";
import {DDeiEditorState} from "ddei-framework";
import {DDeiKeyAction} from "ddei-framework";
import {DDeiEnumBusCommandType} from "ddei-framework";

/**
 * 键行为:取消快捷编辑
 * 取消快捷编辑
 */
class DDeiKeyActionCancelQuickEdit extends DDeiKeyAction {
  name: string = "ddei-core-keyaction-quickedit-cancel"


  /**
   * 缺省实例
   */
  static defaultIns: DDeiKeyActionCancelQuickEdit = new DDeiKeyActionCancelQuickEdit();

  defaultOptions: object = {
    'keys': [
      { keys: "27", editorState: DDeiEditorState.QUICK_EDITING},
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
          if (options[DDeiKeyActionCancelQuickEdit.defaultIns.name]) {
            for (let i in options[DDeiKeyActionCancelQuickEdit.defaultIns.name]) {
              newOptions[i] = options[DDeiKeyActionCancelQuickEdit.defaultIns.name][i]
            }
          }
        }
      } else {
        newOptions = options
      }
      if (newOptions && Object.keys(newOptions).length !== 0) {
        let panels = new DDeiKeyActionCancelQuickEdit(newOptions);
        return panels;
      }
    }
    return DDeiKeyActionCancelQuickEdit;
  }
  // ============================ 方法 ===============================
  action(evt: Event, ddInstance: DDei): void {
    if (ddInstance.stage.brushDataText) {
      delete ddInstance.stage.brushDataText
    } else {
      let editor = DDeiEditor.ACTIVE_INSTANCE;
      let inputEle = editor.quickEditorInput;
      inputEle.value = "";
      ddInstance.stage.render.editorShadowControl = null;
      editor.quickEditorModel = null
      delete ddInstance.stage.brushDataText
      editor.changeState(DDeiEditorState.DESIGNING);
      editor.bus.push(DDeiEnumBusCommandType.ClearTemplateVars);
      editor.bus.push(DDeiEditorEnumBusCommandType.ClearTemplateUI);
      editor.bus.push(DDeiEditorEnumBusCommandType.RefreshEditorParts, { parts: ["topmenu"] });
      editor.bus.push(DDeiEnumBusCommandType.StageChangeSelectModels);
      editor.bus.push(DDeiEnumBusCommandType.RefreshShape);
      editor.bus.executeAll();
    }
  }

}


export default DDeiKeyActionCancelQuickEdit
