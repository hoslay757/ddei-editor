import {DDeiPluginBase} from "ddei-framework1";
import DDeiCoreStandLayout from "./stand-layout";



class DDeiCoreLayouts extends DDeiPluginBase{

  type: string = "package"
  /**
   * 缺省实例
   */
  static defaultIns:DDeiCoreLayouts = new DDeiCoreLayouts(null);


  plugins: object[] = [DDeiCoreStandLayout]


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


  static configuraton(options) {
    let layouts = new DDeiCoreLayouts(options);
    for (let i = 0; i < layouts.plugins?.length;i++){
      layouts.plugins[i] = layouts.plugins[i].configuraton(options,true)
    }
    return layouts;
  }
}

export {DDeiCoreLayouts,DDeiCoreStandLayout}
export default DDeiCoreLayouts