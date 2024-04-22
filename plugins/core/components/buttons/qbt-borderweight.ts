import {DDeiPluginBase} from "ddei-framework1";
import QBTBorderWeight from './QBTBorderWeight.vue';

class DDeiCoreBorderWeightButton extends DDeiPluginBase{
  name: string = QBTBorderWeight.name
  /**
   * 缺省实例
   */
  static defaultIns: DDeiCoreBorderWeightButton = new DDeiCoreBorderWeightButton(null);

  plugins: object[] = [QBTBorderWeight]

  getComponents(editor){
    return this.plugins;
  }
  
  static configuraton(options, fullConfig: boolean = false) {
    //解析options，只使用自己相关的
    if (options) {
      let newOptions = {}
      if (fullConfig) {
        if (fullConfig) {
          if (options[QBTBorderWeight.name]) {
            for (let i in options[QBTBorderWeight.name]) {
              newOptions[i] = options[QBTBorderWeight.name][i]
            }
          }
        }
      } else {
        newOptions = options
      }
      if (newOptions && Object.keys(newOptions).length !== 0) {
        let panels = new DDeiCoreBorderWeightButton(newOptions);
        return panels;
      }
    }
    return DDeiCoreBorderWeightButton;
  }
}

export default DDeiCoreBorderWeightButton