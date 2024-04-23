import {DDeiPluginBase} from "ddei-framework";
import ChangeRatio from './ChangeRatio.vue';

class DDeiCoreChangeRatioPanel extends DDeiPluginBase{
  
  name: string = ChangeRatio.name
  
  
  /**
   * 缺省实例
   */
  static defaultIns: DDeiCoreChangeRatioPanel = new DDeiCoreChangeRatioPanel(null);


  plugins: object[] = [ChangeRatio]

  getPanels(editor){
    return this.plugins;
  }


  static configuraton(options, fullConfig: boolean = false) {
    //解析options，只使用自己相关的
    if (options) {
      let newOptions = {}
      if (fullConfig) {
        if (fullConfig) {
          if (options[ChangeRatio.name]) {
            for (let i in options[ChangeRatio.name]) {
              newOptions[i] = options[ChangeRatio.name][i]
            }
          }
        }
      } else {
        newOptions = options
      }
      if (newOptions && Object.keys(newOptions).length !== 0) {
        let panels = new DDeiCoreChangeRatioPanel(newOptions);
        return panels;
      }
    }
    return DDeiCoreChangeRatioPanel;
  }
}

export default DDeiCoreChangeRatioPanel