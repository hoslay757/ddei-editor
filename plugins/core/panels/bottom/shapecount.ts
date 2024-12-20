import {DDeiPluginBase} from "ddei-framework";
import ShapeCount from './ShapeCount.vue';

class DDeiCoreShapeCountPanel extends DDeiPluginBase{
  
  name: string = ShapeCount.name
  
  
  /**
   * 缺省实例
   */
  static defaultIns: DDeiCoreShapeCountPanel = new DDeiCoreShapeCountPanel(null);


  plugins: object[] = [ShapeCount]

  getPanels(editor){
    return this.plugins;
  }


  static configuration(options, fullConfig: boolean = false) {
    //解析options，只使用自己相关的
    if (options) {
      let newOptions = {}
      if (fullConfig) {
        if (fullConfig) {
          if (options[ShapeCount.name]) {
            for (let i in options[ShapeCount.name]) {
              newOptions[i] = options[ShapeCount.name][i]
            }
          }
        }
      } else {
        newOptions = options
      }
      if (newOptions && Object.keys(newOptions).length !== 0) {
        let panels = new DDeiCoreShapeCountPanel(newOptions);
        return panels;
      }
    }
    return DDeiCoreShapeCountPanel;
  }
  static modify(fn) {
    return DDeiCoreShapeCountPanel.defaultIns.modify(fn)
  }
}

export default DDeiCoreShapeCountPanel