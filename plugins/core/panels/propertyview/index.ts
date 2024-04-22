import {DDeiPluginBase} from "ddei-framework1";
import PropertyView from './PropertyView.vue';

class DDeiCorePropertyViewPanel extends DDeiPluginBase{
  
  name: string = PropertyView.name
  /**
   * 缺省实例
   */
  static defaultIns: DDeiCorePropertyViewPanel = new DDeiCorePropertyViewPanel();


  plugins: object[] = [PropertyView]

  getPanels(editor){
    return this.plugins;
  }


  
  static configuraton(options, fullConfig: boolean = false) {
    //解析options，只使用自己相关的
    if (options) {
      let newOptions = {}
      if (fullConfig) {
        if (fullConfig) {
          if (options[PropertyView.name]) {
            for (let i in options[PropertyView.name]) {
              newOptions[i] = options[PropertyView.name][i]
            }
          }
        }
      } else {
        newOptions = options
      }
      if (newOptions && Object.keys(newOptions).length !== 0) {
        let panels = new DDeiCorePropertyViewPanel(newOptions);
        return panels;
      }
    }
    return DDeiCorePropertyViewPanel;
  }
}

export default DDeiCorePropertyViewPanel