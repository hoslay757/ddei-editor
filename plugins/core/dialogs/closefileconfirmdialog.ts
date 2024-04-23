import {DDeiPluginBase} from "ddei-framework";
import CloseFileConfirmDialog from './CloseFileConfirmDialog.vue';

class DDeiCoreCloseFileConfirmDialog extends DDeiPluginBase{
  name: string = CloseFileConfirmDialog.name
  /**
   * 缺省实例
   */
  static defaultIns: DDeiCoreCloseFileConfirmDialog = new DDeiCoreCloseFileConfirmDialog(null);


  plugins: object[] = [CloseFileConfirmDialog]

  getDialogs(editor){
    return this.plugins;
  }

  static configuraton(options, fullConfig: boolean = false) {
    //解析options，只使用自己相关的
    if (options) {
      let newOptions = {}
      if (fullConfig) {
        if (fullConfig) {
          if (options[CloseFileConfirmDialog.name]) {
            for (let i in options[CloseFileConfirmDialog.name]) {
              newOptions[i] = options[CloseFileConfirmDialog.name][i]
            }
          }
        }
      } else {
        newOptions = options
      }
      if (newOptions && Object.keys(newOptions).length !== 0) {
        let panels = new DDeiCoreCloseFileConfirmDialog(newOptions);
        return panels;
      }
    }
    return DDeiCoreCloseFileConfirmDialog;
  }
}

export default DDeiCoreCloseFileConfirmDialog