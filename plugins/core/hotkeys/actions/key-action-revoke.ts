import {DDei} from "ddei-framework";
import {DDeiEnumControlState} from "ddei-framework";
import {DDeiKeyAction} from "ddei-framework";
import {DDeiEnumBusCommandType} from "ddei-framework";
import {DDeiStage} from "ddei-framework";
import {DDeiLayer} from "ddei-framework";
import {DDeiEditor} from "ddei-framework";
import {DDeiActiveType} from "ddei-framework";
import {DDeiFile} from "ddei-framework";
import {DDeiFileState} from "ddei-framework";
import {DDeiEditorUtil} from "ddei-framework";
import {DDeiEditorEnumBusCommandType} from "ddei-framework";
import {DDeiEditorState} from "ddei-framework";

/**
 * 键行为:撤销
 * 撤销上一步操作
 */
class DDeiKeyActionRevoke extends DDeiKeyAction {

  name: string = "ddei-core-keyaction-revoke"


  /**
   * 缺省实例
   */
  static defaultIns: DDeiKeyActionRevoke = new DDeiKeyActionRevoke();

  defaultOptions: object = {
    'keys': [
      //撤销
      { ctrl: 1, keys: "90", editorState: DDeiEditorState.DESIGNING},
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
          if (options[DDeiKeyActionRevoke.defaultIns.name]) {
            for (let i in options[DDeiKeyActionRevoke.defaultIns.name]) {
              newOptions[i] = options[DDeiKeyActionRevoke.defaultIns.name][i]
            }
          }
        }
      } else {
        newOptions = options
      }
      if (newOptions && Object.keys(newOptions).length !== 0) {
        let panels = new DDeiKeyActionRevoke(newOptions);
        return panels;
      }
    }
    return DDeiKeyActionRevoke;
  }

  static modify(fn) {
    return DDeiKeyActionRevoke.defaultIns.modify(fn)
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
    let editor = DDeiEditor.ACTIVE_INSTANCE;
    //必须是canvas的子控件
    if (this.isActive(document.activeElement)) {
      let histype = DDeiEditorUtil.getConfigValue("HISTROY_LEVEL", editor);
      if (histype == 'file') {
        let editor = DDeiEditor.ACTIVE_INSTANCE;
        if (editor?.files.length > 0 && (editor.currentFileIndex == 0 || editor.currentFileIndex)) {
          let file = editor?.files[editor.currentFileIndex]
          //从历史恢复文件
          if (file?.active == DDeiActiveType.ACTIVE) {
            let hisData = file.revokeHistroyData();
            if (hisData?.data) {
              let jsonData = JSON.parse(hisData?.data)
              if (jsonData) {
                let ddInstance = editor?.ddInstance;
                ddInstance.stage.destroyRender()
                let hisFile = DDeiFile.loadFromJSON(jsonData, {
                  currentDdInstance: ddInstance,
                });

                if (hisData.isNew == true) {
                  file.state = DDeiFileState.NONE;
                } else {
                  file.state = DDeiFileState.MODIFY
                }
                file.name = hisFile?.name;
                file.desc = hisFile?.desc;
                file.lastUpdateTime = hisFile?.lastUpdateTime;
                file.sheets = hisFile?.sheets;
                if (file && file.sheets && ddInstance) {
                  file.changeSheet(hisFile.currentSheetIndex);
                  let stage = file.sheets[file.currentSheetIndex].stage;
                  stage.ddInstance = ddInstance;
                  //刷新页面
                  ddInstance.stage = stage;
                  //加载场景渲染器
                  stage.initRender();

                  ddInstance.bus.push(DDeiEnumBusCommandType.RefreshShape);
                  ddInstance.bus.push(DDeiEditorEnumBusCommandType.RefreshEditorParts)
                  ddInstance.bus.executeAll();

                  return true;
                }
              }
            }
          }
        }
      } else if (histype == 'stage') {
        //修改当前操作控件坐标
        if (ddInstance && ddInstance.stage) {
          
          let hisData = ddInstance.stage.revokeHistroyData();
          if (hisData?.data) {
            let jsonData = JSON.parse(hisData?.data)
            if (jsonData) {
              ddInstance.stage.destroyRender()
              let tempData = { "currentDdInstance": ddInstance, "currentStage": ddInstance.stage }
              tempData[ddInstance.stage.id] = ddInstance.stage
              let layers = [];
              jsonData.layers.forEach(layer => {
                let model = DDeiLayer.loadFromJSON(layer, tempData);
                layers.push(model);
              })
              ddInstance.stage.idIdx = jsonData.idIdx;
              ddInstance.stage.layers = layers
              ddInstance.stage.initRender();
              //渲染图形
              ddInstance.bus.push(DDeiEnumBusCommandType.RefreshShape, null, evt);
              ddInstance.bus.push(DDeiEditorEnumBusCommandType.RefreshEditorParts)
              ddInstance.bus.executeAll();

              return true;
            }
          }

        }
      }
    }
    return false;
  }

}


export default DDeiKeyActionRevoke
