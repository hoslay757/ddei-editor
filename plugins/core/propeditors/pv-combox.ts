import {DDeiPluginBase} from "ddei-framework";
import PVComboxEditor from './PVComboxEditor.vue';



class DDeiCoreComboxPropEditor extends DDeiPluginBase{

  type: string = "plugin"

  name: string = PVComboxEditor.name
  /**
   * 缺省实例
   */
  static defaultIns: DDeiCoreComboxPropEditor = new DDeiCoreComboxPropEditor(null);

  plugins: object[] = [PVComboxEditor]

  getPropEditors(editor){
    return this.plugins
  }
  
  static configuraton(options,fullConfig:boolean = false ) {
    //解析options，只使用自己相关的
    if (options) {
      let newOptions = Object.assign({}, {}, DDeiCoreComboxPropEditor.defaultIns.options)
      if (fullConfig) {
        if (fullConfig) {
          if (options[PVComboxEditor.name]) {
            for (let i in options[PVComboxEditor.name]) {
              newOptions[i] = options[PVComboxEditor.name][i]
            }
          }
        }
      }else{
        for (let i in options) {
          newOptions[i] = options[i]
        }
      }
      if (newOptions && Object.keys(newOptions).length !== 0){
        let layouts = new DDeiCoreComboxPropEditor(newOptions);
        return layouts;
      }
    }
    return DDeiCoreComboxPropEditor;
  }
}

export default DDeiCoreComboxPropEditor