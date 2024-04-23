import {DDeiPluginBase} from "ddei-framework1";
import ExportOptionDialog from './ExportOptionDialog.vue';

class DDeiCoreExportOptionDialog extends DDeiPluginBase{
  name: string = ExportOptionDialog.name
  /**
   * 缺省实例
   */
  static defaultIns: DDeiCoreExportOptionDialog = new DDeiCoreExportOptionDialog(null);


  plugins: object[] = [ExportOptionDialog]

  getDialogs(editor){
    return this.plugins;
  }

  static configuraton(options, fullConfig: boolean = false) {
    //解析options，只使用自己相关的
    if (options) {
      let newOptions = {}
      if (fullConfig) {
        if (fullConfig) {
          if (options[ExportOptionDialog.name]) {
            for (let i in options[ExportOptionDialog.name]) {
              newOptions[i] = options[ExportOptionDialog.name][i]
            }
          }
        }
      } else {
        newOptions = options
      }
      if (newOptions && Object.keys(newOptions).length !== 0) {
        let panels = new DDeiCoreExportOptionDialog(newOptions);
        return panels;
      }
    }
    return DDeiCoreExportOptionDialog;
  }
}

export default DDeiCoreExportOptionDialog