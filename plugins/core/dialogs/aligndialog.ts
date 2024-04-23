import {DDeiPluginBase} from "ddei-framework1";
import AlignDialog from './AlignDialog.vue';

class DDeiCoreAlignDialog extends DDeiPluginBase{
  
  name: string = AlignDialog.name
  /**
   * 缺省实例
   */
  static defaultIns: DDeiCoreAlignDialog = new DDeiCoreAlignDialog(null);


  plugins: object[] = [AlignDialog]

  getDialogs(editor){
    return this.plugins;
  }

  static configuraton(options, fullConfig: boolean = false) {
    //解析options，只使用自己相关的
    if (options) {
      let newOptions = {}
      if (fullConfig) {
        if (fullConfig) {
          if (options[AlignDialog.name]) {
            for (let i in options[AlignDialog.name]) {
              newOptions[i] = options[AlignDialog.name][i]
            }
          }
        }
      } else {
        newOptions = options
      }
      if (newOptions && Object.keys(newOptions).length !== 0) {
        let panels = new DDeiCoreAlignDialog(newOptions);
        return panels;
      }
    }
    return DDeiCoreAlignDialog;
  }
}

export default DDeiCoreAlignDialog