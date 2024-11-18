import {DDeiPluginBase} from "ddei-framework";
import ChangeRatioDialog from './ChangeRatioDialog.vue';

class DDeiCoreChangeRatioDialog extends DDeiPluginBase{
  name: string = ChangeRatioDialog.name
  /**
   * 缺省实例
   */
  static defaultIns: DDeiCoreChangeRatioDialog = new DDeiCoreChangeRatioDialog(null);


  plugins: object[] = [ChangeRatioDialog]

  getDialogs(editor){
    return this.plugins;
  }

  static configuration(options, fullConfig: boolean = false) {
    //解析options，只使用自己相关的
    if (options) {
      let newOptions = {}
      if (fullConfig) {
        if (fullConfig) {
          if (options[ChangeRatioDialog.name]) {
            for (let i in options[ChangeRatioDialog.name]) {
              newOptions[i] = options[ChangeRatioDialog.name][i]
            }
          }
        }
      } else {
        newOptions = options
      }
      if (newOptions && Object.keys(newOptions).length !== 0) {
        let panels = new DDeiCoreChangeRatioDialog(newOptions);
        return panels;
      }
    }
    return DDeiCoreChangeRatioDialog;
  }

  static modify(fn) {
    return DDeiCoreChangeRatioDialog.defaultIns.modify(fn)
  }
}

export default DDeiCoreChangeRatioDialog