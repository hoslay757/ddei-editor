import {DDeiPluginBase} from "ddei-framework1";
import QBTEditAddFontSize from './QBTEditAddFontSize.vue';

class DDeiCoreAddFontSizeButton extends DDeiPluginBase{
  name: string = QBTEditAddFontSize.name
  /**
   * 缺省实例
   */
  static defaultIns: DDeiCoreAddFontSizeButton = new DDeiCoreAddFontSizeButton(null);


  plugins: object[] = [QBTEditAddFontSize]

  getComponents(editor){
    return this.plugins;
  }

  static configuraton(options, fullConfig: boolean = false) {
    //解析options，只使用自己相关的
    if (options) {
      let newOptions = {}
      if (fullConfig) {
        if (fullConfig) {
          if (options[QBTEditAddFontSize.name]) {
            for (let i in options[QBTEditAddFontSize.name]) {
              newOptions[i] = options[QBTEditAddFontSize.name][i]
            }
          }
        }
      } else {
        newOptions = options
      }
      if (newOptions && Object.keys(newOptions).length !== 0) {
        let panels = new DDeiCoreAddFontSizeButton(newOptions);
        return panels;
      }
    }
    return DDeiCoreAddFontSizeButton;
  }
}

export default DDeiCoreAddFontSizeButton