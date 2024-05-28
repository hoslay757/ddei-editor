import {DDeiPluginBase} from "ddei-framework";
import DDeiCoreExportAndImportPanel from './exportandimport';
import DDeiCoreFileInfoPanel from './fileinfo';
import DDeiCoreFileOperatePanel from './fileoperate';
import DDeiCoreFontAndTextPanel from './fontandtext';
import DDeiCoreOperatePanel from './operate';
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
     DDeiCoreFileOperatePanel, DDeiCoreFontAndTextPanel,  DDeiCoreOperatePanel,
     DDeiCoreOperatePanel,  DDeiCoreSortPanel, DDeiCoreStylePanel,
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

 

  static configuration(options) {
    if (options){
      //解析options，只使用自己相关的
      let panels = new DDeiCoreCommonPanels(options);
      for (let i = 0; i < panels.plugins?.length;i++){
        panels.plugins[i] = panels.plugins[i].configuration(options,true)
      }
      return panels;
    }
    return DDeiCoreCommonPanels;
  }
}


export {DDeiCoreCommonPanels, DDeiCoreExportAndImportPanel, DDeiCoreFileInfoPanel,
  DDeiCoreFileOperatePanel, DDeiCoreFontAndTextPanel,  DDeiCoreOperatePanel,
   DDeiCoreSortPanel, DDeiCoreStylePanel,
  DDeiCoreToolPanel}
export default DDeiCoreCommonPanels