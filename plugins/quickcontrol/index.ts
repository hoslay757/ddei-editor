import {DDeiPluginBase} from "ddei-framework";
import DDeiExtQuickControlDialogs from "./dialogs"
import QuickControlPanel from "./quickcontrolpanel"
import DDeiExtQuickControlHotkeys from "./hotkeys"
import DDeiExtQuickControlLifeCycle from "./quickcontrol-lifecycle"

class DDeiExtQuickControl extends DDeiPluginBase {
  type: string = "package"

  
  /**
   * 缺省实例
   */
  static defaultIns: DDeiExtQuickControl = new DDeiExtQuickControl(null);

  dialogs: object = DDeiExtQuickControlDialogs;

  panels: object = QuickControlPanel;

  hotkeys: object = DDeiExtQuickControlHotkeys;

  lifecyclies: object = DDeiExtQuickControlLifeCycle;

  getDialogs(editor) {
    if (DDeiPluginBase.isSubclass(this.dialogs, DDeiPluginBase)) {
      return this.dialogs.defaultIns.getDialogs(editor);
    } else if (this.dialogs instanceof DDeiPluginBase) {
      return this.dialogs.getDialogs(editor);
    }
  }

  getPanels(editor) {
    if (DDeiPluginBase.isSubclass(this.panels, DDeiPluginBase)) {
      return this.panels.defaultIns.getPanels(editor);
    } else if (this.panels instanceof DDeiPluginBase) {
      return this.panels.getPanels(editor);
    }
  }

  getHotKeys(editor) {
    if (DDeiPluginBase.isSubclass(this.hotkeys, DDeiPluginBase)) {
      return this.hotkeys.defaultIns.getHotKeys(editor);
    } else if (this.hotkeys instanceof DDeiPluginBase) {
      return this.hotkeys.getHotKeys(editor);
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
    let core = new DDeiExtQuickControl(options);
    core.dialogs = core.dialogs.configuration(options, true)
    core.panels = core.panels.configuration(options, true)
    core.hotkeys = core.hotkeys.configuration(options, true)
    core.lifecyclies = core.lifecyclies.configuration(options, true)
    return core;
  }
}

export {DDeiExtQuickControl}
export default DDeiExtQuickControl;