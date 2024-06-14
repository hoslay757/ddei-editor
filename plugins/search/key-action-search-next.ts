import {DDeiConfig} from "ddei-framework";
import {DDei} from "ddei-framework";
import { DDeiUtil } from "ddei-framework";
import {DDeiEditor} from "ddei-framework";
import { DDeiEnumBusCommandType, DDeiEditorEnumBusCommandType } from "ddei-framework";
import { DDeiEnumControlState } from "ddei-framework";
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
      { keys: "13", editorState: "ddei-search" },
      { ctrl: 1, keys: "13", editorState: "ddei-search", type:"searchAll" },
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
  action(evt: Event, ddInstance: DDei, editor: DDeiEditor,item:object): void {
    if (editor.tempPopData && editor.tempPopData['ddei-ext-dialog-search']){
      if (!editor.search?.inActive) {
        //检查replace_input 是否为激活状态
        let replaceInput = document.getElementById(editor.id + "_search_replace_input");
        if (replaceInput && document.activeElement == replaceInput){
          if (item?.type == 'replaceAll'){
            return;
          }else{
            this.executeReplace(editor, replaceInput)
          }
        }
        editor.search.resultIndex++;
        this.changeFileSheetSelectAndModel(editor);
      }else{
        editor.search.inActive = false
      }
    }
  }

  executeReplace(editor,textInput) {
    if (editor.search?.result?.length > 0) {
      let rsData = editor.search?.result[editor.search?.resultIndex]
      if (rsData.model) {
        editor.replaceModelsData([rsData.model], "text", rsData.index, rsData.index + rsData.len, textInput.value)
        //长度增加量
        for (let k = editor.search.resultIndex+1; k<editor.search.result?.length; k++){
          if (editor.search.result[k].model == rsData.model){
            let lenDelta = textInput.value.length - rsData.len
            if (lenDelta != 0){
              editor.search.result[k].index += lenDelta
              if (editor.search.result[k].index < 0){
                editor.search.result[k].index = 0
              }
            }
          }else{
            break;
          }
          
        }
        editor.search.result.splice(editor.search?.resultIndex, 1)
        if (editor.search.result.length > editor.search.resultIndex){
          editor.search.resultIndex--
          if (editor.search.resultIndex < 0) {
            editor.search.resultIndex = 0
          }
        }
        if (editor.search.result.length == 0){
          editor.search.resultIndex = 0
          rsData.model?.render?.clearCachedValue();
        }
      }
    }
  }


  changeFileSheetSelectAndModel(editor:DDeiEditor):void {
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


export default DDeiKeyActionSearchNext
