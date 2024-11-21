import {DDeiPluginBase} from "ddei-framework";
import SelectFontDialog from './SelectFontDialog.vue';

class DDeiCoreSelectFontDialog extends DDeiPluginBase{
  name: string = SelectFontDialog.name
  /**
   * 缺省实例
   */
  static defaultIns: DDeiCoreSelectFontDialog = new DDeiCoreSelectFontDialog(null);


  plugins: object[] = [SelectFontDialog]

  getDialogs(editor){
    return this.plugins;
  }

  static configuration(options, fullConfig: boolean = false) {
    //解析options，只使用自己相关的
    if (options) {
      let newOptions = {}
      if (fullConfig) {
        if (fullConfig) {
          if (options[SelectFontDialog.name]) {
            for (let i in options[SelectFontDialog.name]) {
              newOptions[i] = options[SelectFontDialog.name][i]
            }
          }
        }
      } else {
        newOptions = options
      }
      if (newOptions && Object.keys(newOptions).length !== 0) {
        let panels = new DDeiCoreSelectFontDialog(newOptions);
        return panels;
      }
    }
    return DDeiCoreSelectFontDialog;
  }

  static modify(fn) {
    return DDeiCoreSelectFontDialog.defaultIns.modify(fn)
  }
}

export default DDeiCoreSelectFontDialog