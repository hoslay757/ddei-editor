import {DDeiPluginBase} from "ddei-framework";
import LinePointTypeDialog from './LinePointTypeDialog.vue';

class DDeiCoreLinePointTypeDialog extends DDeiPluginBase{
  name: string = LinePointTypeDialog.name
  /**
   * 缺省实例
   */
  static defaultIns: DDeiCoreLinePointTypeDialog = new DDeiCoreLinePointTypeDialog(null);


  plugins: object[] = [LinePointTypeDialog]

  getDialogs(editor){
    return this.plugins;
  }

  static configuraton(options, fullConfig: boolean = false) {
    //解析options，只使用自己相关的
    if (options) {
      let newOptions = {}
      if (fullConfig) {
        if (fullConfig) {
          if (options[LinePointTypeDialog.name]) {
            for (let i in options[LinePointTypeDialog.name]) {
              newOptions[i] = options[LinePointTypeDialog.name][i]
            }
          }
        }
      } else {
        newOptions = options
      }
      if (newOptions && Object.keys(newOptions).length !== 0) {
        let panels = new DDeiCoreLinePointTypeDialog(newOptions);
        return panels;
      }
    }
    return DDeiCoreLinePointTypeDialog;
  }
}

export default DDeiCoreLinePointTypeDialog