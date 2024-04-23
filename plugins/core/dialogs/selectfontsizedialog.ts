import {DDeiPluginBase} from "ddei-framework";
import SelectFontSizeDialog from './SelectFontSizeDialog.vue';

class DDeiCoreSelectFontSizeDialog extends DDeiPluginBase{
  name: string = SelectFontSizeDialog.name
  /**
   * 缺省实例
   */
  static defaultIns: DDeiCoreSelectFontSizeDialog = new DDeiCoreSelectFontSizeDialog(null);


  plugins: object[] = [SelectFontSizeDialog]

  getDialogs(editor){
    return this.plugins;
  }

  static configuraton(options, fullConfig: boolean = false) {
    //解析options，只使用自己相关的
    if (options) {
      let newOptions = {}
      if (fullConfig) {
        if (fullConfig) {
          if (options[SelectFontSizeDialog.name]) {
            for (let i in options[SelectFontSizeDialog.name]) {
              newOptions[i] = options[SelectFontSizeDialog.name][i]
            }
          }
        }
      } else {
        newOptions = options
      }
      if (newOptions && Object.keys(newOptions).length !== 0) {
        let panels = new DDeiCoreSelectFontSizeDialog(newOptions);
        return panels;
      }
    }
    return DDeiCoreSelectFontSizeDialog;
  }
}

export default DDeiCoreSelectFontSizeDialog