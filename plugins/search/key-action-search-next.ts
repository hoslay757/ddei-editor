import {DDeiConfig} from "ddei-framework";
import {DDei} from "ddei-framework";
import { DDeiUtil } from "ddei-framework";
import {DDeiEditor} from "ddei-framework";
import { DDeiEnumBusCommandType, DDeiEditorEnumBusCommandType } from "ddei-framework";
import {DDeiEditorState} from "ddei-framework";
import {DDeiKeyAction} from "ddei-framework";

/**
 * 键行为:跳转到下一个搜索结果
 */
class DDeiKeyActionSearchNext extends DDeiKeyAction {

  name: string = "ddei-core-keyaction-search-next"


  /**
   * 缺省实例
   */
  static defaultIns: DDeiKeyActionSearchNext = new DDeiKeyActionSearchNext();

  defaultOptions: object = {
    'keys': [
      { keys: "13",editorState: "ddei-search" },
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
          if (options[DDeiKeyActionSearchNext.defaultIns.name]) {
            for (let i in options[DDeiKeyActionSearchNext.defaultIns.name]) {
              newOptions[i] = options[DDeiKeyActionSearchNext.defaultIns.name][i]
            }
          }
        }
      } else {
        newOptions = options
      }
      if (newOptions && Object.keys(newOptions).length !== 0) {
        let panels = new DDeiKeyActionSearchNext(newOptions);
        return panels;
      }
    }
    return DDeiKeyActionSearchNext;
  }

  // ============================ 方法 ===============================
  action(evt: Event, ddInstance: DDei, editor: DDeiEditor): void {
    if (editor.tempPopData && editor.tempPopData['ddei-ext-dialog-search']){
      if (!editor.search?.inActive) {
        editor.search.resultIndex++;
        if (editor.search.resultIndex >= editor.search.result.length - 1) {
          editor.search.resultIndex = editor.search.result.length - 1
        } else if (editor.search.resultIndex < 0) {
          editor.search.resultIndex = 0
        }
        let rsData = editor.search.result[editor.search.resultIndex]
        if (rsData?.model) {
          //切换文件和sheet
          let file = editor.files[rsData.fileIndex];
          if (file) {
            let sheetIndex = rsData.sheetIndex;
            if (sheetIndex >= 0) {
              let ddInstance = editor.ddInstance

              editor.changeFile(rsData.fileIndex, sheetIndex)
              //选中并中心化控件
              editor.centerModels(ddInstance.stage, rsData.model.id)
              rsData.model?.render?.controlSelect();
              //绘制选择效果
              let sptStyle = {}
              for (let i = 0; i < rsData.len; i++) {
                sptStyle["" + (rsData.index + i)] = { textStyle: { bgcolor: "#017fff" } }
              }
              rsData.model?.render?.drawShape({ border: { type: 1, color: "#017fff", width: 1, dash: [10, 10] }, sptStyle: sptStyle });
              ddInstance.bus.push(DDeiEnumBusCommandType.RefreshShape);
              ddInstance.bus.push(DDeiEditorEnumBusCommandType.RefreshEditorParts, {});
              ddInstance.bus.executeAll();

            }
          }
        }
      }else{
        editor.search.inActive = false
      }
    }
  }


  


}


export default DDeiKeyActionSearchNext
