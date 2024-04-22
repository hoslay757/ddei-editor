import {DDeiPluginBase} from "ddei-framework1";
import OpenFilesView from './OpenFilesView.vue';

class DDeiCoreOpenFilesViewPanel extends DDeiPluginBase{
  
  name: string = OpenFilesView.name
  /**
   * 缺省实例
   */
  static defaultIns: DDeiCoreOpenFilesViewPanel = new DDeiCoreOpenFilesViewPanel(null);


  plugins: object[] = [OpenFilesView]

  getPanels(editor){
    return this.plugins;
  }

  
  static configuraton(options, fullConfig: boolean = false) {
    //解析options，只使用自己相关的
    if (options) {
      let newOptions = {}
      if (fullConfig) {
        if (fullConfig) {
          if (options[OpenFilesView.name]) {
            for (let i in options[OpenFilesView.name]) {
              newOptions[i] = options[OpenFilesView.name][i]
            }
          }
        }
      } else {
        newOptions = options
      }
      if (newOptions && Object.keys(newOptions).length !== 0) {
        let panels = new DDeiCoreOpenFilesViewPanel(newOptions);
        return panels;
      }
    }
    return DDeiCoreOpenFilesViewPanel;
  }
}

export default DDeiCoreOpenFilesViewPanel