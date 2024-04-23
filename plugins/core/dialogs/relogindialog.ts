import {DDeiPluginBase} from "ddei-framework";
import ReLoginDialog from './ReLoginDialog.vue';

class DDeiCoreReLoginDialog extends DDeiPluginBase{
  name: string = ReLoginDialog.name
  /**
   * 缺省实例
   */
  static defaultIns: DDeiCoreReLoginDialog = new DDeiCoreReLoginDialog(null);


  plugins: object[] = [ReLoginDialog]

  getDialogs(editor){
    return this.plugins;
  }

  static configuraton(options, fullConfig: boolean = false) {
    //解析options，只使用自己相关的
    if (options) {
      let newOptions = {}
      if (fullConfig) {
        if (fullConfig) {
          if (options[ReLoginDialog.name]) {
            for (let i in options[ReLoginDialog.name]) {
              newOptions[i] = options[ReLoginDialog.name][i]
            }
          }
        }
      } else {
        newOptions = options
      }
      if (newOptions && Object.keys(newOptions).length !== 0) {
        let panels = new DDeiCoreReLoginDialog(newOptions);
        return panels;
      }
    }
    return DDeiCoreReLoginDialog;
  }
}

export default DDeiCoreReLoginDialog