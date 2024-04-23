import {DDeiPluginBase} from "ddei-framework";
import PublishFileConfirmDialog from './PublishFileConfirmDialog.vue';

class DDeiCorePublishFileConfirmDialog extends DDeiPluginBase{
  name: string = PublishFileConfirmDialog.name
  /**
   * 缺省实例
   */
  static defaultIns: DDeiCorePublishFileConfirmDialog = new DDeiCorePublishFileConfirmDialog(null);


  plugins: object[] = [PublishFileConfirmDialog]

  getDialogs(editor){
    return this.plugins;
  }

  static configuraton(options, fullConfig: boolean = false) {
    //解析options，只使用自己相关的
    if (options) {
      let newOptions = {}
      if (fullConfig) {
        if (fullConfig) {
          if (options[PublishFileConfirmDialog.name]) {
            for (let i in options[PublishFileConfirmDialog.name]) {
              newOptions[i] = options[PublishFileConfirmDialog.name][i]
            }
          }
        }
      } else {
        newOptions = options
      }
      if (newOptions && Object.keys(newOptions).length !== 0) {
        let panels = new DDeiCorePublishFileConfirmDialog(newOptions);
        return panels;
      }
    }
    return DDeiCorePublishFileConfirmDialog;
  }
}

export default DDeiCorePublishFileConfirmDialog