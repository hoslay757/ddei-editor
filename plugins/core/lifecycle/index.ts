import { DDeiPluginBase, DDeiEditor } from "ddei-framework";
import DDeiCoreRenderLifeCycle from "./render-lifecycle"

class DDeiCoreLifeCycle extends DDeiPluginBase {
  type: string = "package"


  /**
   * 缺省实例
   */
  static defaultIns: DDeiCoreLifeCycle = new DDeiCoreLifeCycle(null);


  lifecycles: object = DDeiCoreRenderLifeCycle;

  getLifeCyclies(editor:DDeiEditor) {
    if (DDeiPluginBase.isSubclass(this.lifecycles, DDeiPluginBase)) {
      return this.lifecycles.defaultIns.getLifeCyclies(editor);
    } else if (this.lifecycles instanceof DDeiPluginBase) {
      return this.lifecycles.getLifeCyclies(editor);
    }
  }


  static configuration(options) {
    let core = new DDeiCoreLifeCycle(options);
    core.lifecycles = core.lifecycles.configuration(options)
    return core;
  }
}

export { DDeiCoreLifeCycle }
export * from "./render-lifecycle"
export default DDeiCoreLifeCycle;