import {DDeiPluginBase} from "ddei-framework";
import Right from './Right.vue';

class DDeiCoreRightPanel extends DDeiPluginBase{
  
  name: string = Right.name
  
  
  /**
   * 缺省实例
   */
  static defaultIns: DDeiCoreRightPanel = new DDeiCoreRightPanel(null);


  plugins: object[] = [Right]

  getPanels(editor){
    return this.plugins;
  }


  static configuraton(options, fullConfig: boolean = false) {
    //解析options，只使用自己相关的
    if (options) {
      let newOptions = {}
      if (fullConfig) {
        if (fullConfig) {
          if (options[Right.name]) {
            for (let i in options[Right.name]) {
              newOptions[i] = options[Right.name][i]
            }
          }
        }
      } else {
        newOptions = options
      }
      if (newOptions && Object.keys(newOptions).length !== 0) {
        let panels = new DDeiCoreRightPanel(newOptions);
        return panels;
      }
    }
    return DDeiCoreRightPanel;
  }
}

export default DDeiCoreRightPanel