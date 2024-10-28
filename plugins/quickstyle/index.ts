import {DDeiPluginBase} from "ddei-framework";
import CanvasQuickDialog from "./canvasquickdialog"
import DDeiCoreCanvasLifeCycle from "./quickstyle-lifecycle"

class DDeiExtQuickStyle extends DDeiPluginBase {
  type: string = "package"

  order: number = 2

  static order: number = 2
  
  /**
   * 缺省实例
   */
  static defaultIns: DDeiExtQuickStyle = new DDeiExtQuickStyle(null);

  dialogs: object = CanvasQuickDialog;

  lifecyclies: object = DDeiCoreCanvasLifeCycle;

  getDialogs(editor) {
    if (DDeiPluginBase.isSubclass(this.dialogs, DDeiPluginBase)) {
      return this.dialogs.defaultIns.getDialogs(editor);
    } else if (this.dialogs instanceof DDeiPluginBase) {
      return this.dialogs.getDialogs(editor);
    }
  }

  getLifeCyclies(editor) {
    if (DDeiPluginBase.isSubclass(this.lifecyclies, DDeiPluginBase)) {
      return this.lifecyclies.defaultIns.getLifeCyclies(editor);
    } else if (this.lifecyclies instanceof DDeiPluginBase) {
      return this.lifecyclies.getLifeCyclies(editor);
    }
  }


  static configuration(options) {
    let core = new DDeiExtQuickStyle(options);
    core.dialogs = core.dialogs.configuration(options, true)
    core.lifecyclies = core.lifecyclies.configuration(options, true)
    return core;
  }
}

export {DDeiExtQuickStyle}
export * from "./canvasquickdialog"
export * from "./quickstyle-lifecycle"
export default DDeiExtQuickStyle;