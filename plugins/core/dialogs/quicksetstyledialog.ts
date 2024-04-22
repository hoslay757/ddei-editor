import {DDeiPluginBase} from "ddei-framework1";
import QuickSetStyleDialog from './QuickSetStyleDialog.vue';

class DDeiCoreQuickSetStyleDialog extends DDeiPluginBase{
  name: string = QuickSetStyleDialog.name
  /**
   * 缺省实例
   */
  static defaultIns: DDeiCoreQuickSetStyleDialog = new DDeiCoreQuickSetStyleDialog(null);


  plugins: object[] = [QuickSetStyleDialog]

  getDialogs(editor){
    return this.plugins;
  }

  static configuraton(options, fullConfig: boolean = false) {
    //解析options，只使用自己相关的
    if (options) {
      let newOptions = {}
      if (fullConfig) {
        if (fullConfig) {
          if (options[QuickSetStyleDialog.name]) {
            for (let i in options[QuickSetStyleDialog.name]) {
              newOptions[i] = options[QuickSetStyleDialog.name][i]
            }
          }
        }
      } else {
        newOptions = options
      }
      if (newOptions && Object.keys(newOptions).length !== 0) {
        let panels = new DDeiCoreQuickSetStyleDialog(newOptions);
        return panels;
      }
    }
    return DDeiCoreQuickSetStyleDialog;
  }
}

export default DDeiCoreQuickSetStyleDialog