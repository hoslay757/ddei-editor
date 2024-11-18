import {DDeiPluginBase} from "ddei-framework";
import Operate from './Operate.vue';

class DDeiCoreOperatePanel extends DDeiPluginBase{
  
  name: string = Operate.name
  
  
  /**
   * 缺省实例
   */
  static defaultIns: DDeiCoreOperatePanel = new DDeiCoreOperatePanel(null);


  plugins: object[] = [Operate]

  getPanels(editor){
    return this.plugins;
  }


  static configuration(options, fullConfig: boolean = false) {
    //解析options，只使用自己相关的
    if (options) {
      let newOptions = {}
      if (fullConfig) {
        if (fullConfig) {
          if (options[Operate.name]) {
            for (let i in options[Operate.name]) {
              newOptions[i] = options[Operate.name][i]
            }
          }
        }
      } else {
        newOptions = options
      }
      if (newOptions && Object.keys(newOptions).length !== 0) {
        let panels = new DDeiCoreOperatePanel(newOptions);
        return panels;
      }
    }
    return DDeiCoreOperatePanel;
  }

  static modify(fn) {
    return DDeiCoreOperatePanel.defaultIns.modify(fn)
  }
}

export default DDeiCoreOperatePanel