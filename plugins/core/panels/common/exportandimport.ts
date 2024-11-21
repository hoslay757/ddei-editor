import {DDeiPluginBase} from "ddei-framework";
import ExportAndImport from './ExportAndImport.vue';

class DDeiCoreExportAndImportPanel extends DDeiPluginBase{
  
  name: string = ExportAndImport.name
  
  
  /**
   * 缺省实例
   */
  static defaultIns: DDeiCoreExportAndImportPanel = new DDeiCoreExportAndImportPanel(null);


  plugins: object[] = [ExportAndImport]

  getPanels(editor){
    return this.plugins;
  }


  static configuration(options, fullConfig: boolean = false) {
    //解析options，只使用自己相关的
    if (options) {
      let newOptions = {}
      if (fullConfig) {
        if (fullConfig) {
          if (options[ExportAndImport.name]) {
            for (let i in options[ExportAndImport.name]) {
              newOptions[i] = options[ExportAndImport.name][i]
            }
          }
        }
      } else {
        newOptions = options
      }
      if (newOptions && Object.keys(newOptions).length !== 0) {
        let panels = new DDeiCoreExportAndImportPanel(newOptions);
        return panels;
      }
    }
    return DDeiCoreExportAndImportPanel;
  }

  static modify(fn) {
    return DDeiCoreExportAndImportPanel.defaultIns.modify(fn)
  }
}

export default DDeiCoreExportAndImportPanel