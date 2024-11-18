import { DDeiPluginBase } from "ddei-framework";
import QuickControlDialog from "./quickcontroldialog"
import QuickChooseControlDialog from "./quickchoosecontroldialog"

class DDeiExtQuickControlDialogs extends DDeiPluginBase {

  type: string = "package"
  /**
   * 缺省实例
   */
  static defaultIns: DDeiExtQuickControlDialogs = new DDeiExtQuickControlDialogs(null);

  plugins: object[] = [QuickControlDialog, QuickChooseControlDialog
  ]

  getDialogs(editor) {
    let panels = []
    this.plugins?.forEach(plugin => {
      let ls
      if (DDeiPluginBase.isSubclass(plugin, DDeiPluginBase)) {
        ls = plugin.defaultIns.getDialogs(editor);
      } else if (plugin instanceof DDeiPluginBase) {
        ls = plugin.getDialogs(editor);
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
      let panels = new DDeiExtQuickControlDialogs(options);
      for (let i = 0; i < panels.plugins?.length; i++) {
        panels.plugins[i] = panels.plugins[i].configuration(options, true)
      }
      return panels;
    }
    return DDeiExtQuickControlDialogs;
  }

  static modify(fn) {
    return DDeiExtQuickControlDialogs.defaultIns.modify(fn)
  }
}


export {
  DDeiExtQuickControlDialogs, QuickControlDialog, QuickChooseControlDialog
}
export default DDeiExtQuickControlDialogs