import {DDeiPluginBase} from "ddei-framework1";
import QBTFontFamily from './QBTFontFamily.vue';

class DDeiCoreEditFontFamilyButton extends DDeiPluginBase{
  name: string = QBTFontFamily.name
  /**
   * 缺省实例
   */
  static defaultIns: DDeiCoreEditFontFamilyButton = new DDeiCoreEditFontFamilyButton(null);

  plugins: object[] = [QBTFontFamily]

  getComponents(editor){
    return this.plugins;
  }


  static configuraton(options, fullConfig: boolean = false) {
    //解析options，只使用自己相关的
    if (options) {
      let newOptions = {}
      if (fullConfig) {
        if (fullConfig) {
          if (options[QBTFontFamily.name]) {
            for (let i in options[QBTFontFamily.name]) {
              newOptions[i] = options[QBTFontFamily.name][i]
            }
          }
        }
      } else {
        newOptions = options
      }
      if (newOptions && Object.keys(newOptions).length !== 0) {
        let panels = new DDeiCoreEditFontFamilyButton(newOptions);
        return panels;
      }
    }
    return DDeiCoreEditFontFamilyButton;
  }
}

export default DDeiCoreEditFontFamilyButton