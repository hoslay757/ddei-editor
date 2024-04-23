import {DDeiPluginBase} from "ddei-framework1";
import DDeiCoreTopMenuPanel from './topmenu';
import DDeiCoreToolboxPanel from './toolbox';
import DDeiCoreQuickColorViewPanel from './quickcolor';
import DDeiCorePropertyViewPanel from './propertyview';
import DDeiCoreOpenFilesViewPanel from './openfilesview';
import DDeiCoreCanvasViewPanel from './canvasview';
import DDeiCoreBottomMenuPanel from './bottommenu';
import DDeiCoreCommonPanels from './common';
import DDeiCoreBottomPanels from './bottom';

class DDeiCorePanels extends DDeiPluginBase{
  
  type:string = "package"
  /**
   * 缺省实例
   */
  static defaultIns:DDeiCorePanels = new DDeiCorePanels(null);

  plugins: object[] = [DDeiCoreTopMenuPanel, DDeiCoreToolboxPanel, DDeiCoreQuickColorViewPanel, DDeiCorePropertyViewPanel, 
    DDeiCoreOpenFilesViewPanel, DDeiCoreCanvasViewPanel, DDeiCoreBottomMenuPanel, DDeiCoreCommonPanels, DDeiCoreBottomPanels]

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

 

  static configuraton(options) {
    if (options){
      //解析options，只使用自己相关的
      let panels = new DDeiCorePanels(options);
      for (let i = 0; i < panels.plugins?.length;i++){
        panels.plugins[i] = panels.plugins[i].configuraton(options,true)
      }
      return panels;
    }
    return DDeiCorePanels;
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
export {
  DDeiCorePanels, DDeiCoreTopMenuPanel, DDeiCoreToolboxPanel, DDeiCoreQuickColorViewPanel, DDeiCorePropertyViewPanel,
  DDeiCoreOpenFilesViewPanel, DDeiCoreCanvasViewPanel, DDeiCoreBottomMenuPanel, DDeiCoreCommonPanels, DDeiCoreBottomPanels
}
export default DDeiCorePanels