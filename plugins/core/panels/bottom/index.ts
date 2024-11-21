import {DDeiPluginBase} from "ddei-framework";
import DDeiCoreShapeCountPanel from './shapecount';
import DDeiCoreManageLayersPanel from './managelayers';
import DDeiCorePlayPanel from './play';
import DDeiCoreSuitRatioPanel from './suitratio';
import DDeiCoreChangeRatioPanel from './changeratio';
import DDeiCoreSheetsPanel from './sheets';

class DDeiCoreBottomPanels extends DDeiPluginBase{
  

  type:string = "package"
  /**
   * 缺省实例
   */
  static defaultIns:DDeiCoreBottomPanels = new DDeiCoreBottomPanels(null);

  plugins: object[] = [DDeiCoreShapeCountPanel, DDeiCoreManageLayersPanel, DDeiCorePlayPanel
    , DDeiCoreSuitRatioPanel, DDeiCoreChangeRatioPanel, DDeiCoreSheetsPanel]

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
      let panels = new DDeiCoreBottomPanels(options);
      for (let i = 0; i < panels.plugins?.length;i++){
        panels.plugins[i] = panels.plugins[i].configuration(options,true)
      }
      return panels;
    }
    return DDeiCoreBottomPanels;
  }

  static modify(fn) {
    return DDeiCoreBottomPanels.defaultIns.modify(fn)
  }
}


export {
  DDeiCoreBottomPanels, DDeiCoreShapeCountPanel, DDeiCoreManageLayersPanel
  , DDeiCorePlayPanel, DDeiCoreSuitRatioPanel, DDeiCoreChangeRatioPanel, DDeiCoreSheetsPanel }
export default DDeiCoreBottomPanels