import {DDeiPluginBase} from "ddei-framework";
import ManageLayersDialog from './ManageLayersDialog.vue';

class DDeiCoreManageLayersDialog extends DDeiPluginBase{
  name: string = ManageLayersDialog.name
  /**
   * 缺省实例
   */
  static defaultIns: DDeiCoreManageLayersDialog = new DDeiCoreManageLayersDialog(null);


  plugins: object[] = [ManageLayersDialog]

  getDialogs(editor){
    return this.plugins;
  }

  static configuration(options, fullConfig: boolean = false) {
    //解析options，只使用自己相关的
    if (options) {
      let newOptions = {}
      if (fullConfig) {
        if (fullConfig) {
          if (options[ManageLayersDialog.name]) {
            for (let i in options[ManageLayersDialog.name]) {
              newOptions[i] = options[ManageLayersDialog.name][i]
            }
          }
        }
      } else {
        newOptions = options
      }
      if (newOptions && Object.keys(newOptions).length !== 0) {
        let panels = new DDeiCoreManageLayersDialog(newOptions);
        return panels;
      }
    }
    return DDeiCoreManageLayersDialog;
  }

  static modify(fn) {
    return DDeiCoreManageLayersDialog.defaultIns.modify(fn)
  }
}

export default DDeiCoreManageLayersDialog