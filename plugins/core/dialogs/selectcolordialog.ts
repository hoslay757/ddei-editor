import {DDeiPluginBase} from "ddei-framework";
import SelectColorDialog from './SelectColorDialog.vue';

class DDeiCoreSelectColorDialog extends DDeiPluginBase{
  name: string = SelectColorDialog.name
  /**
   * 缺省实例
   */
  static defaultIns: DDeiCoreSelectColorDialog = new DDeiCoreSelectColorDialog(null);


  plugins: object[] = [SelectColorDialog]

  getDialogs(editor){
    return this.plugins;
  }

  static configuration(options, fullConfig: boolean = false) {
    //解析options，只使用自己相关的
    if (options) {
      let newOptions = {}
      if (fullConfig) {
        if (fullConfig) {
          if (options[SelectColorDialog.name]) {
            for (let i in options[SelectColorDialog.name]) {
              newOptions[i] = options[SelectColorDialog.name][i]
            }
          }
        }
      } else {
        newOptions = options
      }
      if (newOptions && Object.keys(newOptions).length !== 0) {
        let panels = new DDeiCoreSelectColorDialog(newOptions);
        return panels;
      }
    }
    return DDeiCoreSelectColorDialog;
  }
}

export default DDeiCoreSelectColorDialog