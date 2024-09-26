import { DDeiPluginBase } from "ddei-framework";
import DDeiCoreToolboxPanel from './toolbox';
import DDeiCoreToolboxSimplePanel from './toolbox-simple';

class DDeiCoreToolboxPanels extends DDeiPluginBase {


  type: string = "package"
  /**
   * 缺省实例
   */
  static defaultIns: DDeiCoreToolboxPanels = new DDeiCoreToolboxPanels(null);

  plugins: object[] = [DDeiCoreToolboxPanel, DDeiCoreToolboxSimplePanel]

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
      let panels = new DDeiCoreToolboxPanels(options);
      for (let i = 0; i < panels.plugins?.length; i++) {
        panels.plugins[i] = panels.plugins[i].configuration(options, true)
      }
      return panels;
    }
    return DDeiCoreToolboxPanels;
  }
}


export {
  DDeiCoreToolboxPanels, DDeiCoreToolboxPanel, DDeiCoreToolboxSimplePanel
}
export default DDeiCoreToolboxPanels