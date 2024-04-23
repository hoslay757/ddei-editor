import {DDeiPluginBase} from "ddei-framework";
import QBTLineType from './QBTLineType.vue';

class DDeiCoreEditLineTypeButton extends DDeiPluginBase{
  name: string = QBTLineType.name
  /**
   * 缺省实例
   */
  static defaultIns: DDeiCoreEditLineTypeButton = new DDeiCoreEditLineTypeButton(null);

 

  plugins: object[] = [QBTLineType]

  getComponents(editor){
    return this.plugins;
  }

  

  static configuraton(options, fullConfig: boolean = false) {
    //解析options，只使用自己相关的
    if (options) {
      let newOptions = {}
      if (fullConfig) {
        if (fullConfig) {
          if (options[QBTLineType.name]) {
            for (let i in options[QBTLineType.name]) {
              newOptions[i] = options[QBTLineType.name][i]
            }
          }
        }
      } else {
        newOptions = options
      }
      if (newOptions && Object.keys(newOptions).length !== 0) {
        let panels = new DDeiCoreEditLineTypeButton(newOptions);
        return panels;
      }
    }
    return DDeiCoreEditLineTypeButton;
  }
}

export default DDeiCoreEditLineTypeButton