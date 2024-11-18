import {DDeiPluginBase} from "ddei-framework";
import FontAndText from './FontAndText.vue';

class DDeiCoreFontAndTextPanel extends DDeiPluginBase{
  
  name: string = FontAndText.name
  
  
  /**
   * 缺省实例
   */
  static defaultIns: DDeiCoreFontAndTextPanel = new DDeiCoreFontAndTextPanel(null);


  plugins: object[] = [FontAndText]

  getPanels(editor){
    return this.plugins;
  }


  static configuration(options, fullConfig: boolean = false) {
    //解析options，只使用自己相关的
    if (options) {
      let newOptions = {}
      if (fullConfig) {
        if (fullConfig) {
          if (options[FontAndText.name]) {
            for (let i in options[FontAndText.name]) {
              newOptions[i] = options[FontAndText.name][i]
            }
          }
        }
      } else {
        newOptions = options
      }
      if (newOptions && Object.keys(newOptions).length !== 0) {
        let panels = new DDeiCoreFontAndTextPanel(newOptions);
        return panels;
      }
    }
    return DDeiCoreFontAndTextPanel;
  }

  static modify(fn) {
    return DDeiCoreFontAndTextPanel.defaultIns.modify(fn)
  }
}

export default DDeiCoreFontAndTextPanel