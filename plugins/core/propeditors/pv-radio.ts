import {DDeiPluginBase} from "ddei-framework";
import PVRadioEditor from './PVRadioEditor.vue';



class DDeiCoreRadioPropEditor extends DDeiPluginBase{

  type: string = "plugin"

  name: string = PVRadioEditor.name
  /**
   * 缺省实例
   */
  static defaultIns: DDeiCoreRadioPropEditor = new DDeiCoreRadioPropEditor(null);

  plugins: object[] = [PVRadioEditor]

  getPropEditors(editor){
    return this.plugins
  }
  
  static configuration(options,fullConfig:boolean = false ) {
    //解析options，只使用自己相关的
    if (options) {
      let newOptions = Object.assign({}, {}, DDeiCoreRadioPropEditor.defaultIns.options)
      if (fullConfig) {
        if (fullConfig) {
          if (options[PVRadioEditor.name]) {
            for (let i in options[PVRadioEditor.name]) {
              newOptions[i] = options[PVRadioEditor.name][i]
            }
          }
        }
      }else{
        for (let i in options) {
          newOptions[i] = options[i]
        }
      }
      if (newOptions && Object.keys(newOptions).length !== 0){
        let layouts = new DDeiCoreRadioPropEditor(newOptions);
        return layouts;
      }
    }
    return DDeiCoreRadioPropEditor;
  }
}

export default DDeiCoreRadioPropEditor