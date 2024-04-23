import {DDeiPluginBase} from "ddei-framework1";
import Sheets from './Sheets.vue';

class DDeiCoreSheetsPanel extends DDeiPluginBase{
  
  name: string = Sheets.name
  
  
  /**
   * 缺省实例
   */
  static defaultIns: DDeiCoreSheetsPanel = new DDeiCoreSheetsPanel(null);


  plugins: object[] = [Sheets]

  getPanels(editor){
    return this.plugins;
  }


  static configuraton(options, fullConfig: boolean = false) {
    //解析options，只使用自己相关的
    if (options) {
      let newOptions = {}
      if (fullConfig) {
        if (fullConfig) {
          if (options[Sheets.name]) {
            for (let i in options[Sheets.name]) {
              newOptions[i] = options[Sheets.name][i]
            }
          }
        }
      } else {
        newOptions = options
      }
      if (newOptions && Object.keys(newOptions).length !== 0) {
        let panels = new DDeiCoreSheetsPanel(newOptions);
        return panels;
      }
    }
    return DDeiCoreSheetsPanel;
  }
}

export default DDeiCoreSheetsPanel