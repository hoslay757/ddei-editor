import { DDeiLifeCycle, DDeiFuncData, DDeiEditorUtil, DDeiUtil, DDeiFuncCallResult } from "ddei-framework";
import { debounce } from "lodash";

class DDeiCoreCanvasLifeCycle extends DDeiLifeCycle {
  
  name:string = "quickstyle-lifecycle"
  /**
   * 缺省实例
   */
  static defaultIns: DDeiCoreCanvasLifeCycle = new DDeiCoreCanvasLifeCycle(null);

  static {
    DDeiCoreCanvasLifeCycle.displayQuickDialog = debounce(DDeiCoreCanvasLifeCycle.displayQuickDialog, 300);
  }

  EVENT_CONTROL_SELECT_AFTER: DDeiFuncData | null = new DDeiFuncData("quickstyle-show", 1, this.showQuickEditPicker);
  EVENT_MOUSE_OPERATING: DDeiFuncData | null = new DDeiFuncData("quickstyle-hidden", 1, this.mouseOperating);

  /**
     * 正在进行鼠标操作
     */
  mouseOperating(operateType, data, ddInstance, evt): DDeiFuncCallResult {
    if (ddInstance && ddInstance["AC_DESIGN_EDIT"]) {
      let editor = DDeiEditorUtil.getEditorInsByDDei(ddInstance);
      DDeiEditorUtil.hiddenDialog(editor,'ddei-core-dialog-quickpop')
      
      if (operateType == "CHANGE_RATIO" || operateType == "CHANGE_WPV" || operateType == "CHANGE_BOUNDS" || operateType == "CHANGE_ROTATE") {
        
        DDeiCoreCanvasLifeCycle.displayQuickDialog(editor);
      }
    }
  }

  static displayQuickDialog(editor) {
  if (editor?.ddInstance?.stage?.selectedModels?.size > 0) {
    let models = Array.from(editor.ddInstance.stage?.selectedModels.values())
    if (models?.length > 0) {
      let height = 100;
      //计算弹出框的显示位置，这里需要把模型的坐标转换为dom的坐标
      let editorEle = document.getElementById(editor.id);
      let editorDomPos = DDeiUtil.getDomAbsPosition(editorEle);
      let modelPos = DDeiUtil.getModelsDomAbsPosition(models)
      let left = (modelPos.left - editorDomPos.left) + 20
      let top = (modelPos.top - editorDomPos.top)
      if (modelPos.top - height <= modelPos.cTop) {
        if (modelPos.height > 400) {
          top = top + height + 20
        } else {
          top = top + modelPos.height + 20;
        }
      } else {
        top = top - height;
      }
      if (top < 0) {
        top = modelPos.cTop + modelPos.cHeight / 2
      }
      if (left < 0) {
        left = 0
      }
      DDeiEditorUtil.displayDialog(editor, 'ddei-core-dialog-quickpop', null, { type: 99, left: left, top: top, hiddenMask: true })
    }
  }
}
  /**
     * 选择后，在选择控件的合适位置显示快捷编辑框
     */
  showQuickEditPicker(operateType, data, ddInstance, evt): DDeiFuncCallResult {
    
    if (ddInstance && ddInstance["AC_DESIGN_EDIT"]) {
      let models = data?.models;
      let editor = DDeiEditorUtil.getEditorInsByDDei(ddInstance);
      let curState = editor.state
      //隐藏弹出框
      DDeiEditorUtil.closeDialog(editor,'ddei-core-dialog-quickpop')

      //显示弹出框
      if (models?.length > 0) {
        let height = 100;
        //计算弹出框的显示位置，这里需要把模型的坐标转换为dom的坐标
        let editorEle = document.getElementById(editor.id);
        let editorDomPos = DDeiUtil.getDomAbsPosition(editorEle);
        let modelPos = DDeiUtil.getModelsDomAbsPosition(models)
        let left = (modelPos.left - editorDomPos.left) + (modelPos.width / 2)
        let top = (modelPos.top - editorDomPos.top) + (modelPos.height / 2)
        if (modelPos.top - height <= modelPos.cTop) {
          if (modelPos.height > 400) {
            top = top + height + 20
          } else {
            top = top + modelPos.height / 2 + 20;
          }
        } else {
          top = top - height;
        }
        if (top < 0) {
          top = modelPos.cTop + modelPos.cHeight / 2
        }

        if (left < 0) {
          left = 0
        }
        DDeiEditorUtil.showDialog(editor,'ddei-core-dialog-quickpop', {
          group: "canvas-pop"
        }, { type: 99, left: left, top: top, hiddenMask: true }, null, true, true)
        editor?.changeState(curState)
      }
    }
  }

  

  static configuration(options, fullConfig: boolean = false) {
    //解析options，只使用自己相关的
    if (options) {
      let newOptions = {}
      if (fullConfig) {
        if (fullConfig) {
          if (options[DDeiCoreCanvasLifeCycle.name]) {
            for (let i in options[DDeiCoreCanvasLifeCycle.name]) {
              newOptions[i] = options[DDeiCoreCanvasLifeCycle.name][i]
            }
          }
        }
      } else {
        newOptions = options
      }
      if (newOptions && Object.keys(newOptions).length !== 0) {
        let panels = new DDeiCoreCanvasLifeCycle();
        if (newOptions.name) {
          panels.name = newOptions.name
        }
        if (newOptions.sort) {
          panels.sort = newOptions.sort
        }
        return panels;
      }
    }
    return DDeiCoreCanvasLifeCycle;
  }
}

export default DDeiCoreCanvasLifeCycle