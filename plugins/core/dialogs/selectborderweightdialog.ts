import {DDeiPluginBase} from "ddei-framework";
import SelectBorderWeightDialog from './SelectBorderWeightDialog.vue';

class DDeiCoreSelectBorderWeightDialog extends DDeiPluginBase{
  name: string = SelectBorderWeightDialog.name
  /**
   * 缺省实例
   */
  static defaultIns: DDeiCoreSelectBorderWeightDialog = new DDeiCoreSelectBorderWeightDialog(null);


  plugins: object[] = [SelectBorderWeightDialog]

  getDialogs(editor){
    return this.plugins;
  }

  static configuration(options, fullConfig: boolean = false) {
    //解析options，只使用自己相关的
    if (options) {
      let newOptions = {}
      if (fullConfig) {
        if (fullConfig) {
          if (options[SelectBorderWeightDialog.name]) {
            for (let i in options[SelectBorderWeightDialog.name]) {
              newOptions[i] = options[SelectBorderWeightDialog.name][i]
            }
          }
        }
      } else {
        newOptions = options
      }
      if (newOptions && Object.keys(newOptions).length !== 0) {
        let panels = new DDeiCoreSelectBorderWeightDialog(newOptions);
        return panels;
      }
    }
    return DDeiCoreSelectBorderWeightDialog;
  }

  static modify(fn) {
    return DDeiCoreSelectBorderWeightDialog.defaultIns.modify(fn)
  }
}

export default DDeiCoreSelectBorderWeightDialog