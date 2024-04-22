import {DDeiPluginBase} from "ddei-framework1";
import TextAlignDialog from './TextAlignDialog.vue';

class DDeiCoreTextAlignDialog extends DDeiPluginBase{
  name: string = TextAlignDialog.name
  /**
   * 缺省实例
   */
  static defaultIns: DDeiCoreTextAlignDialog = new DDeiCoreTextAlignDialog(null);


  plugins: object[] = [TextAlignDialog]

  getDialogs(editor){
    return this.plugins;
  }

  static configuraton(options, fullConfig: boolean = false) {
    //解析options，只使用自己相关的
    if (options) {
      let newOptions = {}
      if (fullConfig) {
        if (fullConfig) {
          if (options[TextAlignDialog.name]) {
            for (let i in options[TextAlignDialog.name]) {
              newOptions[i] = options[TextAlignDialog.name][i]
            }
          }
        }
      } else {
        newOptions = options
      }
      if (newOptions && Object.keys(newOptions).length !== 0) {
        let panels = new DDeiCoreTextAlignDialog(newOptions);
        return panels;
      }
    }
    return DDeiCoreTextAlignDialog;
  }
}

export default DDeiCoreTextAlignDialog