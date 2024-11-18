import {DDeiPluginBase} from "ddei-framework";
import DDeiCoreTopMenuPanel from './topmenu';
import DDeiCoreToolboxPanel from './toolbox';
import DDeiCoreQuickColorViewPanel from './quickcolor';
import DDeiCorePropertyViewPanel from './propertyview';
import DDeiCoreOpenFilesViewPanel from './openfilesview';
import DDeiCoreCanvasViewPanel from './canvasview';
import DDeiCoreBottomMenuPanel from './bottommenu';
import DDeiCoreCommonPanels from './common';
import DDeiCoreBottomPanels from './bottom';
import DDeiCoreSimplePanels from './simple';

class DDeiCorePanels extends DDeiPluginBase{
  
  type:string = "package"
  /**
   * 缺省实例
   */
  static defaultIns:DDeiCorePanels = new DDeiCorePanels(null);

  plugins: object[] = [DDeiCoreTopMenuPanel, DDeiCoreToolboxPanel, DDeiCoreQuickColorViewPanel, DDeiCorePropertyViewPanel, 
    DDeiCoreOpenFilesViewPanel, DDeiCoreCanvasViewPanel, DDeiCoreBottomMenuPanel, DDeiCoreCommonPanels, DDeiCoreBottomPanels, DDeiCoreSimplePanels]

  getPanels(editor){
    let panels = []
    this.plugins?.forEach(plugin => {
      let ls
      if (DDeiPluginBase.isSubclass(plugin, DDeiPluginBase)) {
        ls = plugin.defaultIns.getPanels(editor);
      } else if (plugin instanceof DDeiPluginBase) {
        ls = plugin.getPanels(editor);
      }
      if (ls?.length > 0) {
        panels = panels.concat(ls);
      }
    })
    return panels
  }

 

  static configuration(options) {
    if (options){
      //解析options，只使用自己相关的
      let panels = new DDeiCorePanels(options);
      for (let i = 0; i < panels.plugins?.length;i++){
        panels.plugins[i] = panels.plugins[i].configuration(options,true)
      }
      return panels;
    }
    return DDeiCorePanels;
  }

  static modify(fn) {
    return DDeiCorePanels.defaultIns.modify(fn)
  }
}


export * from './topmenu'
export * from './toolbox'
export * from './quickcolor'
export * from './propertyview'
export * from './openfilesview'
export * from './canvasview'
export * from './bottommenu'
export * from './common'
export * from './bottom'
export * from './simple'
export {
  DDeiCorePanels, DDeiCoreTopMenuPanel, DDeiCoreToolboxPanel, DDeiCoreQuickColorViewPanel, DDeiCorePropertyViewPanel,
  DDeiCoreOpenFilesViewPanel, DDeiCoreCanvasViewPanel, DDeiCoreBottomMenuPanel, DDeiCoreCommonPanels, DDeiCoreBottomPanels, DDeiCoreSimplePanels
}
export default DDeiCorePanels