import {DDeiPluginBase} from "ddei-framework";
import QBTEditBox from './QBTEditBox.vue';

class DDeiCoreEditBoxButton extends DDeiPluginBase{
  name: string = QBTEditBox.name
  /**
   * 缺省实例
   */
  static defaultIns: DDeiCoreEditBoxButton = new DDeiCoreEditBoxButton(null);

  plugins: object[] = [QBTEditBox]

  getComponents(editor){
    return this.plugins;
  }

  static configuration(options, fullConfig: boolean = false) {
    //解析options，只使用自己相关的
    if (options) {
      let newOptions = {}
      if (fullConfig) {
        if (fullConfig) {
          if (options[QBTEditBox.name]) {
            for (let i in options[QBTEditBox.name]) {
              newOptions[i] = options[QBTEditBox.name][i]
            }
          }
        }
      } else {
        newOptions = options
      }
      if (newOptions && Object.keys(newOptions).length !== 0) {
        let panels = new DDeiCoreEditBoxButton(newOptions);
        return panels;
      }
    }
    return DDeiCoreEditBoxButton;
  }
}

export default DDeiCoreEditBoxButton