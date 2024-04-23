import {DDeiPluginBase} from "ddei-framework";
import Share from './Share.vue';

class DDeiCoreSharePanel extends DDeiPluginBase{
  
  name: string = Share.name
  
  
  /**
   * 缺省实例
   */
  static defaultIns: DDeiCoreSharePanel = new DDeiCoreSharePanel(null);


  plugins: object[] = [Share]

  getPanels(editor){
    return this.plugins;
  }


  static configuraton(options, fullConfig: boolean = false) {
    //解析options，只使用自己相关的
    if (options) {
      let newOptions = {}
      if (fullConfig) {
        if (fullConfig) {
          if (options[Share.name]) {
            for (let i in options[Share.name]) {
              newOptions[i] = options[Share.name][i]
            }
          }
        }
      } else {
        newOptions = options
      }
      if (newOptions && Object.keys(newOptions).length !== 0) {
        let panels = new DDeiCoreSharePanel(newOptions);
        return panels;
      }
    }
    return DDeiCoreSharePanel;
  }
}

export default DDeiCoreSharePanel