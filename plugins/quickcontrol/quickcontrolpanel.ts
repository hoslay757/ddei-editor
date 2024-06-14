import {DDeiPluginBase} from "ddei-framework";
import QuickControlPanel from './QuickControlPanel.vue';

class DDeiExtQuickControlPanel extends DDeiPluginBase{
  
  name: string = QuickControlPanel.name
  
  
  /**
   * 缺省实例
   */
  static defaultIns: DDeiExtQuickControlPanel = new DDeiExtQuickControlPanel(null);


  plugins: object[] = [QuickControlPanel]

  getPanels(editor){
    return this.plugins;
  }


  static configuration(options, fullConfig: boolean = false) {
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
        let panels = new DDeiExtQuickControlPanel(newOptions);
        return panels;
      }
    }
    return DDeiExtQuickControlPanel;
  }
}

export default DDeiExtQuickControlPanel