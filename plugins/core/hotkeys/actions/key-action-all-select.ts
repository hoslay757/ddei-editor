import {DDei} from "ddei-framework";
import {DDeiEnumControlState} from "ddei-framework";
import {DDeiKeyAction} from "ddei-framework";
import {DDeiEnumBusCommandType} from "ddei-framework";
import {DDeiUtil} from "ddei-framework";
import {DDeiEnumOperateType} from "ddei-framework";
import {DDeiEditorState} from "ddei-framework";

/**
 * 键行为:全选
 * 全选所有控件
 */
class DDeiKeyActionAllSelect extends DDeiKeyAction {

  name: string = "ddei-core-keyaction-all-select"


  /**
   * 缺省实例
   */
  static defaultIns: DDeiKeyActionAllSelect = new DDeiKeyActionAllSelect();

  defaultOptions: object = {
    'keys': [
      {
        ctrl: 1, keys: "65", editorState: DDeiEditorState.DESIGNING
      }
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
          if (options[DDeiKeyActionAllSelect.defaultIns.name]) {
            for (let i in options[DDeiKeyActionAllSelect.defaultIns.name]) {
              newOptions[i] = options[DDeiKeyActionAllSelect.defaultIns.name][i]
            }
          }
        }
      } else {
        newOptions = options
      }
      if (newOptions && Object.keys(newOptions).length !== 0) {
        let panels = new DDeiKeyActionAllSelect(newOptions);
        return panels;
      }
    }
    return DDeiKeyActionAllSelect;
  }

  // ============================ 方法 ===============================
  action(evt: Event, ddInstance: DDei): void {
    //修改当前操作控件坐标
    if (ddInstance && ddInstance.stage) {
      let models = []
      if (ddInstance.stage.selectedModels?.size > 0) {
        models = Array.from(ddInstance.stage.selectedModels?.values());
      }
      if (models?.length == 1 && models[0].baseModelType == 'DDeiTable' && models[0].curRow != -1 && models[0].curCol != -1) {
        //选中当前表格所有单元格
        for (let i = 0; i < models[0].rows.length; i++) {
          let rowObj = models[0].rows[i];
          for (let j = 0; j < rowObj.length; j++) {
            rowObj[j].setState(DDeiEnumControlState.SELECTED)
          }
        }
      } else {
        //当前激活的图层
        let layer = ddInstance.stage.layers[ddInstance.stage.layerIndex]
        //加载事件的配置
        let rsState = DDeiUtil.invokeCallbackFunc("EVENT_CONTROL_SELECT_BEFORE", DDeiEnumOperateType.SELECT, { models: Array.from(layer.models.values()) }, ddInstance, evt)
        if (rsState == 0 || rsState == 1) {
          ddInstance?.bus?.push(DDeiEnumBusCommandType.ModelChangeSelect, { models: layer.models, value: DDeiEnumControlState.SELECTED }, evt);
          ddInstance?.bus?.push(DDeiEnumBusCommandType.StageChangeSelectModels, {}, evt);
        }
      }
      //渲染图形
      ddInstance?.bus?.push(DDeiEnumBusCommandType.RefreshShape, null, evt);

      ddInstance?.bus?.executeAll();
    }
  }

}


export default DDeiKeyActionAllSelect
