import {DDeiPluginBase} from "ddei-framework";
import Tool from './Tool.vue';

class DDeiCoreToolPanel extends DDeiPluginBase{
  
  name: string = Tool.name
  
  
  /**
   * 缺省实例
   */
  static defaultIns: DDeiCoreToolPanel = new DDeiCoreToolPanel(null);


  plugins: object[] = [Tool]

  getPanels(editor){
    return this.plugins;
  }


  static configuraton(options, fullConfig: boolean = false) {
    //解析options，只使用自己相关的
    if (options) {
      let newOptions = {}
      if (fullConfig) {
        if (fullConfig) {
          if (options[Tool.name]) {
            for (let i in options[Tool.name]) {
              newOptions[i] = options[Tool.name][i]
            }
          }
        }
      } else {
        newOptions = options
      }
      if (newOptions && Object.keys(newOptions).length !== 0) {
        let panels = new DDeiCoreToolPanel(newOptions);
        return panels;
      }
    }
    return DDeiCoreToolPanel;
  }
}

export default DDeiCoreToolPanel