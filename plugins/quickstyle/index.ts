import {DDeiPluginBase} from "ddei-framework";
import CanvasQuickDialog from "./canvasquickdialog"
import DDeiCoreCanvasLifeCycle from "./quickstyle-lifecycle"

class DDeiExtQuickStyle extends DDeiPluginBase {
  type: string = "package"

  
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


  static configuraton(options) {
    let core = new DDeiExtQuickStyle(options);
    core.dialogs = core.dialogs.configuraton(options, true)
    core.lifecyclies = core.lifecyclies.configuraton(options, true)
    return core;
  }
}

export {DDeiExtQuickStyle}
export default DDeiExtQuickStyle;