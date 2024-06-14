import { DDeiLifeCycle, DDeiEnumControlState,DDeiFuncData, DDeiEditorUtil, DDeiUtil, DDeiFuncCallResult } from "ddei-framework";
import {debounce} from 'lodash';

class DDeiExtSearchLifeCycle extends DDeiLifeCycle {
  
  name:string = "quickcontrol-ext-lifecycle"
  /**
   * 缺省实例
   */
  static defaultIns: DDeiExtSearchLifeCycle = new DDeiExtSearchLifeCycle(null);


  EVENT_MOUSE_MOVE_IN_CONTROL: DDeiFuncData | null = new DDeiFuncData("quickcontrol-ext-show", 1, this.showQuickControlDialog);

  /**
     * 正在进行鼠标操作
     */
  showQuickControlDialog(operateType, data, ddInstance, evt): DDeiFuncCallResult {
    if (ddInstance && ddInstance["AC_DESIGN_EDIT"] && data?.model) {
      let editor = DDeiEditorUtil.getEditorInsByDDei(ddInstance);
      if (!editor.tempPopData || !editor.tempPopData['ddei-ext-dialog-quickcontrol'] || editor.tempPopData['ddei-ext-dialog-quickcontrol'].model != data.model){
        //隐藏弹出框
        DDeiEditorUtil.closeDialog(editor, 'ddei-ext-dialog-quickcontrol', true)

        //显示弹出框
        let editorEle = document.getElementById(editor.id);
        let editorDomPos = DDeiUtil.getDomAbsPosition(editorEle);
        let modelPos = DDeiUtil.getModelsDomAbsPosition([data.model])
        
        let width = 50;
        let height = 50;
        
        let left = modelPos.left - editorDomPos.left - width/2
        let top = modelPos.top - editorDomPos.top - height/2
        if (data.model.state == DDeiEnumControlState.SELECTED) {
          height = 70
          top-=20
        }
        DDeiEditorUtil.showDialog(editor, 'ddei-ext-dialog-quickcontrol', {
          group: "canvas-pop",
          model:data.model,
          width: width,
          height: height
        }, { type: 99, left: left, top: top, hiddenMask: true }, null, true, true)
      }
    }
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