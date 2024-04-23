import {DDeiConfig} from "ddei-framework";
import {DDei} from "ddei-framework";
import {DDeiKeyAction} from "ddei-framework";
import {DDeiEnumBusCommandType} from "ddei-framework";
import {DDeiAbstractShape} from "ddei-framework";
import {DDeiEnumControlState} from "ddei-framework";
import {DDeiEditorState} from "ddei-framework";

/**
 * 键行为:移动模型
 * 批量移动模型
 */
class DDeiKeyActionMoveModels extends DDeiKeyAction {

  name: string = "ddei-core-keyaction-move-models"


  /**
   * 缺省实例
   */
  static defaultIns: DDeiKeyActionMoveModels = new DDeiKeyActionMoveModels();

  defaultOptions: object = {
    'keys': [
      //上
      { shift: 2, keys: "38", editorState: DDeiEditorState.DESIGNING },
      //下
      { shift: 2, keys: "40", editorState: DDeiEditorState.DESIGNING},
      //左
      { shift: 2, keys: "37", editorState: DDeiEditorState.DESIGNING},
      //右
      { shift: 2, keys: "39", editorState: DDeiEditorState.DESIGNING},
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
          if (options[DDeiKeyActionMoveModels.defaultIns.name]) {
            for (let i in options[DDeiKeyActionMoveModels.defaultIns.name]) {
              newOptions[i] = options[DDeiKeyActionMoveModels.defaultIns.name][i]
            }
          }
        }
      } else {
        newOptions = options
      }
      if (newOptions && Object.keys(newOptions).length !== 0) {
        let panels = new DDeiKeyActionMoveModels(newOptions);
        return panels;
      }
    }
    return DDeiKeyActionMoveModels;
  }
  // ============================ 方法 ===============================
  action(evt: Event, ddInstance: DDei): void {
    //修改当前操作控件坐标
    if (ddInstance && ddInstance.stage) {
      let selectedModels = ddInstance.stage.selectedModels;
      let models = Array.from(selectedModels.values());
      if (models.length == 1 && models[0].baseModelType == 'DDeiTable' && models[0].curRow != -1 && models[0].curCol != -1) {

        //上
        if (evt.keyCode == 38) {
          if (models[0].curRow > 0) {
            if (models[0].tempDragCell) {
              models[0].tempDragCell.setState(DDeiEnumControlState.DEFAULT)
            }
            models[0].curRow--;
            models[0].tempDragCell = models[0].rows[models[0].curRow][models[0].curCol]
            models[0].tempDragCell.setState(DDeiEnumControlState.SELECTED)
          }
        }//下
        else if (evt.keyCode == 40) {
          if (models[0].curRow < models[0].rows.length - 1) {
            if (models[0].tempDragCell) {
              models[0].tempDragCell.setState(DDeiEnumControlState.DEFAULT)
            }
            models[0].curRow++;
            models[0].tempDragCell = models[0].rows[models[0].curRow][models[0].curCol]
            models[0].tempDragCell.setState(DDeiEnumControlState.SELECTED)
          }
        }//左
        else if (evt.keyCode == 37) {
          if (models[0].curCol > 0) {
            if (models[0].tempDragCell) {
              models[0].tempDragCell.setState(DDeiEnumControlState.DEFAULT)
            }
            models[0].curCol--;
            models[0].tempDragCell = models[0].rows[models[0].curRow][models[0].curCol]
            models[0].tempDragCell.setState(DDeiEnumControlState.SELECTED)
          }
        }//右
        else if (evt.keyCode == 39) {
          if (models[0].curCol < models[0].cols.length - 1) {
            if (models[0].tempDragCell) {
              models[0].tempDragCell.setState(DDeiEnumControlState.DEFAULT)
            }
            models[0].curCol++;
            models[0].tempDragCell = models[0].rows[models[0].curRow][models[0].curCol]
            models[0].tempDragCell.setState(DDeiEnumControlState.SELECTED)
          }
        }
      } else {
        let moveSize = 1;

        let isShift = DDei.KEY_DOWN_STATE.get("shift");
        if (!isShift) {

          //辅助对齐线宽度
          moveSize = 10;
        }
        let moveOriginLines = []
        models.forEach(md => {
          if (md.baseModelType == 'DDeiLine') {
            moveOriginLines.push(md.id)
          }
        });
        let outRect = DDeiAbstractShape.getOutRectByPV(models);
        let deltaX, deltaY
        //上
        if (evt.keyCode == 38) {
          let mod = 0;
          //如果开启辅助对齐线，则跳回到对齐线上
          if (!isShift) {
            if (outRect.y % moveSize > 0) {
              mod = moveSize - (outRect.y % moveSize);
            }
          }
          deltaY = - moveSize + mod
        }
        //下
        else if (evt.keyCode == 40) {
          let mod = 0;
          if (!isShift) {
            mod = outRect.y % moveSize;
          }
          deltaY = moveSize - mod
        }
        //左
        else if (evt.keyCode == 37) {
          let mod = 0;
          //如果开启辅助对齐线，则跳回到对齐线上
          if (!isShift) {
            if (outRect.x % moveSize > 0) {
              mod = moveSize - (outRect.x % moveSize);
            }
          }
          deltaX = - moveSize + mod
        }
        //右
        else if (evt.keyCode == 39) {
          let mod = 0;
          if (!isShift) {
            mod = outRect.x % moveSize;
          }
          deltaX = moveSize - mod
        }
        let stage = ddInstance.stage

        DDeiAbstractShape.moveModels(models, deltaX, deltaY, moveOriginLines);

        stage.layers[stage.layerIndex].opPoints = []
        if (stage.layers[stage.layerIndex].opLine?.render) {
          stage.layers[stage.layerIndex].opLine.render.enableRefreshShape()
        }
        delete stage.layers[stage.layerIndex].opLine;
        stage.render.refreshJumpLine = false
        ddInstance.bus.push(DDeiEnumBusCommandType.UpdateSelectorBounds);
        ddInstance.bus.push(DDeiEnumBusCommandType.NodifyChange);
        ddInstance.bus.push(DDeiEnumBusCommandType.AddHistroy, null, evt);
        ddInstance.bus.push(DDeiEnumBusCommandType.ClearTemplateVars);
        //渲染图形
        ddInstance.bus.push(DDeiEnumBusCommandType.RefreshShape, null, evt);

        ddInstance.bus.executeAll();



      }


    }
  }

}


export default DDeiKeyActionMoveModels
