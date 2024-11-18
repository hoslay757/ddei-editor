import { DDeiPluginBase } from "ddei-framework";
import DDeiKeyActionQuickControlEsc from "./key-action-quickcontrol-esc"

/**
 * 快捷键扩展
 */
class DDeiExtQuickControlHotkeys extends DDeiPluginBase {

  type: string = "package"
  /**
   * 缺省实例
   */
  static defaultIns: DDeiExtQuickControlHotkeys = new DDeiExtQuickControlHotkeys(null);


  plugins: object[] = [DDeiKeyActionQuickControlEsc]


  getHotKeys(editor) {
    let hotkeys = []
    this.plugins?.forEach(plugin => {
      let ls
      if (DDeiPluginBase.isSubclass(plugin, DDeiPluginBase)) {
        ls = plugin.defaultIns.getHotKeys(editor);
      } else if (plugin instanceof DDeiPluginBase) {
        ls = plugin.getHotKeys(editor);
      }

      if (ls?.length > 0) {
        hotkeys = hotkeys.concat(ls);
      }
    })
    return hotkeys
  }


  static configuration(options) {
    let hotkeys = new DDeiExtQuickControlHotkeys(options);
    for (let i = 0; i < hotkeys.plugins?.length; i++) {
      hotkeys.plugins[i] = hotkeys.plugins[i].configuration(options, true)
    }
    return hotkeys;
  }

  static modify(fn) {
    return DDeiExtQuickControlHotkeys.defaultIns.modify(fn)
  }
}
export {
  DDeiExtQuickControlHotkeys, DDeiKeyActionQuickControlEsc
}
export default DDeiExtQuickControlHotkeys