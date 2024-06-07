import {DDeiConfig} from "ddei-framework";
import {DDei} from "ddei-framework";
import { DDeiUtil } from "ddei-framework";
import {DDeiEditor} from "ddei-framework";
import {DDeiEditorUtil} from "ddei-framework";
import {DDeiEditorState} from "ddei-framework";
import {DDeiKeyAction} from "ddei-framework";

/**
 * 键行为:剪切
 * 剪切当前的已选控件
 */
class DDeiKeyActionSearch extends DDeiKeyAction {

  name: string = "ddei-core-keyaction-search"


  /**
   * 缺省实例
   */
  static defaultIns: DDeiKeyActionSearch = new DDeiKeyActionSearch();

  defaultOptions: object = {
    'keys': [
      { ctrl: 1, keys: "70", editorState: DDeiEditorState.DESIGNING },
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
          if (options[DDeiKeyActionSearch.defaultIns.name]) {
            for (let i in options[DDeiKeyActionSearch.defaultIns.name]) {
              newOptions[i] = options[DDeiKeyActionSearch.defaultIns.name][i]
            }
          }
        }
      } else {
        newOptions = options
      }
      if (newOptions && Object.keys(newOptions).length !== 0) {
        let panels = new DDeiKeyActionSearch(newOptions);
        return panels;
      }
    }
    return DDeiKeyActionSearch;
  }

  // ============================ 方法 ===============================
  action(evt: Event, ddInstance: DDei, editor: DDeiEditor): void {
    if (!editor.tempPopData || !editor.tempPopData['ddei-ext-dialog-search']){
      let srcElement = document.getElementById(editor.id +"_canvas")
      if (srcElement){
        let editor = DDeiEditorUtil.getEditorInsByDDei(ddInstance);
        let curState = editor.state
        //隐藏弹出框
        DDeiEditorUtil.closeDialog(editor, 'ddei-ext-dialog-search')

        //显示弹出框
        let canvasPos = DDeiUtil.getDomAbsPosition(srcElement)
        
        let left = canvasPos.left + srcElement.offsetWidth-500
        let top = canvasPos.top
        DDeiEditorUtil.showDialog(editor, 'ddei-ext-dialog-search', {
          group: "canvas-pop-search"
        }, { type: 99, left: left, top: top, hiddenMask: true }, null, true, true)
        editor?.changeState(curState)
      }
    }
  }



}


export default DDeiKeyActionSearch
