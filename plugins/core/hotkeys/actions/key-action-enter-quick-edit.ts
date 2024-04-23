import {DDei} from "ddei-framework";
import {DDeiEditor} from "ddei-framework";
import {DDeiKeyAction} from "ddei-framework";
import {DDeiEditorState} from "ddei-framework";

/**
 * 键行为:确认快捷编辑
 * 确认快捷编辑
 */
class DDeiKeyActionEnterQuickEdit extends DDeiKeyAction {

  name: string = "ddei-core-keyaction-quickedit-enter"


  /**
   * 缺省实例
   */
  static defaultIns: DDeiKeyActionEnterQuickEdit = new DDeiKeyActionEnterQuickEdit();

  defaultOptions: object = {
    'keys': [
      { keys: "13", shift: 1, editorState: DDeiEditorState.QUICK_EDITING },
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
          if (options[DDeiKeyActionEnterQuickEdit.defaultIns.name]) {
            for (let i in options[DDeiKeyActionEnterQuickEdit.defaultIns.name]) {
              newOptions[i] = options[DDeiKeyActionEnterQuickEdit.defaultIns.name][i]
            }
          }
        }
      } else {
        newOptions = options
      }
      if (newOptions && Object.keys(newOptions).length !== 0) {
        let panels = new DDeiKeyActionEnterQuickEdit(newOptions);
        return panels;
      }
    }
    return DDeiKeyActionEnterQuickEdit;
  }

  // ============================ 方法 ===============================
  action(evt: Event, ddInstance: DDei): void {
    let editor = DDeiEditor.ACTIVE_INSTANCE;
    editor.quickEditorInput?.enterValue();

  }

}


export default DDeiKeyActionEnterQuickEdit
