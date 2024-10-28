import {DDeiPluginBase} from "ddei-framework";
import ChooseControlDialog from './ChooseControlDialog.vue';

class DDeiCoreChooseControlDialog extends DDeiPluginBase{
  name: string = ChooseControlDialog.name
  /**
   * 缺省实例
   */
  static defaultIns: DDeiCoreChooseControlDialog = new DDeiCoreChooseControlDialog(null);


  plugins: object[] = [ChooseControlDialog]

  getDialogs(editor){
    return this.plugins;
  }

  static configuration(options, fullConfig: boolean = false) {
    //解析options，只使用自己相关的
    if (options) {
      let newOptions = {}
      if (fullConfig) {
        if (fullConfig) {
          if (options[ChooseControlDialog.name]) {
            for (let i in options[ChooseControlDialog.name]) {
              newOptions[i] = options[ChooseControlDialog.name][i]
            }
          }
        }
      } else {
        newOptions = options
      }
      if (newOptions && Object.keys(newOptions).length !== 0) {
        let panels = new DDeiCoreChooseControlDialog(newOptions);
        return panels;
      }
    }
    return DDeiCoreChooseControlDialog;
  }
}

export default DDeiCoreChooseControlDialog