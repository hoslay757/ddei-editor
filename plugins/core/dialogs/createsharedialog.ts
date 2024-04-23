import {DDeiPluginBase} from "ddei-framework1";
import CreateShareDialog from './CreateShareDialog.vue';

class DDeiCoreCreateShareDialog extends DDeiPluginBase{
  name: string = CreateShareDialog.name
  /**
   * 缺省实例
   */
  static defaultIns: DDeiCoreCreateShareDialog = new DDeiCoreCreateShareDialog(null);


  plugins: object[] = [CreateShareDialog]

  getDialogs(editor){
    return this.plugins;
  }

  static configuraton(options, fullConfig: boolean = false) {
    //解析options，只使用自己相关的
    if (options) {
      let newOptions = {}
      if (fullConfig) {
        if (fullConfig) {
          if (options[CreateShareDialog.name]) {
            for (let i in options[CreateShareDialog.name]) {
              newOptions[i] = options[CreateShareDialog.name][i]
            }
          }
        }
      } else {
        newOptions = options
      }
      if (newOptions && Object.keys(newOptions).length !== 0) {
        let panels = new DDeiCoreCreateShareDialog(newOptions);
        return panels;
      }
    }
    return DDeiCoreCreateShareDialog;
  }
}

export default DDeiCoreCreateShareDialog