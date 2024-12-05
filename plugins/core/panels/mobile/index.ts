import { DDeiPluginBase } from "ddei-framework";
import DDeiCorePropertyViewMobilePanel from './propertyview-mobile';

class DDeiCoreMobilePanels extends DDeiPluginBase {


  type: string = "package"
  /**
   * 缺省实例
   */
  static defaultIns: DDeiCoreMobilePanels = new DDeiCoreMobilePanels(null);

  plugins: object[] = [DDeiCorePropertyViewMobilePanel]

  getPanels(editor) {
    let panels = []
    this.plugins?.forEach(plugin => {
      let ls
      if (DDeiPluginBase.isSubclass(plugin, DDeiPluginBase)) {
        ls = plugin.defaultIns.getPanels(editor);
      } else if (plugin instanceof DDeiPluginBase) {
        ls = plugin.getPanels(editor);
      }
      if (ls?.length > 0) {
        panels = panels.concat(ls);
      }
    })
    return panels
  }



  static configuration(options) {
    if (options) {
      //解析options，只使用自己相关的
      let panels = new DDeiCoreMobilePanels(options);
      for (let i = 0; i < panels.plugins?.length; i++) {
        panels.plugins[i] = panels.plugins[i].configuration(options, true)
      }
      return panels;
    }
    return DDeiCoreMobilePanels;
  }

  static modify(fn) {
    return DDeiCoreMobilePanels.defaultIns.modify(fn)
  }
}


export {
  DDeiCoreMobilePanels, DDeiCorePropertyViewMobilePanel
}
export default DDeiCoreMobilePanels