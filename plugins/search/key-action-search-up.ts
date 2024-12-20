import { DDeiConfig } from "ddei-framework";
import { DDei } from "ddei-framework";
import { DDeiUtil } from "ddei-framework";
import { DDeiEditor } from "ddei-framework";
import { DDeiEnumBusCommandType, DDeiEditorEnumBusCommandType } from "ddei-framework";
import { DDeiEditorState } from "ddei-framework";
import { DDeiKeyAction } from "ddei-framework";

/**
 * 键行为:跳转到上一个搜索结果
 */
class DDeiKeyActionSearchUp extends DDeiKeyAction {

  name: string = "ddei-ext-keyaction-search-up"


  /**
   * 缺省实例
   */
  static defaultIns: DDeiKeyActionSearchUp = new DDeiKeyActionSearchUp();

  defaultOptions: object = {
    'keys': [
      { shift: 1, keys: "13", editorState: "ddei-search" },
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
          if (options[DDeiKeyActionSearchUp.defaultIns.name]) {
            for (let i in options[DDeiKeyActionSearchUp.defaultIns.name]) {
              newOptions[i] = options[DDeiKeyActionSearchUp.defaultIns.name][i]
            }
          }
        }
      } else {
        newOptions = options
      }
      if (newOptions && Object.keys(newOptions).length !== 0) {
        let panels = new DDeiKeyActionSearchUp(newOptions);
        return panels;
      }
    }
    return DDeiKeyActionSearchUp;
  }

  static modify(fn) {
    return DDeiKeyActionSearchUp.defaultIns.modify(fn)
  }

  // ============================ 方法 ===============================
  action(evt: Event, ddInstance: DDei, editor: DDeiEditor): void {
    if (editor.tempPopData && editor.tempPopData['ddei-ext-dialog-search']) {
      
      if (!editor.search?.inActive){
        if (editor.search.resultIndex <= 0) {
          return;
        }
        editor.search.resultIndex--;
        this.changeFileSheetSelectAndModel(editor)
      }else{
        editor.search.inActive = false
      }
    }
  }


  changeFileSheetSelectAndModel(editor: DDeiEditor): void {
    editor.search.inActive = false
    if (editor.search.resultIndex >= editor.search.result.length - 1) {
      editor.search.resultIndex = editor.search.result.length - 1
    } else if (editor.search.resultIndex < 0) {
      editor.search.resultIndex = 0
    }
    let ddInstance = editor.ddInstance
    let rsData = editor.search.result[editor.search.resultIndex]
    let skipIndex = [editor.search.resultIndex]
    let textSelectColor = DDeiUtil.getStyleValue("canvas-text-selection", editor.ddInstance);
    if (rsData?.model) {
      //切换文件和sheet
      let file = editor.files[rsData.fileIndex];

      if (file) {
        let sheetIndex = rsData.sheetIndex;
        if (sheetIndex >= 0) {
          editor.changeFile(rsData.fileIndex, sheetIndex)
          //选中并中心化控件
          editor.centerModels(ddInstance.stage, rsData.model.id)
          rsData.model?.render?.controlSelect();
          //绘制选择效果
          let sptStyle = {}
          for (let i = 0; i < rsData.len; i++) {
            sptStyle["" + (rsData.index + i)] = { textStyle: { bgcolor: textSelectColor } }
          }
          //向前、向后查找当前控件，设置特殊样式并标记跳过
          for (let k = editor.search.resultIndex - 1; k > 0; k--) {
            if (editor.search.result[k].model == rsData.model) {
              let rsd1 = editor.search.result[k]
              for (let ki = 0; ki < rsd1.len; ki++) {
                sptStyle["" + (rsd1.index + ki)] = { textStyle: { bgcolor: "#ebebeb" } }
              }
              skipIndex.push(k);
            } else {
              break;
            }
          }
          for (let k = editor.search.resultIndex + 1; k < editor.search.result.length; k++) {
            if (editor.search.result[k].model == rsData.model) {
              let rsd1 = editor.search.result[k]
              for (let ki = 0; ki < rsd1.len; ki++) {
                sptStyle["" + (rsd1.index + ki)] = { textStyle: { bgcolor: "#ebebeb" } }
              }
              skipIndex.push(k);
            } else {
              break;
            }
          }

          rsData.model?.render?.drawShape({ border: { type: 1, color: "#017fff", width: 1, dash: [10, 10] }, sptStyle: sptStyle });

        }
      }
    }

    for (let ri = 0; ri < editor.search.result.length; ri++) {
      let rsData = editor.search.result[ri]
      if (rsData?.model) {
        //切换文件和sheet
        let file = editor.files[rsData.fileIndex];
        if (file) {
          let sheetIndex = rsData.sheetIndex;
          if (sheetIndex >= 0) {
            if (skipIndex.indexOf(ri) == -1) {
              //绘制选择效果
              let sptStyle = {}
              for (let i = 0; i < rsData.len; i++) {
                sptStyle["" + (rsData.index + i)] = { textStyle: { bgcolor: "#ebebeb" } }
              }
              for (let k = ri + 1; k < editor.search.result.length; k++) {
                if (editor.search.result[k].model == rsData.model) {
                  let rsd1 = editor.search.result[k]
                  for (let ki = 0; ki < rsd1.len; ki++) {
                    sptStyle["" + (rsd1.index + ki)] = { textStyle: { bgcolor: "#ebebeb" } }
                  }
                } else {
                  ri = k - 1
                  break;
                }
              }
              rsData.model?.render?.drawShape({ sptStyle: sptStyle });
            }
          }
        }
      }
    }
    ddInstance.bus.push(DDeiEnumBusCommandType.RefreshShape);
    ddInstance.bus.push(DDeiEditorEnumBusCommandType.RefreshEditorParts, {});
    ddInstance.bus.executeAll();
  }





}


export default DDeiKeyActionSearchUp
