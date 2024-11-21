import { DDeiLifeCycle, DDeiFuncData, DDeiEditorUtil, DDeiUtil, DDeiFuncCallResult, DDeiEditorState } from "ddei-framework";
import { debounce } from "lodash";

class DDeiCoreLifeCycle extends DDeiLifeCycle {
  
  name:string = "ddei-core-lifecycle"
  /**
   * 缺省实例
   */
  static defaultIns: DDeiCoreLifeCycle = new DDeiCoreLifeCycle(null);

  EVENT_MOUSE_MOVE_IN_LAYER: DDeiFuncData | null = new DDeiFuncData("mouse-operating", 1, this.mouseOperating);

  /**
     * 正在进行鼠标操作
     */
  mouseOperating(operateType, data, ddInstance, evt): DDeiFuncCallResult {
    let editor = DDeiEditorUtil.getEditorInsByDDei(ddInstance);
    DDeiEditorUtil.closeDialog(editor, 'ddei-core-dialog-choosecontrol')
  }


  static configuration(options, fullConfig: boolean = false) {
    //解析options，只使用自己相关的
    if (options) {
      let newOptions = {}
      if (fullConfig) {
        if (fullConfig) {
          if (options[DDeiCoreLifeCycle.name]) {
            for (let i in options[DDeiCoreLifeCycle.name]) {
              newOptions[i] = options[DDeiCoreLifeCycle.name][i]
            }
          }
        }
      } else {
        newOptions = options
      }
      if (newOptions && Object.keys(newOptions).length !== 0) {
        let panels = new DDeiCoreLifeCycle();
        if (newOptions.name) {
          panels.name = newOptions.name
        }
        if (newOptions.sort) {
          panels.sort = newOptions.sort
        }
        return panels;
      }
    }
    return DDeiCoreLifeCycle;
  }

  static modify(fn) {
    return DDeiCoreLifeCycle.defaultIns.modify(fn)
  }
}

export default DDeiCoreLifeCycle