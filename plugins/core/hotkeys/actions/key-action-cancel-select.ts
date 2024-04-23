import {DDei} from "ddei-framework1";
import {DDeiKeyAction} from "ddei-framework1";
import {DDeiEnumBusCommandType} from "ddei-framework1";
import {DDeiEnumControlState} from "ddei-framework1";
import {DDeiEditorState} from "ddei-framework1";

/**
 * 键行为:取消全选
 * 取消选择所有控件
 */
class DDeiKeyActionCancelSelect extends DDeiKeyAction {
  name: string = "ddei-core-keyaction-cancel-select"


  /**
   * 缺省实例
   */
  static defaultIns: DDeiKeyActionCancelSelect = new DDeiKeyActionCancelSelect();

  defaultOptions: object = {
    'keys': [
      //取消全选,500毫秒内，连续按两下esc键
      { keys: "27", times: 2, interval: 500, editorState: DDeiEditorState.DESIGNING },
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
          if (options[DDeiKeyActionCancelSelect.defaultIns.name]) {
            for (let i in options[DDeiKeyActionCancelSelect.defaultIns.name]) {
              newOptions[i] = options[DDeiKeyActionCancelSelect.defaultIns.name][i]
            }
          }
        }
      } else {
        newOptions = options
      }
      if (newOptions && Object.keys(newOptions).length !== 0) {
        let panels = new DDeiKeyActionCancelSelect(newOptions);
        return panels;
      }
    }
    return DDeiKeyActionCancelSelect;
  }
  // ============================ 方法 ===============================
  action(evt: Event, ddInstance: DDei): void {
    //修改当前操作控件坐标
    if (ddInstance && ddInstance.stage) {
      let models = Array.from(ddInstance.stage.selectedModels?.values());
      if (models?.length == 1 && models[0].baseModelType == 'DDeiTable' && models[0].curRow != -1 && models[0].curCol != -1) {
        //选中当前表格所有单元格
        for (let i = 0; i < models[0].rows.length; i++) {
          let rowObj = models[0].rows[i];
          for (let j = 0; j < rowObj.length; j++) {
            rowObj[j].setState(DDeiEnumControlState.DEFAULT)
          }
        }
        models[0].curRow = -1
        models[0].curCol = -1
        models[0].tempDragCell = null
      } else {
        //当前激活的图层
        let layer = ddInstance.stage.layers[ddInstance.stage.layerIndex]

        ddInstance?.bus?.push(DDeiEnumBusCommandType.CancelCurLevelSelectedModels, { container: layer, curLevel: true }, evt);
        ddInstance?.bus?.push(DDeiEnumBusCommandType.StageChangeSelectModels, {}, evt);
        ddInstance?.bus?.push(DDeiEnumBusCommandType.UpdateSelectorBounds, null, evt);
      }
      //渲染图形
      ddInstance?.bus?.push(DDeiEnumBusCommandType.RefreshShape, null, evt);

      ddInstance?.bus?.executeAll();
    }
  }

}


export default DDeiKeyActionCancelSelect
