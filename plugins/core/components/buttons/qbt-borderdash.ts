import {DDeiPluginBase} from "ddei-framework";
import QBTBorderDash from './QBTBorderDash.vue';

class DDeiCoreBorderDashButton extends DDeiPluginBase{
  name: string = QBTBorderDash.name
  /**
   * 缺省实例
   */
  static defaultIns: DDeiCoreBorderDashButton = new DDeiCoreBorderDashButton(null);

  plugins: object[] = [QBTBorderDash]

  getComponents(editor){
    return this.plugins;
  }


  static configuraton(options, fullConfig: boolean = false) {
    //解析options，只使用自己相关的
    if (options) {
      let newOptions = {}
      if (fullConfig) {
        if (fullConfig) {
          if (options[QBTBorderDash.name]) {
            for (let i in options[QBTBorderDash.name]) {
              newOptions[i] = options[QBTBorderDash.name][i]
            }
          }
        }
      } else {
        newOptions = options
      }
      if (newOptions && Object.keys(newOptions).length !== 0) {
        let panels = new DDeiCoreBorderDashButton(newOptions);
        return panels;
      }
    }
    return DDeiCoreBorderDashButton;
  }
}

export default DDeiCoreBorderDashButton