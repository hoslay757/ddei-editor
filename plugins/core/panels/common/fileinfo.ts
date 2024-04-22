import {DDeiPluginBase} from "ddei-framework1";
import FileInfo from './FileInfo.vue';

class DDeiCoreFileInfoPanel extends DDeiPluginBase{
  
  name: string = FileInfo.name
  
  
  /**
   * 缺省实例
   */
  static defaultIns: DDeiCoreFileInfoPanel = new DDeiCoreFileInfoPanel(null);


  plugins: object[] = [FileInfo]

  getPanels(editor){
    return this.plugins;
  }


  static configuraton(options, fullConfig: boolean = false) {
    //解析options，只使用自己相关的
    if (options) {
      let newOptions = {}
      if (fullConfig) {
        if (fullConfig) {
          if (options[FileInfo.name]) {
            for (let i in options[FileInfo.name]) {
              newOptions[i] = options[FileInfo.name][i]
            }
          }
        }
      } else {
        newOptions = options
      }
      if (newOptions && Object.keys(newOptions).length !== 0) {
        let panels = new DDeiCoreFileInfoPanel(newOptions);
        return panels;
      }
    }
    return DDeiCoreFileInfoPanel;
  }
}

export default DDeiCoreFileInfoPanel