import {DDeiPluginBase} from "ddei-framework";
import PropertyViewMobile from './PropertyViewMobile.vue';

class DDeiCorePropertyViewMobilePanel extends DDeiPluginBase{
  name: string = PropertyViewMobile.name
  /**
   * 缺省实例
   */
  static defaultIns: DDeiCorePropertyViewMobilePanel = new DDeiCorePropertyViewMobilePanel({
    
  });

  plugins: object[] = [PropertyViewMobile]

  getPanels(editor){
    return this.plugins;
  }


  
  static configuration(options, fullConfig: boolean = false) {
    //解析options，只使用自己相关的
    if (options) {
      let newOptions = {}
      if (fullConfig) {
        if (fullConfig) {
          if (options[PropertyViewMobile.name]) {
            for (let i in options[PropertyViewMobile.name]) {
              newOptions[i] = options[PropertyViewMobile.name][i]
            }
          }
        }
      } else {
        newOptions = options
      }
      if (newOptions && Object.keys(newOptions).length !== 0) {
        let panels = new DDeiCorePropertyViewMobilePanel(newOptions);
        return panels;
      }
    }
    return DDeiCorePropertyViewMobilePanel;
  }

  static modify(fn) {
    return DDeiCorePropertyViewMobilePanel.defaultIns.modify(fn)
  }
}

export default DDeiCorePropertyViewMobilePanel