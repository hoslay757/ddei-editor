import {DDeiPluginBase} from "ddei-framework";
import QCViewDialog from './QCViewDialog.vue';

class DDeiCoreQCViewDialog extends DDeiPluginBase{
  name: string = QCViewDialog.name
  /**
   * 缺省实例
   */
  static defaultIns: DDeiCoreQCViewDialog = new DDeiCoreQCViewDialog(null);


  plugins: object[] = [QCViewDialog]

  getDialogs(editor){
    return this.plugins;
  }

  static configuraton(options, fullConfig: boolean = false) {
    //解析options，只使用自己相关的
    if (options) {
      let newOptions = {}
      if (fullConfig) {
        if (fullConfig) {
          if (options[QCViewDialog.name]) {
            for (let i in options[QCViewDialog.name]) {
              newOptions[i] = options[QCViewDialog.name][i]
            }
          }
        }
      } else {
        newOptions = options
      }
      if (newOptions && Object.keys(newOptions).length !== 0) {
        let panels = new DDeiCoreQCViewDialog(newOptions);
        return panels;
      }
    }
    return DDeiCoreQCViewDialog;
  }
}

export default DDeiCoreQCViewDialog