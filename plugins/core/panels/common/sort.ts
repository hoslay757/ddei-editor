import {DDeiPluginBase} from "ddei-framework";
import Sort from './Sort.vue';

class DDeiCoreSortPanel extends DDeiPluginBase{
  
  name: string = Sort.name
  
  
  /**
   * 缺省实例
   */
  static defaultIns: DDeiCoreSortPanel = new DDeiCoreSortPanel(null);


  plugins: object[] = [Sort]

  getPanels(editor){
    return this.plugins;
  }


  static configuration(options, fullConfig: boolean = false) {
    //解析options，只使用自己相关的
    if (options) {
      let newOptions = {}
      if (fullConfig) {
        if (fullConfig) {
          if (options[Sort.name]) {
            for (let i in options[Sort.name]) {
              newOptions[i] = options[Sort.name][i]
            }
          }
        }
      } else {
        newOptions = options
      }
      if (newOptions && Object.keys(newOptions).length !== 0) {
        let panels = new DDeiCoreSortPanel(newOptions);
        return panels;
      }
    }
    return DDeiCoreSortPanel;
  }

  static modify(fn) {
    return DDeiCoreSortPanel.defaultIns.modify(fn)
  }
}

export default DDeiCoreSortPanel