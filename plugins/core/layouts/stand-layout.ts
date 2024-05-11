import {DDeiPluginBase} from "ddei-framework";
import Layout from './StandardLayout.vue';



class DDeiCoreStandLayout extends DDeiPluginBase{

  name: string = Layout.name
  /**
   * 缺省实例
   */
  static defaultIns: DDeiCoreStandLayout = new DDeiCoreStandLayout();

  defaultOptions: object = {
    top: ['ddei-core-panel-topmenu'],
    left: ['ddei-core-panel-toolbox'],
    middle: ['ddei-core-panel-canvasview'],
    right: ['ddei-core-panel-propertyview'],
    bottom: ['ddei-core-panel-bottommenu']
  }


  plugins:object[] = [Layout]

  getLayouts(editor){
    return this.plugins
  }
  
  static configuration(options,fullConfig:boolean = false ) {
    //解析options，只使用自己相关的
    if (options) {
      let newOptions = Object.assign({}, {}, DDeiCoreStandLayout.defaultIns.defaultOptions)
      if (fullConfig) {
        if (fullConfig) {
          if (options[Layout.name]) {
            for (let i in options[Layout.name]) {
              newOptions[i] = options[Layout.name][i]
            }
          }
        }
      }else{
        for (let i in options) {
          newOptions[i] = options[i]
        }
      }
      if (newOptions && Object.keys(newOptions).length !== 0){
        let layouts = new DDeiCoreStandLayout(newOptions);
        return layouts;
      }
    }
    return DDeiCoreStandLayout;
  }
}

export default DDeiCoreStandLayout