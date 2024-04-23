import {DDeiPluginBase} from "ddei-framework";
import GoBack from './GoBack.vue';

class DDeiCoreGoBackPanel extends DDeiPluginBase{
  
  name: string = GoBack.name
  
  
  /**
   * 缺省实例
   */
  static defaultIns: DDeiCoreGoBackPanel = new DDeiCoreGoBackPanel(null);


  plugins: object[] = [GoBack]

  getPanels(editor){
    return this.plugins;
  }


  static configuraton(options, fullConfig: boolean = false) {
    //解析options，只使用自己相关的
    if (options) {
      let newOptions = {}
      if (fullConfig) {
        if (fullConfig) {
          if (options[GoBack.name]) {
            for (let i in options[GoBack.name]) {
              newOptions[i] = options[GoBack.name][i]
            }
          }
        }
      } else {
        newOptions = options
      }
      if (newOptions && Object.keys(newOptions).length !== 0) {
        let panels = new DDeiCoreGoBackPanel(newOptions);
        return panels;
      }
    }
    return DDeiCoreGoBackPanel;
  }
}

export default DDeiCoreGoBackPanel