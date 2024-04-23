import {DDeiPluginBase} from "ddei-framework";
import FileOperate from './FileOperate.vue';

class DDeiCoreFileOperatePanel extends DDeiPluginBase{
  
  name: string = FileOperate.name
  
  
  /**
   * 缺省实例
   */
  static defaultIns: DDeiCoreFileOperatePanel = new DDeiCoreFileOperatePanel(null);


  plugins: object[] = [FileOperate]

  getPanels(editor){
    return this.plugins;
  }


  static configuraton(options, fullConfig: boolean = false) {
    //解析options，只使用自己相关的
    if (options) {
      let newOptions = {}
      if (fullConfig) {
        if (fullConfig) {
          if (options[FileOperate.name]) {
            for (let i in options[FileOperate.name]) {
              newOptions[i] = options[FileOperate.name][i]
            }
          }
        }
      } else {
        newOptions = options
      }
      if (newOptions && Object.keys(newOptions).length !== 0) {
        let panels = new DDeiCoreFileOperatePanel(newOptions);
        return panels;
      }
    }
    return DDeiCoreFileOperatePanel;
  }
}

export default DDeiCoreFileOperatePanel