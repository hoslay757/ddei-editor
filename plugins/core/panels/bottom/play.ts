import {DDeiPluginBase} from "ddei-framework";
import Play from './Play.vue';

class DDeiCorePlayPanel extends DDeiPluginBase{
  
  name: string = Play.name
  
  
  /**
   * 缺省实例
   */
  static defaultIns: DDeiCorePlayPanel = new DDeiCorePlayPanel(null);


  plugins: object[] = [Play]

  getPanels(editor){
    return this.plugins;
  }


  static configuration(options, fullConfig: boolean = false) {
    //解析options，只使用自己相关的
    if (options) {
      let newOptions = {}
      if (fullConfig) {
        if (fullConfig) {
          if (options[Play.name]) {
            for (let i in options[Play.name]) {
              newOptions[i] = options[Play.name][i]
            }
          }
        }
      } else {
        newOptions = options
      }
      if (newOptions && Object.keys(newOptions).length !== 0) {
        let panels = new DDeiCorePlayPanel(newOptions);
        return panels;
      }
    }
    return DDeiCorePlayPanel;
  }

  static modify(fn) {
    return DDeiCorePlayPanel.defaultIns.modify(fn)
  }
}

export default DDeiCorePlayPanel