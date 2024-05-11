import {DDeiPluginBase} from "ddei-framework";
import MergeComposeDialog from './MergeComposeDialog.vue';

class DDeiCoreMergeComposeDialog extends DDeiPluginBase{
  name: string = MergeComposeDialog.name
  /**
   * 缺省实例
   */
  static defaultIns: DDeiCoreMergeComposeDialog = new DDeiCoreMergeComposeDialog(null);


  plugins: object[] = [MergeComposeDialog]

  getDialogs(editor){
    return this.plugins;
  }

  static configuration(options, fullConfig: boolean = false) {
    //解析options，只使用自己相关的
    if (options) {
      let newOptions = {}
      if (fullConfig) {
        if (fullConfig) {
          if (options[MergeComposeDialog.name]) {
            for (let i in options[MergeComposeDialog.name]) {
              newOptions[i] = options[MergeComposeDialog.name][i]
            }
          }
        }
      } else {
        newOptions = options
      }
      if (newOptions && Object.keys(newOptions).length !== 0) {
        let panels = new DDeiCoreMergeComposeDialog(newOptions);
        return panels;
      }
    }
    return DDeiCoreMergeComposeDialog;
  }
}

export default DDeiCoreMergeComposeDialog