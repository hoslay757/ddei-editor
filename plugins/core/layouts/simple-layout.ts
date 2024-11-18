import {DDeiPluginBase} from "ddei-framework";
import Layout from './SimpleLayout.vue';



class DDeiCoreSimpleLayout extends DDeiPluginBase{

  name: string = Layout.name
  /**
   * 缺省实例
   */
  static defaultIns: DDeiCoreSimpleLayout = new DDeiCoreSimpleLayout();

  defaultOptions: object = {
    other: ['ddei-core-panel-toolbox-simple', 'ddei-core-panel-topmenu-simple'],
    middle: ['ddei-core-panel-canvasview'],
    top: [],
    bottom: []
  }


  plugins:object[] = [Layout]

  getLayouts(editor){
    return this.plugins
  }
  
  static configuration(options,fullConfig:boolean = false ) {
    //解析options，只使用自己相关的
    if (options) {
      let newOptions = Object.assign({}, {}, DDeiCoreSimpleLayout.defaultIns.defaultOptions)
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
        let layouts = new DDeiCoreSimpleLayout(newOptions);
        return layouts;
      }
    }
    return DDeiCoreSimpleLayout;
  }

  static modify(fn) {
    return DDeiCoreSimpleLayout.defaultIns.modify(fn)
  }
}

export default DDeiCoreSimpleLayout