import {DDeiPluginBase} from "ddei-framework";
import DDeiExtTestStep1Converter from "./teststep1"
import DDeiExtTestStep2Converter from "./teststep2"

class DDeiExtTestConverters extends DDeiPluginBase {
  type: string = "package"

  
  /**
   * 缺省实例
   */
  static defaultIns: DDeiExtTestConverters = new DDeiExtTestConverters(null);


  plugins: object[] = [DDeiExtTestStep1Converter, DDeiExtTestStep2Converter]

  getConverters(editor) {
    let converters = []
    this.plugins?.forEach(plugin => {
      let ls
      if (DDeiPluginBase.isSubclass(plugin, DDeiPluginBase)) {
        ls = plugin.defaultIns.getConverters(editor);
      } else if (plugin instanceof DDeiPluginBase) {
        ls = plugin.getConverters(editor);
      }
      if (ls?.length > 0) {
        converters = converters.concat(ls);
      }
    })
    return converters
  }



  static configuraton(options) {
    if (options) {
      //解析options，只使用自己相关的
      let converters = new DDeiExtTestConverters(options);
      for (let i = 0; i < converters.plugins?.length; i++) {
        converters.plugins[i] = converters.plugins[i].configuraton(options, true)
      }
      return converters;
    }
    return DDeiExtTestConverters;
  }
}
export { DDeiExtTestConverters, DDeiExtTestStep1Converter, DDeiExtTestStep2Converter }
export default DDeiExtTestConverters;