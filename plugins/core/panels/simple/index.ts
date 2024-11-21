import { DDeiPluginBase } from "ddei-framework";
import DDeiCoreToolboxSimplePanel from './toolbox-simple';
import DDeiCoreTopMenuSimplePanel from './topmenu-simple';

class DDeiCoreSimplePanels extends DDeiPluginBase {


  type: string = "package"
  /**
   * 缺省实例
   */
  static defaultIns: DDeiCoreSimplePanels = new DDeiCoreSimplePanels(null);

  plugins: object[] = [DDeiCoreToolboxSimplePanel, DDeiCoreTopMenuSimplePanel]

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
      let panels = new DDeiCoreSimplePanels(options);
      for (let i = 0; i < panels.plugins?.length; i++) {
        panels.plugins[i] = panels.plugins[i].configuration(options, true)
      }
      return panels;
    }
    return DDeiCoreSimplePanels;
  }

  static modify(fn) {
    return DDeiCoreSimplePanels.defaultIns.modify(fn)
  }
}


export {
  DDeiCoreSimplePanels, DDeiCoreToolboxSimplePanel, DDeiCoreTopMenuSimplePanel
}
export default DDeiCoreSimplePanels