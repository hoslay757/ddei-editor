import {DDeiPluginBase} from "ddei-framework";
import SearchPanel from './SearchPanel.vue';

class DDeiExtSearchPanel extends DDeiPluginBase{
  
  name: string = SearchPanel.name
  
  
  /**
   * 缺省实例
   */
  static defaultIns: DDeiExtSearchPanel = new DDeiExtSearchPanel(null);


  plugins: object[] = [SearchPanel]

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
        let panels = new DDeiExtSearchPanel(newOptions);
        return panels;
      }
    }
    return DDeiExtSearchPanel;
  }
}

export default DDeiExtSearchPanel