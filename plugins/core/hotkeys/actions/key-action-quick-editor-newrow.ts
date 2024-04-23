import {DDei} from "ddei-framework1";
import {DDeiEditor} from "ddei-framework1";
import {DDeiKeyAction} from "ddei-framework1";

/**
 * 键行为:新行
 * 确认快捷编辑
 */
class DDeiKeyActionNewRowQuickEdit extends DDeiKeyAction {
  name: string = "ddei-core-keyaction-quickedit-newrow"


  /**
   * 缺省实例
   */
  static defaultIns: DDeiKeyActionNewRowQuickEdit = new DDeiKeyActionNewRowQuickEdit();

  getHotKeys(editor) {
    return [this];
  }


  static configuraton(options, fullConfig: boolean = false) {
    //解析options，只使用自己相关的
    if (options) {
      let newOptions = {}
      if (fullConfig) {
        if (fullConfig) {
          if (options[DDeiKeyActionNewRowQuickEdit.defaultIns.name]) {
            for (let i in options[DDeiKeyActionNewRowQuickEdit.defaultIns.name]) {
              newOptions[i] = options[DDeiKeyActionNewRowQuickEdit.defaultIns.name][i]
            }
          }
        }
      } else {
        newOptions = options
      }
      if (newOptions && Object.keys(newOptions).length !== 0) {
        let panels = new DDeiKeyActionNewRowQuickEdit(newOptions);
        return panels;
      }
    }
    return DDeiKeyActionNewRowQuickEdit;
  }
  // ============================ 方法 ===============================
  action(evt: Event, ddInstance: DDei): void {
    let editor = DDeiEditor.ACTIVE_INSTANCE;
    editor.quickEditorInput.value += '\n'
    editor.quickEditorInput.selectionEnd = editor.quickEditorInput.value.length
  }

}


export default DDeiKeyActionNewRowQuickEdit
