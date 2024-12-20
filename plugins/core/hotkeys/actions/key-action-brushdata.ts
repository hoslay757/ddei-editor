import {DDei} from "ddei-framework";
import {DDeiKeyAction} from "ddei-framework";
import {DDeiEnumBusCommandType} from "ddei-framework";
import {DDeiEditor} from "ddei-framework";
import {DDeiEditorState} from "ddei-framework";
import {DDeiEditorEnumBusCommandType} from "ddei-framework";
import {DDeiUtil} from "ddei-framework";
import { cloneDeep } from 'ddei-framework'

/**
 * 键行为:记录当前控件的格式
 */
class DDeiKeyActionBrushData extends DDeiKeyAction {

  name: string = "ddei-core-keyaction-brush-data"


  /**
   * 缺省实例
   */
  static defaultIns: DDeiKeyActionBrushData = new DDeiKeyActionBrushData();

  defaultOptions: object = {
    'keys': [
      {
        ctrl: 1, shift: 1, keys: "67", editorState: DDeiEditorState.DESIGNING
      }
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
          if (options[DDeiKeyActionBrushData.defaultIns.name]) {
            for (let i in options[DDeiKeyActionBrushData.defaultIns.name]) {
              newOptions[i] = options[DDeiKeyActionBrushData.defaultIns.name][i]
            }
          }
        }
      } else {
        newOptions = options
      }
      if (newOptions && Object.keys(newOptions).length !== 0) {
        let panels = new DDeiKeyActionBrushData(newOptions);
        return panels;
      }
    }
    return DDeiKeyActionBrushData;
  }

  static modify(fn) {
    return DDeiKeyActionBrushData.defaultIns.modify(fn)
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
    //记录当前格式信息，修改状态为刷子状态
    if (ddInstance && ddInstance.stage) {
      //必须是canvas的子控件
      if (this.isActive(document.activeElement)) {
        let stage = ddInstance.stage
        let editor = DDeiEditor.ACTIVE_INSTANCE;
        let models = Array.from(ddInstance.stage.selectedModels?.values());
        stage.brushData = null
        if (models?.length == 1) {
          if (models[0].baseModelType == 'DDeiTable') {
            let table = models[0]
            let selectedCells = table.getSelectedCells();
            let minMaxColRow = table.getMinMaxRowAndCol(selectedCells);
            stage.brushData = []
            for (let i = minMaxColRow.minRow; i <= minMaxColRow.maxRow; i++) {
              let rowObj = table.rows[i];
              let rowData = []

              for (let j = minMaxColRow.minCol; j <= minMaxColRow.maxCol; j++) {
                let cellObj = rowObj[j];
                rowData.push(cellObj);
              }
              stage.brushData.push(rowData);
            }
            if (stage.brushData.length > 0) {
              editor.changeState(DDeiEditorState.DESIGNING)
              editor.bus.push(DDeiEditorEnumBusCommandType.ClearTemplateUI);
              editor.bus.executeAll();
            }
          } else {

            if (editor.state == DDeiEditorState.QUICK_EDITING) {
              let shadowControl = editor.ddInstance.stage.render.editorShadowControl
              if (shadowControl?.render.isEditoring) {
                let editorText = DDeiUtil.getEditorText();
                //开始光标与结束光标
                let curSIdx = -1
                let curEIdx = -1
                if (editorText) {
                  curSIdx = editorText.selectionStart
                  curEIdx = editorText.selectionEnd
                }
                stage.brushDataText = cloneDeep(shadowControl.getSptAllStyles(curSIdx, curEIdx))
              }


              delete stage.brushData
              editor.bus?.push(DDeiEnumBusCommandType.ChangeCursor, { image: 'cursor-brush' })
              editor.bus?.executeAll();
            } else {
              let model = models[0]
              stage.brushData = [model]
              delete stage.brushDataText
              editor.changeState(DDeiEditorState.DESIGNING)
              editor.bus?.push(DDeiEditorEnumBusCommandType.ClearTemplateUI);
              editor.bus?.push(DDeiEnumBusCommandType.ChangeCursor, { image: 'cursor-brush' })
              editor.bus?.executeAll();
            }
            return true;

          }

        }
      }

    }

    return false
  }

}


export default DDeiKeyActionBrushData
