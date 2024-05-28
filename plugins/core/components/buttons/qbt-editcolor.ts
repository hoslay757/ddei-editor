import {DDeiPluginBase} from "ddei-framework";
import QBTEditColor from './QBTEditColor.vue';

class DDeiCoreEditColorButton extends DDeiPluginBase{
  name: string = QBTEditColor.name
  /**
   * 缺省实例
   */
  static defaultIns: DDeiCoreEditColorButton = new DDeiCoreEditColorButton(null);


  plugins: object[] = [QBTEditColor]

  getComponents(editor){
    return this.plugins;
  }

  static configuration(options, fullConfig: boolean = false) {
    //解析options，只使用自己相关的
    if (options) {
      let newOptions = {}
      if (fullConfig) {
        if (fullConfig) {
          if (options[QBTEditColor.name]) {
            for (let i in options[QBTEditColor.name]) {
              newOptions[i] = options[QBTEditColor.name][i]
            }
          }
        }
      } else {
        newOptions = options
      }
      if (newOptions && Object.keys(newOptions).length !== 0) {
        let panels = new DDeiCoreEditColorButton(newOptions);
        return panels;
      }
    }
    return DDeiCoreEditColorButton;
  }
}

export default DDeiCoreEditColorButton