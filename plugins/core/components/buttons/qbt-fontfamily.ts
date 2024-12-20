import {DDeiPluginBase} from "ddei-framework";
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


  static configuration(options, fullConfig: boolean = false) {
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

  static modify(fn) {
    return DDeiCoreEditFontFamilyButton.defaultIns.modify(fn)
  }
}

export default DDeiCoreEditFontFamilyButton