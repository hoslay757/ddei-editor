import {DDeiConfig} from "ddei-framework";
import {DDei} from "ddei-framework";
import { DDeiUtil } from "ddei-framework";
import {DDeiEditor} from "ddei-framework";
import {DDeiEditorUtil} from "ddei-framework";
import {DDeiEditorState} from "ddei-framework";
import {DDeiKeyAction} from "ddei-framework";

/**
 * 键行为:搜索
 * 弹出搜索框
 */
class DDeiKeyActionSearch extends DDeiKeyAction {

  name: string = "ddei-ext-keyaction-search"


  /**
   * 缺省实例
   */
  static defaultIns: DDeiKeyActionSearch = new DDeiKeyActionSearch();

  defaultOptions: object = {
    'keys': [
      { ctrl: 1, keys: "70"},
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
        //隐藏弹出框
        DDeiEditorUtil.closeDialog(editor, 'ddei-ext-dialog-search',true)

        //显示弹出框
        let canvasPos = DDeiUtil.getDomAbsPosition(srcElement)
        
        let left = canvasPos.left + srcElement.offsetWidth-500
        let top = canvasPos.top
        if (editor.search?.result){
          editor.search.inActive = true
        }
        DDeiEditorUtil.showDialog(editor, 'ddei-ext-dialog-search', {
          group: "ddei-core-search"
        }, { type: 99, left: left, top: top, hiddenMask: true }, null, true, true)
        editor.changeState("ddei-search");
      }
      
    }else{
      let searchInput = document.getElementById(editor.id +"_search_input")
      if (searchInput){
        searchInput.focus();
        editor.search.inActive = false
        
        editor.changeState("ddei-search");
      }
    }
  }



}


export default DDeiKeyActionSearch
