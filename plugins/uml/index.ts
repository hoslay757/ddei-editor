import DDeiExtUMLControls from "./controls";
import {DDeiPluginBase} from "ddei-framework";

class DDeiExtUML extends DDeiPluginBase {
  type: string = "package"

  order: number = 1

  static order: number = 1
  
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

  getLangs(editor) {
    const langModules = import.meta.glob('./i18n/*', { eager: true });
    let langs = {}
    for (let i in langModules) {
      let langModule = langModules[i];
      let newI = i.substring(i.lastIndexOf('/') + 1, i.lastIndexOf('.'))
      langs[newI] = langModule.default
    }
    return langs;
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

  static modify(fn) {
    return DDeiExtUML.defaultIns.modify(fn)
  }

  static configuration(options) {
    let core = new DDeiExtUML(options);
    core.controls = core.controls.configuration(controls, true)
    return core;
  }
}
export {DDeiExtUML}
export default DDeiExtUML;