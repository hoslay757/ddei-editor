import {DDeiConfig} from "ddei-framework";
import {DDei} from "ddei-framework";
import { DDeiEnumBusCommandType, DDeiEditorEnumBusCommandType } from "ddei-framework";
import {DDeiEditor} from "ddei-framework";
import {DDeiEditorUtil} from "ddei-framework";
import {DDeiEditorState} from "ddei-framework";
import {DDeiKeyAction} from "ddei-framework";

/**
 * 键行为:关闭搜索框架，退出搜索状态
 */
class DDeiKeyActionSearchEsc extends DDeiKeyAction {

  name: string = "ddei-ext-keyaction-search-esc"


  /**
   * 缺省实例
   */
  static defaultIns: DDeiKeyActionSearchEsc = new DDeiKeyActionSearchEsc();

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
          if (options[DDeiKeyActionSearchEsc.defaultIns.name]) {
            for (let i in options[DDeiKeyActionSearchEsc.defaultIns.name]) {
              newOptions[i] = options[DDeiKeyActionSearchEsc.defaultIns.name][i]
            }
          }
        }
      } else {
        newOptions = options
      }
      if (newOptions && Object.keys(newOptions).length !== 0) {
        let panels = new DDeiKeyActionSearchEsc(newOptions);
        return panels;
      }
    }
    return DDeiKeyActionSearchEsc;
  }

  // ============================ 方法 ===============================
  action(evt: Event, ddInstance: DDei, editor: DDeiEditor): void {
    if (editor.tempPopData && editor.tempPopData['ddei-ext-dialog-search']){
      DDeiEditorUtil.closeDialog(editor, 'ddei-ext-dialog-search',true)
      //清空状态
      if (editor.search.resultIndex >= editor.search.result.length - 1) {
        editor.search.resultIndex = editor.search.result.length - 1
      } else if (editor.search.resultIndex < 0) {
        editor.search.resultIndex = 0
      }
      let rsData = editor.search.result[editor.search.resultIndex]
      if (rsData?.model) {
          rsData.model?.render?.enableRefreshShape();
          ddInstance.bus.push(DDeiEnumBusCommandType.RefreshShape);
          ddInstance.bus.push(DDeiEditorEnumBusCommandType.RefreshEditorParts, {});
          ddInstance.bus.executeAll();
      }
      editor.changeState(DDeiEditorState.DESIGNING);
    }
  }



}


export default DDeiKeyActionSearchEsc
