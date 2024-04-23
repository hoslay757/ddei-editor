import {DDeiPluginBase} from "ddei-framework";
import MenuCancelMergeCell from "./menu-cancel-merge-cell"
import MenuCopySheet from "./menu-copy-sheet"
import MenuInsertCol from "./menu-insert-col"
import MenuInsertRow from "./menu-insert-row"
import MenuMergeCell from "./menu-merge-cell"
import MenuRemoveCol from "./menu-remove-col"
import MenuRemoveRow from "./menu-remove-row"
import MenuRemoveSheet from "./menu-remove-sheet"


/**
 * 快捷键扩展
 */
class DDeiCoreMenus extends DDeiPluginBase{

  type: string = "package"
  /**
   * 缺省实例
   */
  static defaultIns:DDeiCoreMenus = new DDeiCoreMenus(null);


  plugins: object[] = [MenuCancelMergeCell, MenuCopySheet, MenuInsertCol, MenuInsertRow,
    MenuMergeCell, MenuRemoveCol, MenuRemoveRow, MenuRemoveSheet]


  getMenus(editor){
    let menus = []
    this.plugins?.forEach(plugin=>{
      let ls
      if (DDeiPluginBase.isSubclass(plugin, DDeiPluginBase)) {
        ls = plugin.defaultIns.getMenus(editor);
      } else if (plugin instanceof DDeiPluginBase) {
        ls = plugin.getMenus(editor);
      }

      if (ls?.length > 0) {
        menus = menus.concat(ls);
      }
    })
    return menus
  }


  static configuraton(options) {
    let menus = new DDeiCoreMenus(options);
    for (let i = 0; i < menus.plugins?.length;i++){
      menus.plugins[i] = menus.plugins[i].configuraton(options,true)
    }
    return menus;
  }
}
export {
  DDeiCoreMenus, MenuCancelMergeCell, MenuCopySheet, MenuInsertCol, MenuInsertRow,
  MenuMergeCell, MenuRemoveCol, MenuRemoveRow, MenuRemoveSheet
}
export default DDeiCoreMenus