import {DDeiConfig} from "ddei-framework";
import {DDei} from "ddei-framework";
import {DDeiKeyAction} from "ddei-framework";
import {DDeiEnumBusCommandType} from "ddei-framework";
import {DDeiUtil} from "ddei-framework";
import {DDeiEnumOperateType} from "ddei-framework";
import {DDeiEditorState} from "ddei-framework";
/**
 * 键行为:删除模型
 * 删除模型
 */
class DDeiKeyActionRemoveModels extends DDeiKeyAction {
  name: string = "ddei-core-keyaction-remove-models"


  /**
   * 缺省实例
   */
  static defaultIns: DDeiKeyActionRemoveModels = new DDeiKeyActionRemoveModels();

  defaultOptions: object = {
    'keys': [
      { keys: "8", editorState: DDeiEditorState.DESIGNING},
      { keys: "46", editorState: DDeiEditorState.DESIGNING},
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
          if (options[DDeiKeyActionRemoveModels.defaultIns.name]) {
            for (let i in options[DDeiKeyActionRemoveModels.defaultIns.name]) {
              newOptions[i] = options[DDeiKeyActionRemoveModels.defaultIns.name][i]
            }
          }
        }
      } else {
        newOptions = options
      }
      if (newOptions && Object.keys(newOptions).length !== 0) {
        let panels = new DDeiKeyActionRemoveModels(newOptions);
        return panels;
      }
    }
    return DDeiKeyActionRemoveModels;
  }
  // ============================ 方法 ===============================
  action(evt: Event, ddInstance: DDei): void {
    //修改当前操作控件坐标
    if (ddInstance && ddInstance.stage) {
      let stageRender = ddInstance.stage.render;
      let optContainer = stageRender.currentOperateContainer;
      if (optContainer) {
        let selectedModels = optContainer.getSelectedModels();
        //加载事件的配置
        let removeBefore = DDeiUtil.getConfigValue(
          "EVENT_CONTROL_DEL_BEFORE",
          ddInstance
        );

        if (!removeBefore || removeBefore(DDeiEnumOperateType.DEL, Array.from(selectedModels.values()), null, ddInstance, evt)) {
          let models = Array.from(selectedModels.values())
          models[0].layer.opPoints = [];

          if (models[0].layer.opLine?.render) {
            models[0].layer.opLine.render.enableRefreshShape()
          }
          delete models[0].layer.opLine;
          optContainer.removeModels(models, true)
          optContainer.cascadeRemoveSelf()


          ddInstance.bus.push(DDeiEnumBusCommandType.UpdatePaperArea);
          ddInstance.bus.push(DDeiEnumBusCommandType.StageChangeSelectModels);
          ddInstance.bus.push(DDeiEnumBusCommandType.UpdateSelectorBounds);
          ddInstance.bus.push(DDeiEnumBusCommandType.NodifyChange);
          ddInstance.bus.push(DDeiEnumBusCommandType.AddHistroy);
          ddInstance.bus.push(DDeiEnumBusCommandType.ChangeStageWPV, {
            dragObj: { dx: 0, dy: 0 }, x: 0, y: 0
          })
          //渲染图形
          ddInstance.bus.push(DDeiEnumBusCommandType.RefreshShape);

          ddInstance.bus.executeAll();
          //加载事件的配置
          let removeAfter = DDeiUtil.getConfigValue(
            "EVENT_CONTROL_DEL_AFTER",
            ddInstance
          );
          if (removeAfter) {
            removeAfter(DDeiEnumOperateType.DEL, Array.from(selectedModels.values()), null, ddInstance, evt)
          }
        }
      }
    }
  }

}


export default DDeiKeyActionRemoveModels
