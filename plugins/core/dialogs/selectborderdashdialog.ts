import {DDeiPluginBase} from "ddei-framework";
import SelectBorderDashDialog from './SelectBorderDashDialog.vue';

class DDeiCoreSelectBorderDashDialog extends DDeiPluginBase{
  name: string = SelectBorderDashDialog.name
  /**
   * 缺省实例
   */
  static defaultIns: DDeiCoreSelectBorderDashDialog = new DDeiCoreSelectBorderDashDialog(null);


  plugins: object[] = [SelectBorderDashDialog]

  getDialogs(editor){
    return this.plugins;
  }

  static configuration(options, fullConfig: boolean = false) {
    //解析options，只使用自己相关的
    if (options) {
      let newOptions = {}
      if (fullConfig) {
        if (fullConfig) {
          if (options[SelectBorderDashDialog.name]) {
            for (let i in options[SelectBorderDashDialog.name]) {
              newOptions[i] = options[SelectBorderDashDialog.name][i]
            }
          }
        }
      } else {
        newOptions = options
      }
      if (newOptions && Object.keys(newOptions).length !== 0) {
        let panels = new DDeiCoreSelectBorderDashDialog(newOptions);
        return panels;
      }
    }
    return DDeiCoreSelectBorderDashDialog;
  }

  static modify(fn) {
    return DDeiCoreSelectBorderDashDialog.defaultIns.modify(fn)
  }
}

export default DDeiCoreSelectBorderDashDialog