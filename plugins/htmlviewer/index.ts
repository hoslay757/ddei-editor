import { DDeiPluginBase, DDeiEditor } from "ddei-framework";
import DDeiExtHtmlViewerLifeCycle from "./htmlviewer-lifecycle"

class DDeiExtHtmlViewer extends DDeiPluginBase {
  type: string = "package"


  /**
   * 缺省实例
   */
  static defaultIns: DDeiExtHtmlViewer = new DDeiExtHtmlViewer(null);


  lifecyclies: object = DDeiExtHtmlViewerLifeCycle;

  

  getLifeCyclies(editor:DDeiEditor) {
    if (DDeiPluginBase.isSubclass(this.lifecyclies, DDeiPluginBase)) {
      return this.lifecyclies.defaultIns.getLifeCyclies(editor);
    } else if (this.lifecyclies instanceof DDeiPluginBase) {
      return this.lifecyclies.getLifeCyclies(editor);
    }
  }

  installed(editor:DDeiEditor) {
    if (DDeiPluginBase.isSubclass(this.lifecyclies, DDeiPluginBase)) {
      return this.lifecyclies.defaultIns.installed(editor);
    } else if (this.lifecyclies instanceof DDeiPluginBase) {
      return this.lifecyclies.installed(editor);
    }
  }


  static configuration(options) {
    let core = new DDeiExtHtmlViewer(options);
    core.lifecyclies = core.lifecyclies.configuration(options)
    return core;
  }
}

export { DDeiExtHtmlViewer }
export * from "./htmlviewer-lifecycle"
export default DDeiExtHtmlViewer;