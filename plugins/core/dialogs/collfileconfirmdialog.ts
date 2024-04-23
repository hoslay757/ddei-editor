import {DDeiPluginBase} from "ddei-framework";
import CollFileConfirmDialog from './CollFileConfirmDialog.vue';

class DDeiCoreCollFileConfirmDialog extends DDeiPluginBase{
  name: string = CollFileConfirmDialog.name
  /**
   * 缺省实例
   */
  static defaultIns: DDeiCoreCollFileConfirmDialog = new DDeiCoreCollFileConfirmDialog(null);


  plugins: object[] = [CollFileConfirmDialog]

  getDialogs(editor){
    return this.plugins;
  }

  static configuraton(options, fullConfig: boolean = false) {
    //解析options，只使用自己相关的
    if (options) {
      let newOptions = {}
      if (fullConfig) {
        if (fullConfig) {
          if (options[CollFileConfirmDialog.name]) {
            for (let i in options[CollFileConfirmDialog.name]) {
              newOptions[i] = options[CollFileConfirmDialog.name][i]
            }
          }
        }
      } else {
        newOptions = options
      }
      if (newOptions && Object.keys(newOptions).length !== 0) {
        let panels = new DDeiCoreCollFileConfirmDialog(newOptions);
        return panels;
      }
    }
    return DDeiCoreCollFileConfirmDialog;
  }
}

export default DDeiCoreCollFileConfirmDialog