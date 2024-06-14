import {DDeiPluginBase} from "ddei-framework";
import QuickControlDialog from './QuickControlDialog.vue';

class DDeiExtQuickControlDialog extends DDeiPluginBase{
  
  name: string = QuickControlDialog.name
  /**
   * 缺省实例
   */
  static defaultIns: DDeiExtQuickControlDialog = new DDeiExtQuickControlDialog(null);


  plugins: object[] = [QuickControlDialog]

  getDialogs(editor){
    return this.plugins;
  }

  static configuration(options, fullConfig: boolean = false) {
    //解析options，只使用自己相关的
    if (options) {
      let newOptions = {}
      if (fullConfig) {
        if (fullConfig) {
          if (options[AlignDialog.name]) {
            for (let i in options[AlignDialog.name]) {
              newOptions[i] = options[AlignDialog.name][i]
            }
          }
        }
      } else {
        newOptions = options
      }
      if (newOptions && Object.keys(newOptions).length !== 0) {
        let panels = new DDeiExtQuickControlDialog(newOptions);
        return panels;
      }
    }
    return DDeiExtQuickControlDialog;
  }
}

export default DDeiExtQuickControlDialog