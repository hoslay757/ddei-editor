import { DDeiPluginBase } from "ddei-framework";
import CanvasQuickDialog from './CanvasQuickDialog.vue';

class DDeiCoreCanvasQuickDialog extends DDeiPluginBase {

  name: string = CanvasQuickDialog.name
  /**
   * 缺省实例
   */
  static defaultIns: DDeiCoreCanvasQuickDialog = new DDeiCoreCanvasQuickDialog(null);


  plugins: object[] = [CanvasQuickDialog]

  getDialogs(editor) {
    return this.plugins;
  }

  static configuration(options, fullConfig: boolean = false) {
    //解析options，只使用自己相关的
    if (options) {
      let newOptions = {}
      if (fullConfig) {
        if (fullConfig) {
          if (options[CanvasQuickDialog.name]) {
            for (let i in options[CanvasQuickDialog.name]) {
              newOptions[i] = options[CanvasQuickDialog.name][i]
            }
          }
        }
      } else {
        newOptions = options
      }
      if (newOptions && Object.keys(newOptions).length !== 0) {
        let panels = new DDeiCoreCanvasQuickDialog(newOptions);
        return panels;
      }
    }
    return DDeiCoreCanvasQuickDialog;
  }

  static modify(fn) {
    return DDeiCoreCanvasQuickDialog.defaultIns.modify(fn)
  }
}

export default DDeiCoreCanvasQuickDialog