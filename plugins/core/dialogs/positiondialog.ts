import {DDeiPluginBase} from "ddei-framework";
import PositionDialog from './PositionDialog.vue';

class DDeiCorePositionDialog extends DDeiPluginBase{
  name: string = PositionDialog.name
  /**
   * 缺省实例
   */
  static defaultIns: DDeiCorePositionDialog = new DDeiCorePositionDialog(null);


  plugins: object[] = [PositionDialog]

  getDialogs(editor){
    return this.plugins;
  }

  static configuration(options, fullConfig: boolean = false) {
    //解析options，只使用自己相关的
    if (options) {
      let newOptions = {}
      if (fullConfig) {
        if (fullConfig) {
          if (options[PositionDialog.name]) {
            for (let i in options[PositionDialog.name]) {
              newOptions[i] = options[PositionDialog.name][i]
            }
          }
        }
      } else {
        newOptions = options
      }
      if (newOptions && Object.keys(newOptions).length !== 0) {
        let panels = new DDeiCorePositionDialog(newOptions);
        return panels;
      }
    }
    return DDeiCorePositionDialog;
  }

  static modify(fn) {
    return DDeiCorePositionDialog.defaultIns.modify(fn)
  }
}

export default DDeiCorePositionDialog