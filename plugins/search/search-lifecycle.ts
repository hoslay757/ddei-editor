import { DDeiLifeCycle, DDeiFuncData, DDeiEditorUtil, DDeiUtil, DDeiFuncCallResult } from "ddei-framework";
import {debounce} from 'ddei-framework';

class DDeiExtSearchLifeCycle extends DDeiLifeCycle {
  
  name:string = "search-ext-lifecycle"
  /**
   * 缺省实例
   */
  static defaultIns: DDeiExtSearchLifeCycle = new DDeiExtSearchLifeCycle(null);


  EVENT_MOUSE_OPERATING: DDeiFuncData | null = new DDeiFuncData("search-ext-hidden", 1, this.mouseOperating);

  static{
    DDeiExtSearchLifeCycle.displaySearchDialog = debounce(DDeiExtSearchLifeCycle.displaySearchDialog,300);
  }
  /**
     * 正在进行鼠标操作
     */
  mouseOperating(operateType, data, ddInstance, evt): DDeiFuncCallResult {
    let editor = DDeiEditorUtil.getEditorInsByDDei(ddInstance);
    if (editor.tempPopData && editor.tempPopData['ddei-ext-dialog-search']){
      DDeiEditorUtil.hiddenDialog(editor,'ddei-ext-dialog-search')
      if (operateType == "SCROLL_WORKING" || operateType == "CHANGE_RATIO" || operateType == "SELECT_WORKING" || operateType == "DRAG" || operateType == "CREATE" || operateType == "CHANGE_WPV" || operateType == "CHANGE_BOUNDS" || operateType == "CHANGE_ROTATE") {
        DDeiExtSearchLifeCycle.displaySearchDialog(editor);
      }
    }
    
  }

  static displaySearchDialog(editor) {
    //计算弹出框的显示位置，这里需要把模型的坐标转换为dom的坐标
    let srcElement = document.getElementById(editor.id + "_canvas");
    let editorEle = document.getElementById(editor.id);
    let editorDomPos = DDeiUtil.getDomAbsPosition(editorEle);
    let canvasPos = DDeiUtil.getDomAbsPosition(srcElement);
    let left = canvasPos.left - editorDomPos.left + srcElement.offsetWidth - 500
    let top = canvasPos.top - editorDomPos.top
    DDeiEditorUtil.displayDialog(editor, 'ddei-ext-dialog-search', null, { type: 99, left: left, top: top, hiddenMask: true })
  }

  static modify(fn) {
    return DDeiExtSearchLifeCycle.defaultIns.modify(fn)
  }

  static configuration(options, fullConfig: boolean = false) {
    //解析options，只使用自己相关的
    if (options) {
      let newOptions = {}
      if (fullConfig) {
        if (fullConfig) {
          if (options[DDeiExtSearchLifeCycle.name]) {
            for (let i in options[DDeiExtSearchLifeCycle.name]) {
              newOptions[i] = options[DDeiExtSearchLifeCycle.name][i]
            }
          }
        }
      } else {
        newOptions = options
      }
      if (newOptions && Object.keys(newOptions).length !== 0) {
        let panels = new DDeiExtSearchLifeCycle();
        if (newOptions.name) {
          panels.name = newOptions.name
        }
        if (newOptions.sort) {
          panels.sort = newOptions.sort
        }
        return panels;
      }
    }
    return DDeiExtSearchLifeCycle;
  }
}

export default DDeiExtSearchLifeCycle