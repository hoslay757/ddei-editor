import DDeiExtUMLControls from "./controls";
import {DDeiPluginBase} from "ddei-framework1";

class DDeiExtUML extends DDeiPluginBase {
  type: string = "package"

  
  /**
   * 缺省实例
   */
  static defaultIns: DDeiExtUML = new DDeiExtUML(null);

  controls: object = DDeiExtUMLControls;

  getOptions(): object {
    let options = {}
    let array = [this.controls]
    array.forEach(plugin => {
      if (DDeiPluginBase.isSubclass(plugin, DDeiPluginBase)) {
        options = Object.assign({}, options, plugin.defaultIns.getOptions())
      } else if (plugin instanceof DDeiPluginBase) {
        options = Object.assign({}, options, plugin.getOptions())
      }
    });
    return options;
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

  static configuraton(options) {
    let core = new DDeiExtUML(options);
    core.controls = core.controls.configuraton(controls, true)
    return core;
  }
}
export {DDeiExtUML}
export default DDeiExtUML;