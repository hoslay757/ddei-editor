import {DDeiPluginBase} from "ddei-framework";
import DDeiCoreStandLayout from "./stand-layout";
import DDeiCoreSimpleLayout from "./simple-layout";
import DDeiCoreMobileLayout from "./mobile-layout";



class DDeiCoreLayouts extends DDeiPluginBase{

  type: string = "package"
  /**
   * 缺省实例
   */
  static defaultIns:DDeiCoreLayouts = new DDeiCoreLayouts(null);


  plugins: object[] = [DDeiCoreStandLayout, DDeiCoreSimpleLayout, DDeiCoreMobileLayout]


  getLayouts(editor){
    let layouts = []
    this.plugins?.forEach(plugin=>{
      let ls
      if (DDeiPluginBase.isSubclass(plugin, DDeiPluginBase)) {
        ls = plugin.defaultIns.getLayouts(editor);
      } else if (plugin instanceof DDeiPluginBase) {
        ls = plugin.getLayouts(editor);
      }

      if (ls?.length > 0) {
        layouts = layouts.concat(ls);
      }
    })
    return layouts
  }


  static configuration(options) {
    let layouts = new DDeiCoreLayouts(options);
    for (let i = 0; i < layouts.plugins?.length;i++){
      layouts.plugins[i] = layouts.plugins[i].configuration(options,true)
    }
    return layouts;
  }

  static modify(fn) {
    return DDeiCoreLayouts.defaultIns.modify(fn)
  }
}

export { DDeiCoreLayouts, DDeiCoreStandLayout, DDeiCoreSimpleLayout, DDeiCoreMobileLayout }
export default DDeiCoreLayouts