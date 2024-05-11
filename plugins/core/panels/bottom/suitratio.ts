import {DDeiPluginBase} from "ddei-framework";
import SuitRatio from './SuitRatio.vue';

class DDeiCoreSuitRatioPanel extends DDeiPluginBase{
  
  name: string = SuitRatio.name
  
  
  /**
   * 缺省实例
   */
  static defaultIns: DDeiCoreSuitRatioPanel = new DDeiCoreSuitRatioPanel(null);


  plugins: object[] = [SuitRatio]

  getPanels(editor){
    return this.plugins;
  }


  static configuration(options, fullConfig: boolean = false) {
    //解析options，只使用自己相关的
    if (options) {
      let newOptions = {}
      if (fullConfig) {
        if (fullConfig) {
          if (options[SuitRatio.name]) {
            for (let i in options[SuitRatio.name]) {
              newOptions[i] = options[SuitRatio.name][i]
            }
          }
        }
      } else {
        newOptions = options
      }
      if (newOptions && Object.keys(newOptions).length !== 0) {
        let panels = new DDeiCoreSuitRatioPanel(newOptions);
        return panels;
      }
    }
    return DDeiCoreSuitRatioPanel;
  }
}

export default DDeiCoreSuitRatioPanel