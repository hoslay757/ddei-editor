import {DDeiPluginBase} from "ddei-framework1";
import RotateDialog from './RotateDialog.vue';

class DDeiCoreRotateDialog extends DDeiPluginBase{
  name: string = RotateDialog.name
  /**
   * 缺省实例
   */
  static defaultIns: DDeiCoreRotateDialog = new DDeiCoreRotateDialog(null);


  plugins: object[] = [RotateDialog]

  getDialogs(editor){
    return this.plugins;
  }

  static configuraton(options, fullConfig: boolean = false) {
    //解析options，只使用自己相关的
    if (options) {
      let newOptions = {}
      if (fullConfig) {
        if (fullConfig) {
          if (options[RotateDialog.name]) {
            for (let i in options[RotateDialog.name]) {
              newOptions[i] = options[RotateDialog.name][i]
            }
          }
        }
      } else {
        newOptions = options
      }
      if (newOptions && Object.keys(newOptions).length !== 0) {
        let panels = new DDeiCoreRotateDialog(newOptions);
        return panels;
      }
    }
    return DDeiCoreRotateDialog;
  }
}

export default DDeiCoreRotateDialog