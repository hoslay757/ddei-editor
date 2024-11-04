import {DDei} from "ddei-framework";
import {DDeiEditor} from "ddei-framework";
import {DDeiKeyAction} from "ddei-framework";
import {DDeiEnumBusCommandType} from "ddei-framework";
import {DDeiConfig} from "ddei-framework";
import {DDeiEditorState} from "ddei-framework";

/**
 * 键行为:图形移动到上层或下层、顶层或底层
 * 将已选图形移动到当前图层的上层或下层、顶层或底层
 */
class DDeiKeyActionPushModels extends DDeiKeyAction {

  name: string = "ddei-core-keyaction-push-models"


  /**
   * 缺省实例
   */
  static defaultIns: DDeiKeyActionPushModels = new DDeiKeyActionPushModels();

  defaultOptions: object = {
    'keys': [
      //置于上层
      { ctrl: 1, keys: "38", editorState: DDeiEditorState.DESIGNING },
      //置于下层
      { ctrl: 1, keys: "40", editorState: DDeiEditorState.DESIGNING },
      //置于顶层
      { ctrl: 1, shift: 1, keys: "38", editorState: DDeiEditorState.DESIGNING},
      //置于底层
      { ctrl: 1, shift: 1, keys: "40", editorState: DDeiEditorState.DESIGNING},
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
          if (options[DDeiKeyActionPushModels.defaultIns.name]) {
            for (let i in options[DDeiKeyActionPushModels.defaultIns.name]) {
              newOptions[i] = options[DDeiKeyActionPushModels.defaultIns.name][i]
            }
          }
        }
      } else {
        newOptions = options
      }
      if (newOptions && Object.keys(newOptions).length !== 0) {
        let panels = new DDeiKeyActionPushModels(newOptions);
        return panels;
      }
    }
    return DDeiKeyActionPushModels;
  }
  // ============================ 方法 ===============================

  isActive(element: object): boolean {
    if (!element) {
      return true
    }
    if (element.tagName == 'BODY' || element.tagName == 'HEAD' || element.tagName == 'HTML') {
      return true
    }

    return false
  }


  action(evt: Event, ddInstance: DDei): boolean {
    //修改当前操作控件坐标
    if (ddInstance && ddInstance.stage) {
      //必须是canvas的子控件
      if (this.isActive(document.activeElement)) {
        let stageRender = ddInstance.stage.render;
        let optContainer = stageRender.currentOperateContainer;
        if (optContainer) {
          let isCtrl = DDei.KEY_DOWN_STATE.get("ctrl");
          let isShift = DDei.KEY_DOWN_STATE.get("shift");
          //同时按下ctrl和shift
          if (isCtrl && isShift) {
            //上
            if (evt.keyCode == 38) {
              ddInstance.bus.push(DDeiEnumBusCommandType.ModelPush, { container: optContainer, type: "top" }, evt);
            }
            //下
            else if (evt.keyCode == 40) {
              ddInstance.bus.push(DDeiEnumBusCommandType.ModelPush, { container: optContainer, type: "bottom" }, evt);
            }
          }
          //只按下了ctrl
          else if (isCtrl) {
            //上
            if (evt.keyCode == 38) {
              ddInstance.bus.push(DDeiEnumBusCommandType.ModelPush, { container: optContainer, type: "up" }, evt);
            }
            //下
            else if (evt.keyCode == 40) {
              ddInstance.bus.push(DDeiEnumBusCommandType.ModelPush, { container: optContainer, type: "down" }, evt);
            }
          }
        }
        //渲染图形
        ddInstance.bus.push(DDeiEnumBusCommandType.RefreshShape, null, evt);

        ddInstance.bus.executeAll();

        return true;
      }
    }

    return false;
  }

}


export default DDeiKeyActionPushModels
