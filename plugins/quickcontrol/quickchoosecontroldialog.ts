import {DDeiPluginBase} from "ddei-framework";
import QuickChooseControlDialog from './QuickChooseControlDialog.vue';

class DDeiExtQuickChooseControlDialog extends DDeiPluginBase{
  
  name: string = QuickChooseControlDialog.name
  /**
   * 缺省实例
   */
  static defaultIns: DDeiExtQuickChooseControlDialog = new DDeiExtQuickChooseControlDialog(null);


  plugins: object[] = [QuickChooseControlDialog]

  getDialogs(editor){
    return this.plugins;
  }

  static configuration(options, fullConfig: boolean = false) {
    //解析options，只使用自己相关的
    if (options) {
      let newOptions = {}
      if (fullConfig) {
        if (fullConfig) {
          if (options[QuickChooseControlDialog.name]) {
            for (let i in options[QuickChooseControlDialog.name]) {
              newOptions[i] = options[QuickChooseControlDialog.name][i]
            }
          }
        }
      } else {
        newOptions = options
      }
      if (newOptions && Object.keys(newOptions).length !== 0) {
        let panels = new DDeiExtQuickChooseControlDialog(newOptions);
        return panels;
      }
    }
    return DDeiExtQuickChooseControlDialog;
  }

  static modify(fn) {
    return DDeiExtQuickChooseControlDialog.defaultIns.modify(fn)
  }
}

export default DDeiExtQuickChooseControlDialog