import {DDei} from "ddei-framework";
import {DDeiEnumControlState} from "ddei-framework";
import {DDeiKeyAction} from "ddei-framework";
import {DDeiEnumBusCommandType} from "ddei-framework";
import {DDeiEditorState} from "ddei-framework";

/**
 * 键行为:移动到表格下一列
 */
class DDeiKeyActionTableNextCol extends DDeiKeyAction {


  name: string = "ddei-core-keyaction-table-next-col"


  /**
   * 缺省实例
   */
  static defaultIns: DDeiKeyActionTableNextCol = new DDeiKeyActionTableNextCol();

  defaultOptions: object = {
    'keys': [
      //表格内部tab，往下一列
      { keys: "9", modelType: 'DDeiTable', editorState: DDeiEditorState.DESIGNING},
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
          if (options[DDeiKeyActionTableNextCol.defaultIns.name]) {
            for (let i in options[DDeiKeyActionTableNextCol.defaultIns.name]) {
              newOptions[i] = options[DDeiKeyActionTableNextCol.defaultIns.name][i]
            }
          }
        }
      } else {
        newOptions = options
      }
      if (newOptions && Object.keys(newOptions).length !== 0) {
        let panels = new DDeiKeyActionTableNextCol(newOptions);
        return panels;
      }
    }
    return DDeiKeyActionTableNextCol;
  }
  // ============================ 方法 ===============================
  action(evt: Event, ddInstance: DDei): void {
    //修改当前操作控件坐标
    if (ddInstance && ddInstance.stage) {
      let models = Array.from(ddInstance.stage.selectedModels?.values());
      if (models?.length == 1 && models[0].baseModelType == 'DDeiTable' && models[0].curRow != -1 && models[0].curCol != -1) {
        if (models[0].curCol < models[0].cols.length - 1) {
          if (models[0].tempDragCell) {
            models[0].tempDragCell.setState(DDeiEnumControlState.DEFAULT)
          }
          models[0].curCol++;
          models[0].tempDragCell = models[0].rows[models[0].curRow][models[0].curCol]
          models[0].tempDragCell.setState(DDeiEnumControlState.SELECTED)
        }
      }
      //渲染图形
      ddInstance?.bus?.push(DDeiEnumBusCommandType.RefreshShape, null, evt);

      ddInstance?.bus?.executeAll();
    }
  }

}


export default DDeiKeyActionTableNextCol
