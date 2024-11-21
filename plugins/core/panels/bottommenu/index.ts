import {DDeiPluginBase} from "ddei-framework";
import BottomMenu from './BottomMenu.vue';

class DDeiCoreBottomMenuPanel extends DDeiPluginBase{
  
  name: string = BottomMenu.name
  /**
   * 缺省实例
   */
  static defaultIns: DDeiCoreBottomMenuPanel = new DDeiCoreBottomMenuPanel();

  defaultOptions: object = {
    'panels': ["ddei-core-panel-bottom-sheets", "ddei-core-panel-bottom-shapecount",
      "ddei-core-panel-bottom-managelayers", "ddei-core-panel-bottom-changeratio", "ddei-core-panel-bottom-suitratio"]
  }

  plugins: object[] = [BottomMenu]

  getPanels(editor){
    return this.plugins;
  }


  static configuration(options, fullConfig: boolean = false) {
    //解析options，只使用自己相关的
    if (options) {
      let newOptions = {}
      if (fullConfig) {
        if (fullConfig) {
          if (options[BottomMenu.name]) {
            for (let i in options[BottomMenu.name]) {
              newOptions[i] = options[BottomMenu.name][i]
            }
          }
        }
      } else {
        newOptions = options
      }
      if (newOptions && Object.keys(newOptions).length !== 0) {
        let panels = new DDeiCoreBottomMenuPanel(newOptions);
        return panels;
      }
    }
    return DDeiCoreBottomMenuPanel;
  }

  static modify(fn) {
    return DDeiCoreBottomMenuPanel.defaultIns.modify(fn)
  }
}

export default DDeiCoreBottomMenuPanel