import {DDeiPluginBase} from "ddei-framework";
import QBTFontSize from './QBTFontSize.vue';

class DDeiCoreEditFontSizeButton extends DDeiPluginBase{
  
  name: string = QBTFontSize.name
  /**
   * 缺省实例
   */
  static defaultIns: DDeiCoreEditFontSizeButton = new DDeiCoreEditFontSizeButton(null);



  plugins: object[] = [QBTFontSize]

  getComponents(editor){
    return this.plugins;
  }


  static configuraton(options, fullConfig: boolean = false) {
    //解析options，只使用自己相关的
    if (options) {
      let newOptions = {}
      if (fullConfig) {
        if (fullConfig) {
          if (options[QBTFontSize.name]) {
            for (let i in options[QBTFontSize.name]) {
              newOptions[i] = options[QBTFontSize.name][i]
            }
          }
        }
      } else {
        newOptions = options
      }
      if (newOptions && Object.keys(newOptions).length !== 0) {
        let panels = new DDeiCoreEditFontSizeButton(newOptions);
        return panels;
      }
    }
    return DDeiCoreEditFontSizeButton;
  }
}

export default DDeiCoreEditFontSizeButton