import {DDeiPluginBase} from "ddei-framework1";
import QBTLinePointType from './QBTLinePointType.vue';

class DDeiCoreEditLinePointTypeButton extends DDeiPluginBase{
  name: string = QBTLinePointType.name

  /**
   * 缺省实例
   */
  static defaultIns: DDeiCoreEditLinePointTypeButton = new DDeiCoreEditLinePointTypeButton(null);


  plugins: object[] = [QBTLinePointType]

  getComponents(editor){
    return this.plugins;
  }


  static configuraton(options, fullConfig: boolean = false) {
    //解析options，只使用自己相关的
    if (options) {
      let newOptions = {}
      if (fullConfig) {
        if (fullConfig) {
          if (options[QBTLinePointType.name]) {
            for (let i in options[QBTLinePointType.name]) {
              newOptions[i] = options[QBTLinePointType.name][i]
            }
          }
        }
      } else {
        newOptions = options
      }
      if (newOptions && Object.keys(newOptions).length !== 0) {
        let panels = new DDeiCoreEditLinePointTypeButton(newOptions);
        return panels;
      }
    }
    return DDeiCoreEditLinePointTypeButton;
  }
}

export default DDeiCoreEditLinePointTypeButton