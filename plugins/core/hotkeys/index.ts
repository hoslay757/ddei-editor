import {DDeiPluginBase} from "ddei-framework1";
import DDeiKeyActionAllSelect from "./actions/key-action-all-select"
import DDeiKeyActionBrushData from "./actions/key-action-brushdata"
import DDeiKeyActionCancelCompose from "./actions/key-action-cancel-compose"
import DDeiKeyActionCancelControlCreate from "./actions/key-action-cancel-control-create"
import DDeiKeyActionCancelCurrentAction from "./actions/key-action-cancel-current-action"
import DDeiKeyActionCancelQuickEdit from "./actions/key-action-cancel-quick-edit"
import DDeiKeyActionCancelSelect from "./actions/key-action-cancel-select"
import DDeiKeyActionClearBrushData from "./actions/key-action-clear-brushdata"
import DDeiKeyActionCloseDialog from "./actions/key-action-close-dialog"
import DDeiKeyActionCompose from "./actions/key-action-compose"
import DDeiKeyActionCopy from "./actions/key-action-copy"
import DDeiKeyActionCopyImage from "./actions/key-action-copy-image"
import DDeiKeyActionCut from "./actions/key-action-cut"
import DDeiKeyActionEnterQuickEdit from "./actions/key-action-enter-quick-edit"
import DDeiKeyActionMoveModels from "./actions/key-action-move-models"
import DDeiKeyActionPaste from "./actions/key-action-paste"
import DDeiKeyActionPushModels from "./actions/key-action-push-models"
import DDeiKeyActionNewRowQuickEdit from "./actions/key-action-quick-editor-newrow"
import DDeiKeyActionRemoveModels from "./actions/key-action-remove-models"
import DDeiKeyActionReRevoke from "./actions/key-action-rerevoke"
import DDeiKeyActionRevoke from "./actions/key-action-revoke"
import DDeiKeyActionSaveFile from "./actions/key-action-save-file"
import DDeiKeyActionStartQuickEdit from "./actions/key-action-start-quick-edit"
import DDeiKeyActionTableNextCol from "./actions/key-action-table-next-col"
import DDeiKeyActionTableNextRow from "./actions/key-action-table-next-row"

/**
 * 快捷键扩展
 */
class DDeiCoreHotkeys extends DDeiPluginBase{

  type: string = "package"
  /**
   * 缺省实例
   */
  static defaultIns:DDeiCoreHotkeys = new DDeiCoreHotkeys(null);


  plugins: object[] = [DDeiKeyActionAllSelect, DDeiKeyActionBrushData, DDeiKeyActionCancelCompose, DDeiKeyActionCancelControlCreate,
    DDeiKeyActionCancelCurrentAction, DDeiKeyActionCancelQuickEdit, DDeiKeyActionCancelSelect,
    DDeiKeyActionClearBrushData, DDeiKeyActionCloseDialog, DDeiKeyActionCompose,
    DDeiKeyActionCopy, DDeiKeyActionCopyImage, DDeiKeyActionCut,
    DDeiKeyActionEnterQuickEdit, DDeiKeyActionMoveModels, DDeiKeyActionReRevoke,
    DDeiKeyActionRevoke, DDeiKeyActionSaveFile, DDeiKeyActionStartQuickEdit,
    DDeiKeyActionTableNextCol, DDeiKeyActionTableNextRow, DDeiKeyActionPaste,
    DDeiKeyActionPushModels, DDeiKeyActionNewRowQuickEdit, DDeiKeyActionRemoveModels
  ]


  getHotKeys(editor){
    let hotkeys = []
    this.plugins?.forEach(plugin=>{
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


  static configuraton(options) {
    let hotkeys = new DDeiCoreHotkeys(options);
    for (let i = 0; i < hotkeys.plugins?.length;i++){
      hotkeys.plugins[i] = hotkeys.plugins[i].configuraton(options,true)
    }
    return hotkeys;
  }
}
export {
  DDeiCoreHotkeys, DDeiKeyActionAllSelect, DDeiKeyActionBrushData, DDeiKeyActionCancelCompose, DDeiKeyActionCancelControlCreate,
  DDeiKeyActionCancelCurrentAction, DDeiKeyActionCancelQuickEdit, DDeiKeyActionCancelSelect,
  DDeiKeyActionClearBrushData, DDeiKeyActionCloseDialog, DDeiKeyActionCompose,
  DDeiKeyActionCopy, DDeiKeyActionCopyImage, DDeiKeyActionCut,
  DDeiKeyActionEnterQuickEdit, DDeiKeyActionMoveModels, DDeiKeyActionReRevoke,
  DDeiKeyActionRevoke, DDeiKeyActionSaveFile, DDeiKeyActionStartQuickEdit,
  DDeiKeyActionTableNextCol, DDeiKeyActionTableNextRow, DDeiKeyActionPaste,
  DDeiKeyActionPushModels, DDeiKeyActionNewRowQuickEdit, DDeiKeyActionRemoveModels
}
export default DDeiCoreHotkeys