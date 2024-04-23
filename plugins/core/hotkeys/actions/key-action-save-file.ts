import {DDei} from "ddei-framework";
import {DDeiEnumControlState} from "ddei-framework";
import {DDeiKeyAction} from "ddei-framework";
import {DDeiEnumBusCommandType} from "ddei-framework";
import {DDeiActiveType} from "ddei-framework";
import {DDeiFileState} from "ddei-framework";
import {DDeiEditorEnumBusCommandType} from "ddei-framework";

/**
 * 键行为:保存文件
 * 保存当前文件
 */
class DDeiKeyActionSaveFile extends DDeiKeyAction {

  name: string = "ddei-core-keyaction-save-file"


  /**
   * 缺省实例
   */
  static defaultIns: DDeiKeyActionSaveFile = new DDeiKeyActionSaveFile();

  defaultOptions: object = {
    'keys': [
      //保存
      { ctrl: 1, keys: "83" },
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
          if (options[DDeiKeyActionSaveFile.defaultIns.name]) {
            for (let i in options[DDeiKeyActionSaveFile.defaultIns.name]) {
              newOptions[i] = options[DDeiKeyActionSaveFile.defaultIns.name][i]
            }
          }
        }
      } else {
        newOptions = options
      }
      if (newOptions && Object.keys(newOptions).length !== 0) {
        let panels = new DDeiKeyActionSaveFile(newOptions);
        return panels;
      }
    }
    return DDeiKeyActionSaveFile;
  }
  // ============================ 方法 ===============================
  action(evt: Event, ddInstance: DDei): void {
    ddInstance.bus?.push(DDeiEditorEnumBusCommandType.SaveFile, {}, evt)
    ddInstance.bus?.executeAll()
  }

}


export default DDeiKeyActionSaveFile
