import {DDeiPluginBase} from "ddei-framework1";
import LineTypeDialog from './LineTypeDialog.vue';

class DDeiCoreLineTypeDialog extends DDeiPluginBase{
  name: string = LineTypeDialog.name
  /**
   * 缺省实例
   */
  static defaultIns: DDeiCoreLineTypeDialog = new DDeiCoreLineTypeDialog(null);


  plugins: object[] = [LineTypeDialog]

  getDialogs(editor){
    return this.plugins;
  }

  static configuraton(options, fullConfig: boolean = false) {
    //解析options，只使用自己相关的
    if (options) {
      let newOptions = {}
      if (fullConfig) {
        if (fullConfig) {
          if (options[LineTypeDialog.name]) {
            for (let i in options[LineTypeDialog.name]) {
              newOptions[i] = options[LineTypeDialog.name][i]
            }
          }
        }
      } else {
        newOptions = options
      }
      if (newOptions && Object.keys(newOptions).length !== 0) {
        let panels = new DDeiCoreLineTypeDialog(newOptions);
        return panels;
      }
    }
    return DDeiCoreLineTypeDialog;
  }
}

export default DDeiCoreLineTypeDialog