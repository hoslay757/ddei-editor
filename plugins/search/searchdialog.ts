import {DDeiPluginBase} from "ddei-framework";
import SearchDialog from './SearchDialog.vue';

class DDeiExtSearchDialog extends DDeiPluginBase{
  
  name: string = SearchDialog.name
  /**
   * 缺省实例
   */
  static defaultIns: DDeiExtSearchDialog = new DDeiExtSearchDialog(null);


  plugins: object[] = [SearchDialog]

  getDialogs(editor){
    return this.plugins;
  }

  static modify(fn) {
    return DDeiExtSearchDialog.defaultIns.modify(fn)
  }

  static configuration(options, fullConfig: boolean = false) {
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
        let panels = new DDeiExtSearchDialog(newOptions);
        return panels;
      }
    }
    return DDeiExtSearchDialog;
  }
}

export default DDeiExtSearchDialog