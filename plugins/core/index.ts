import DDeiCorePanels from "./panels"
import DDeiCoreComponents from "./components"
import DDeiCoreLayouts from "./layouts";
import DDeiCoreDialogs from "./dialogs";
import DDeiCorePropEditors from "./propeditors";
import DDeiCoreHotkeys from "./hotkeys";
import DDeiCoreControls from "./controls";
import DDeiCoreMenus from "./menus";
import DDeiCoreThemes from "./themes"
import DDeiCoreLifeCycles from "./lifecycles"
import {DDeiPluginBase} from "ddei-framework";

class DDeiCore extends DDeiPluginBase {
  type: string = "package"

  order:number = 0

  static order: number = 0

  
  /**
   * 缺省实例
   */
  static defaultIns: DDeiCore = new DDeiCore(null);


  layouts: object = DDeiCoreLayouts;

  panels: object = DDeiCorePanels;

  components: object = DDeiCoreComponents;

  dialogs:object = DDeiCoreDialogs;

  propeditors: object = DDeiCorePropEditors;

  hotkeys: object = DDeiCoreHotkeys;

  controls: object = DDeiCoreControls;

  menus: object = DDeiCoreMenus;

  themes: object = DDeiCoreThemes;

  lifecycles: object = DDeiCoreLifeCycles

  getOptions(): object {
    let options = {}
    let array = [this.layouts, this.panels, this.propeditors, this.dialogs, this.components, this.hotkeys, this.controls, this.menus, this.themes, this.lifecycles]
    array.forEach(plugin => {
      if (DDeiPluginBase.isSubclass(plugin, DDeiPluginBase)) {
        options = Object.assign({}, options, plugin.defaultIns.getOptions())
      } else if (plugin instanceof DDeiPluginBase) {
        options = Object.assign({}, options, plugin.getOptions())
      }
    });
    return options;
  }

  getComponents(editor) {
    if (DDeiPluginBase.isSubclass(this.components, DDeiPluginBase)) {
      return this.components.defaultIns.getComponents(editor);
    } else if (this.components instanceof DDeiPluginBase) {
      return this.components.getComponents(editor);
    }
  }

  getPanels(editor) {
    if (DDeiPluginBase.isSubclass(this.panels, DDeiPluginBase)) {
      return this.panels.defaultIns.getPanels(editor);
    } else if (this.panels instanceof DDeiPluginBase) {
      return this.panels.getPanels(editor);
    }
  }

  getLayouts(editor) {
    if (DDeiPluginBase.isSubclass(this.layouts, DDeiPluginBase)) {
      return this.layouts.defaultIns.getLayouts(editor);
    } else if (this.layouts instanceof DDeiPluginBase) {
      return this.layouts.getLayouts(editor);
    }
  }

  getLifeCyclies(editor) {
    if (DDeiPluginBase.isSubclass(this.lifecycles, DDeiPluginBase)) {
      return this.lifecycles.defaultIns.getLifeCyclies(editor);
    } else if (this.lifecycles instanceof DDeiPluginBase) {
      return this.lifecycles.getLifeCyclies(editor);
    }
  }



  getDialogs(editor){
    if (DDeiPluginBase.isSubclass(this.dialogs, DDeiPluginBase)) {
      return this.dialogs.defaultIns.getDialogs(editor);
    } else if (this.dialogs instanceof DDeiPluginBase) {
      return this.dialogs.getDialogs(editor);
    }
  }

  getPropEditors(editor) {
    if (DDeiPluginBase.isSubclass(this.propeditors, DDeiPluginBase)) {
      return this.propeditors.defaultIns.getPropEditors(editor);
    } else if (this.propeditors instanceof DDeiPluginBase) {
      return this.propeditors.getPropEditors(editor);
    }
  }

  getHotKeys(editor) {
    if (DDeiPluginBase.isSubclass(this.hotkeys, DDeiPluginBase)) {
      return this.hotkeys.defaultIns.getHotKeys(editor);
    } else if (this.hotkeys instanceof DDeiPluginBase) {
      return this.hotkeys.getHotKeys(editor);
    }
  }

  getControls(editor) {
    if (DDeiPluginBase.isSubclass(this.controls, DDeiPluginBase)) {
      return this.controls.defaultIns.getControls(editor);
    } else if (this.controls instanceof DDeiPluginBase) {
      return this.controls.getControls(editor);
    }
  }

  getGroups(editor) {
    if (DDeiPluginBase.isSubclass(this.controls, DDeiPluginBase)) {
      return this.controls.defaultIns.getGroups(editor);
    } else if (this.controls instanceof DDeiPluginBase) {
      return this.controls.getGroups(editor);
    }
  }

  getMenus(editor) {
    if (DDeiPluginBase.isSubclass(this.menus, DDeiPluginBase)) {
      return this.menus.defaultIns.getMenus(editor);
    } else if (this.menus instanceof DDeiPluginBase) {
      return this.menus.getMenus(editor);
    }
  }

  getThemes(editor) {
    if (DDeiPluginBase.isSubclass(this.themes, DDeiPluginBase)) {
      return this.themes.defaultIns.getThemes(editor);
    } else if (this.themes instanceof DDeiPluginBase) {
      return this.themes.getThemes(editor);
    }
  }

  static configuration(options) {
    let core = new DDeiCore(options);
    core.layouts = core.layouts.configuration(options,true)
    core.panels = core.panels.configuration(options,true)
    core.components = core.components.configuration(options, true)
    core.dialogs = core.dialogs.configuration(options, true)
    core.propeditors = core.propeditors.configuration(options, true)
    core.hotkeys = core.hotkeys.configuration(options, true)
    core.controls = core.controls.configuration(options, true)
    core.menus = core.menus.configuration(options, true)
    core.themes = core.themes.configuration(options, true)
    core.lifecycles = core.lifecycles.configuration(options, true)
    return core;
  }
}

export * from "./panels"
export * from "./components"
export * from "./layouts";
export * from "./dialogs";
export * from "./propeditors";
export * from "./hotkeys";
export * from "./menus"
export * from "./controls"
export * from "./themes"
export * from "./lifecycles"
export {DDeiCore}
export default DDeiCore;