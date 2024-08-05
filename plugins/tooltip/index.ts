import { DDeiPluginBase } from "ddei-framework";
import DDeiCoreTooltipDialog from "./tooltipdialog"
import DDeiExtTooltipLifeCycle from "./tooltip-lifecycle"

class DDeiExtTooltip extends DDeiPluginBase {
  type: string = "package"

  /**
   * 缺省实例
   */
  static defaultIns: DDeiExtTooltip = new DDeiExtTooltip(null);

  dialogs: object = DDeiCoreTooltipDialog;

  lifecyclies: object = DDeiExtTooltipLifeCycle;

  getOptions(): object {
    return this.options;
  }

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
    let core = new DDeiExtTooltip(options);
    core.dialogs = core.dialogs.configuration(options,true)
    core.lifecyclies = core.lifecyclies.configuration(options,true)
    return core;
  }
}

export { DDeiExtTooltip }
export * from "./tooltipdialog"
export * from "./tooltip-lifecycle"
export default DDeiExtTooltip;