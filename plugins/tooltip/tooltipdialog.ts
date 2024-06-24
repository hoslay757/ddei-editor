import { DDeiPluginBase } from "ddei-framework";
import TooltipDialog from './TooltipDialog.vue';

class DDeiCoreTooltipDialog extends DDeiPluginBase {

  name: string = TooltipDialog.name
  /**
   * 缺省实例
   */
  static defaultIns: DDeiCoreTooltipDialog = new DDeiCoreTooltipDialog(null);


  plugins: object[] = [TooltipDialog]

  getDialogs(editor) {
    return this.plugins;
  }

  static configuration(options, fullConfig: boolean = false) {
    //解析options，只使用自己相关的
    if (options) {
      let newOptions = {}
      if (fullConfig) {
        if (fullConfig) {
          if (options[TooltipDialog.name]) {
            for (let i in options[TooltipDialog.name]) {
              newOptions[i] = options[TooltipDialog.name][i]
            }
          }
        }
      } else {
        newOptions = options
      }
      if (newOptions && Object.keys(newOptions).length !== 0) {
        let panels = new DDeiCoreTooltipDialog(newOptions);
        return panels;
      }
    }
    return DDeiCoreTooltipDialog;
  }
}

export default DDeiCoreTooltipDialog