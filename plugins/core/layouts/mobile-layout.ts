import {DDeiPluginBase} from "ddei-framework";
import Layout from './MobileLayout.vue';



class DDeiCoreMobileLayout extends DDeiPluginBase{
  name: string = Layout.name
  /**
   * 缺省实例
   */
  static defaultIns: DDeiCoreMobileLayout = new DDeiCoreMobileLayout();

  defaultOptions: object = {
    other: ['ddei-core-panel-toolbox-simple', 'ddei-core-panel-topmenu-simple'],
    middle: ['ddei-core-panel-canvasview'],
    before: [],
    after: ['ddei-core-panel-propertyview-mobile']
  }


  plugins:object[] = [Layout]

  getLayouts(editor){
    return this.plugins
  }
  
  static configuration(options,fullConfig:boolean = false ) {
    //解析options，只使用自己相关的
    if (options) {
      let newOptions = Object.assign({}, {}, DDeiCoreMobileLayout.defaultIns.defaultOptions)
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
        let layouts = new DDeiCoreMobileLayout(newOptions);
        return layouts;
      }
    }
    return DDeiCoreMobileLayout;
  }

  static modify(fn) {
    return DDeiCoreMobileLayout.defaultIns.modify(fn)
  }
}

export default DDeiCoreMobileLayout