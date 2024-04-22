import {DDeiPluginBase} from "ddei-framework1";
import DDeiCoreAlignDialog from "./aligndialog"
import DDeiCoreCanvasQuickDialog from "./canvasquickdialog"
import DDeiCoreChangeRatioDialog from "./changeratiodialog"
import DDeiCoreChooseControlGroupDialog from "./choosecontrolgroupdialog"
import DDeiCoreCloseFileConfirmDialog from "./closefileconfirmdialog"
import DDeiCoreCollFileConfirmDialog from "./collfileconfirmdialog"
import DDeiCoreCreateShareDialog from "./createsharedialog"
import DDeiCoreExportOptionDialog from "./exportoptiondialog"
import DDeiCoreLinePointTypeDialog from "./linepointtypedialog"
import DDeiCoreLineTypeDialog from "./linetypedialog"
import DDeiCoreManageLayersDialog from "./managelayersdialog"
import DDeiCoreMergeComposeDialog from "./mergecomposedialog"
import DDeiCorePositionDialog from "./positiondialog"
import DDeiCorePublishFileConfirmDialog from "./publishfileconfirmdialog"
import DDeiCoreQCViewDialog from "./qcviewdialog"
import DDeiCoreQuickSetStyleDialog from "./quicksetstyledialog"
import DDeiCoreReLoginDialog from "./relogindialog"
import DDeiCoreRotateDialog from "./rotatedialog"
import DDeiCoreSelectBorderDashDialog from "./selectborderdashdialog"
import DDeiCoreSelectBorderWeightDialog from "./selectborderweightdialog"
import DDeiCoreSelectColorDialog from "./selectcolordialog"
import DDeiCoreSelectFontDialog from "./selectfontdialog"
import DDeiCoreSelectFontSizeDialog from "./selectfontsizedialog"
import DDeiCoreTextAlignDialog from "./textaligndialog"
import DDeiCoreUserRegistryDialog from "./userregistrydialog"

class DDeiCoreDialogs extends DDeiPluginBase {

  type: string = "package"
  /**
   * 缺省实例
   */
  static defaultIns: DDeiCoreDialogs = new DDeiCoreDialogs(null);

  plugins: object[] = [DDeiCoreAlignDialog, DDeiCoreCanvasQuickDialog, DDeiCoreChangeRatioDialog,
    DDeiCoreChooseControlGroupDialog, DDeiCoreCloseFileConfirmDialog, DDeiCoreCollFileConfirmDialog,
    DDeiCoreCreateShareDialog, DDeiCoreExportOptionDialog, DDeiCoreLinePointTypeDialog,
    DDeiCoreLineTypeDialog, DDeiCoreManageLayersDialog, DDeiCoreMergeComposeDialog, DDeiCorePositionDialog,
    DDeiCorePublishFileConfirmDialog, DDeiCoreQCViewDialog, DDeiCoreQuickSetStyleDialog, DDeiCoreReLoginDialog,
    DDeiCoreRotateDialog, DDeiCoreSelectBorderDashDialog, DDeiCoreSelectBorderWeightDialog, DDeiCoreSelectColorDialog,
    DDeiCoreSelectFontDialog, DDeiCoreSelectFontSizeDialog, DDeiCoreTextAlignDialog, DDeiCoreUserRegistryDialog
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



  static configuraton(options) {
    if (options) {
      //解析options，只使用自己相关的
      let panels = new DDeiCoreDialogs(options);
      for (let i = 0; i < panels.plugins?.length; i++) {
        panels.plugins[i] = panels.plugins[i].configuraton(options, true)
      }
      return panels;
    }
    return DDeiCoreDialogs;
  }
}


export {DDeiCoreDialogs,DDeiCoreAlignDialog, DDeiCoreCanvasQuickDialog, DDeiCoreChangeRatioDialog,
  DDeiCoreChooseControlGroupDialog, DDeiCoreCloseFileConfirmDialog, DDeiCoreCollFileConfirmDialog,
  DDeiCoreCreateShareDialog, DDeiCoreExportOptionDialog, DDeiCoreLinePointTypeDialog,
  DDeiCoreLineTypeDialog, DDeiCoreManageLayersDialog, DDeiCoreMergeComposeDialog, DDeiCorePositionDialog,
  DDeiCorePublishFileConfirmDialog, DDeiCoreQCViewDialog, DDeiCoreQuickSetStyleDialog, DDeiCoreReLoginDialog,
  DDeiCoreRotateDialog, DDeiCoreSelectBorderDashDialog, DDeiCoreSelectBorderWeightDialog, DDeiCoreSelectColorDialog,
  DDeiCoreSelectFontDialog, DDeiCoreSelectFontSizeDialog, DDeiCoreTextAlignDialog, DDeiCoreUserRegistryDialog
}
export default DDeiCoreDialogs