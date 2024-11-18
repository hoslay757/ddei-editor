import {DDeiPluginBase} from "ddei-framework";
import DDeiCoreLifeCycle from "./core-lifecycle"

class DDeiCoreLifeCycles extends DDeiPluginBase {
  type: string = "package"

  
  /**
   * 缺省实例
   */
  static defaultIns: DDeiCoreLifeCycles = new DDeiCoreLifeCycles(null);

  lifecyclies: object = DDeiCoreLifeCycle;


  getLifeCyclies(editor) {
    if (DDeiPluginBase.isSubclass(this.lifecyclies, DDeiPluginBase)) {
      return this.lifecyclies.defaultIns.getLifeCyclies(editor);
    } else if (this.lifecyclies instanceof DDeiPluginBase) {
      return this.lifecyclies.getLifeCyclies(editor);
    }
  }


  static configuration(options) {
    let core = new DDeiCoreLifeCycles(options);
    core.lifecyclies = core.lifecyclies.configuration(options, true)
    return core;
  }

  static modify(fn) {
    return DDeiCoreLifeCycles.defaultIns.modify(fn)
  }
}

export {DDeiCoreLifeCycles}
export * from "./core-lifecycle"
export default DDeiCoreLifeCycles;