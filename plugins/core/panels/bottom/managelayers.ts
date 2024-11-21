import {DDeiPluginBase} from "ddei-framework";
import ManageLayers from './ManageLayers.vue';

class DDeiCoreManageLayersPanel extends DDeiPluginBase{
  
  name: string = ManageLayers.name
  
  
  /**
   * 缺省实例
   */
  static defaultIns: DDeiCoreManageLayersPanel = new DDeiCoreManageLayersPanel(null);


  plugins: object[] = [ManageLayers]

  getPanels(editor){
    return this.plugins;
  }


  static configuration(options, fullConfig: boolean = false) {
    //解析options，只使用自己相关的
    if (options) {
      let newOptions = {}
      if (fullConfig) {
        if (fullConfig) {
          if (options[ManageLayers.name]) {
            for (let i in options[ManageLayers.name]) {
              newOptions[i] = options[ManageLayers.name][i]
            }
          }
        }
      } else {
        newOptions = options
      }
      if (newOptions && Object.keys(newOptions).length !== 0) {
        let panels = new DDeiCoreManageLayersPanel(newOptions);
        return panels;
      }
    }
    return DDeiCoreManageLayersPanel;
  }

  static modify(fn) {
    return  DDeiCoreManageLayersPanel.defaultIns.modify(fn)
  }
}

export default DDeiCoreManageLayersPanel