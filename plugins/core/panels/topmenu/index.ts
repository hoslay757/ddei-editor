import {DDeiPluginBase} from "ddei-framework";
import TopMenu from './TopMenu.vue';


class DDeiCoreTopMenuPanel extends DDeiPluginBase{
  
  name: string = TopMenu.name
  
  
  /**
   * 缺省实例
   */
  static defaultIns: DDeiCoreTopMenuPanel = new DDeiCoreTopMenuPanel();

  defaultOptions: object = {
    'panels': ["ddei-core-panel-fileinfo", 
       "ddei-core-panel-operate", "ddei-core-panel-fontandtext", "ddei-core-panel-tool"
      , "ddei-core-panel-sort"]
  }


  plugins: object[] = [TopMenu]

  getPanels(editor){
    return this.plugins;
  }


  static configuraton(options, fullConfig: boolean = false) {
    //解析options，只使用自己相关的
    if (options) {
      let newOptions = {}
      if (fullConfig) {
        if (fullConfig) {
          if (options[TopMenu.name]) {
            for (let i in options[TopMenu.name]) {
              newOptions[i] = options[TopMenu.name][i]
            }
          }
        }
      } else {
        newOptions = options
      }
      if (newOptions && Object.keys(newOptions).length !== 0) {
        let panels = new DDeiCoreTopMenuPanel(newOptions);
        return panels;
      }
    }
    return DDeiCoreTopMenuPanel;
  }
}

export default DDeiCoreTopMenuPanel