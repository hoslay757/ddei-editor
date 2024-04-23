import {DDeiPluginBase} from "ddei-framework1";
import Style from './Style.vue';

class DDeiCoreStylePanel extends DDeiPluginBase{
  
  name: string = Style.name
  
  
  /**
   * 缺省实例
   */
  static defaultIns: DDeiCoreStylePanel = new DDeiCoreStylePanel(null);


  plugins: object[] = [Style]

  getPanels(editor){
    return this.plugins;
  }


  static configuraton(options, fullConfig: boolean = false) {
    //解析options，只使用自己相关的
    if (options) {
      let newOptions = {}
      if (fullConfig) {
        if (fullConfig) {
          if (options[Style.name]) {
            for (let i in options[Style.name]) {
              newOptions[i] = options[Style.name][i]
            }
          }
        }
      } else {
        newOptions = options
      }
      if (newOptions && Object.keys(newOptions).length !== 0) {
        let panels = new DDeiCoreStylePanel(newOptions);
        return panels;
      }
    }
    return DDeiCoreStylePanel;
  }
}

export default DDeiCoreStylePanel