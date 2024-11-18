import {DDeiPluginBase} from "ddei-framework";
import QuickColorView from './QuickColorView.vue';

class DDeiCoreQuickColorViewPanel extends DDeiPluginBase{
  name: string = QuickColorView.name
  /**
   * 缺省实例
   */
  static defaultIns: DDeiCoreQuickColorViewPanel = new DDeiCoreQuickColorViewPanel(null);


  plugins: object[] = [QuickColorView]

  getPanels(editor){
    return this.plugins;
  }

  
  static configuration(options, fullConfig: boolean = false) {
    //解析options，只使用自己相关的
    if (options) {
      let newOptions = {}
      if (fullConfig) {
        if (fullConfig) {
          if (options[QuickColorView.name]) {
            for (let i in options[QuickColorView.name]) {
              newOptions[i] = options[QuickColorView.name][i]
            }
          }
        }
      } else {
        newOptions = options
      }
      if (newOptions && Object.keys(newOptions).length !== 0) {
        let panels = new DDeiCoreQuickColorViewPanel(newOptions);
        return panels;
      }
    }
    return DDeiCoreQuickColorViewPanel;
  }

  static modify(fn) {
    return DDeiCoreQuickColorViewPanel.defaultIns.modify(fn)
  }
}

export default DDeiCoreQuickColorViewPanel