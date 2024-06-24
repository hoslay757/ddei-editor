import { DDeiPluginBase } from "ddei-framework";
import DDeiKeyActionSearch from "./key-action-search"
import DDeiKeyActionSearchUp from "./key-action-search-up"
import DDeiKeyActionSearchNext from "./key-action-search-next"
import DDeiKeyActionSearchEsc from "./key-action-search-esc"

/**
 * 快捷键扩展
 */
class DDeiExtSearchHotkeys extends DDeiPluginBase {

  type: string = "package"
  /**
   * 缺省实例
   */
  static defaultIns: DDeiExtSearchHotkeys = new DDeiExtSearchHotkeys(null);


  plugins: object[] = [DDeiKeyActionSearch, DDeiKeyActionSearchUp, DDeiKeyActionSearchNext, DDeiKeyActionSearchEsc]


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
    let hotkeys = new DDeiExtSearchHotkeys(options);
    for (let i = 0; i < hotkeys.plugins?.length; i++) {
      hotkeys.plugins[i] = hotkeys.plugins[i].configuration(options, true)
    }
    return hotkeys;
  }
}
export {
  DDeiExtSearchHotkeys, DDeiKeyActionSearch, DDeiKeyActionSearchUp, DDeiKeyActionSearchNext, DDeiKeyActionSearchEsc
}
export default DDeiExtSearchHotkeys