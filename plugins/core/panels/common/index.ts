import {DDeiPluginBase} from "ddei-framework1";
import DDeiCoreExportAndImportPanel from './exportandimport';
import DDeiCoreFileInfoPanel from './fileinfo';
import DDeiCoreFileOperatePanel from './fileoperate';
import DDeiCoreFontAndTextPanel from './fontandtext';
import DDeiCoreGoBackPanel from './goback';
import DDeiCoreOperatePanel from './operate';
import DDeiCoreRightPanel from './right';
import DDeiCoreSharePanel from './share';
import DDeiCoreSortPanel from './sort';
import DDeiCoreStylePanel from './style';
import DDeiCoreToolPanel from './tool';

class DDeiCoreCommonPanels extends DDeiPluginBase{
  

  type:string = "package"
  /**
   * 缺省实例
   */
  static defaultIns:DDeiCoreCommonPanels = new DDeiCoreCommonPanels(null);

  plugins: object[] = [DDeiCoreExportAndImportPanel, DDeiCoreFileInfoPanel,
     DDeiCoreFileOperatePanel, DDeiCoreFontAndTextPanel, DDeiCoreGoBackPanel, DDeiCoreOperatePanel,
     DDeiCoreOperatePanel, DDeiCoreRightPanel, DDeiCoreSharePanel, DDeiCoreSortPanel, DDeiCoreStylePanel,
     DDeiCoreToolPanel]

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
      let panels = new DDeiCoreCommonPanels(options);
      for (let i = 0; i < panels.plugins?.length;i++){
        panels.plugins[i] = panels.plugins[i].configuraton(options,true)
      }
      return panels;
    }
    return DDeiCoreCommonPanels;
  }
}


export {DDeiCoreCommonPanels, DDeiCoreExportAndImportPanel, DDeiCoreFileInfoPanel,
  DDeiCoreFileOperatePanel, DDeiCoreFontAndTextPanel, DDeiCoreGoBackPanel, DDeiCoreOperatePanel,
  DDeiCoreRightPanel, DDeiCoreSharePanel, DDeiCoreSortPanel, DDeiCoreStylePanel,
  DDeiCoreToolPanel}
export default DDeiCoreCommonPanels