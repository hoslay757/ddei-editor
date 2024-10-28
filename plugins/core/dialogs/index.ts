import {DDeiPluginBase} from "ddei-framework";
import DDeiCoreAlignDialog from "./aligndialog"
import DDeiCoreChangeRatioDialog from "./changeratiodialog"
import DDeiCoreChooseControlGroupDialog from "./choosecontrolgroupdialog"
import DDeiCoreCloseFileConfirmDialog from "./closefileconfirmdialog"
import DDeiCoreCollFileConfirmDialog from "./collfileconfirmdialog"
import DDeiCoreLinePointTypeDialog from "./linepointtypedialog"
import DDeiCoreLineTypeDialog from "./linetypedialog"
import DDeiCoreManageLayersDialog from "./managelayersdialog"
import DDeiCoreMergeComposeDialog from "./mergecomposedialog"
import DDeiCorePositionDialog from "./positiondialog"
import DDeiCorePublishFileConfirmDialog from "./publishfileconfirmdialog"
import DDeiCoreQCViewDialog from "./qcviewdialog"
import DDeiCoreQuickSetStyleDialog from "./quicksetstyledialog"
import DDeiCoreRotateDialog from "./rotatedialog"
import DDeiCoreSelectBorderDashDialog from "./selectborderdashdialog"
import DDeiCoreSelectBorderWeightDialog from "./selectborderweightdialog"
import DDeiCoreSelectColorDialog from "./selectcolordialog"
import DDeiCoreSelectFontDialog from "./selectfontdialog"
import DDeiCoreSelectFontSizeDialog from "./selectfontsizedialog"
import DDeiCoreTextAlignDialog from "./textaligndialog"
import DDeiCoreChooseControlDialog from "./choosecontroldialog"

class DDeiCoreDialogs extends DDeiPluginBase {

  type: string = "package"
  /**
   * 缺省实例
   */
  static defaultIns: DDeiCoreDialogs = new DDeiCoreDialogs(null);

  plugins: object[] = [DDeiCoreAlignDialog, DDeiCoreChangeRatioDialog,
    DDeiCoreChooseControlGroupDialog, DDeiCoreCloseFileConfirmDialog, DDeiCoreCollFileConfirmDialog,
    DDeiCoreLinePointTypeDialog,
    DDeiCoreLineTypeDialog, DDeiCoreManageLayersDialog, DDeiCoreMergeComposeDialog, DDeiCorePositionDialog,
    DDeiCorePublishFileConfirmDialog, DDeiCoreQCViewDialog, DDeiCoreQuickSetStyleDialog,
    DDeiCoreRotateDialog, DDeiCoreSelectBorderDashDialog, DDeiCoreSelectBorderWeightDialog, DDeiCoreSelectColorDialog,
    DDeiCoreSelectFontDialog, DDeiCoreSelectFontSizeDialog, DDeiCoreTextAlignDialog, DDeiCoreChooseControlDialog
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
      let panels = new DDeiCoreDialogs(options);
      for (let i = 0; i < panels.plugins?.length; i++) {
        panels.plugins[i] = panels.plugins[i].configuration(options, true)
      }
      return panels;
    }
    return DDeiCoreDialogs;
  }
}


export {DDeiCoreDialogs,DDeiCoreAlignDialog, DDeiCoreChangeRatioDialog,
  DDeiCoreChooseControlGroupDialog, DDeiCoreCloseFileConfirmDialog, DDeiCoreCollFileConfirmDialog,
    DDeiCoreLinePointTypeDialog,
  DDeiCoreLineTypeDialog, DDeiCoreManageLayersDialog, DDeiCoreMergeComposeDialog, DDeiCorePositionDialog,
  DDeiCorePublishFileConfirmDialog, DDeiCoreQCViewDialog, DDeiCoreQuickSetStyleDialog,
  DDeiCoreRotateDialog, DDeiCoreSelectBorderDashDialog, DDeiCoreSelectBorderWeightDialog, DDeiCoreSelectColorDialog,
  DDeiCoreSelectFontDialog, DDeiCoreSelectFontSizeDialog, DDeiCoreTextAlignDialog, DDeiCoreChooseControlDialog
}
export default DDeiCoreDialogs