import {DDeiPluginBase} from "ddei-framework1";
import PVAlignTypeEditor from './PVAlignTypeEditor.vue';



class DDeiCoreAlignTypePropEditor extends DDeiPluginBase{

  type: string = "plugin"

  name: string = PVAlignTypeEditor.name
  /**
   * 缺省实例
   */
  static defaultIns: DDeiCoreAlignTypePropEditor = new DDeiCoreAlignTypePropEditor(null);

  plugins: object[] = [PVAlignTypeEditor]

  getPropEditors(editor){
    return this.plugins
  }
  
  static configuraton(options,fullConfig:boolean = false ) {
    //解析options，只使用自己相关的
    if (options) {
      let newOptions = Object.assign({}, {}, DDeiCoreAlignTypePropEditor.defaultIns.options)
      if (fullConfig) {
        if (fullConfig) {
          if (options[PVAlignTypeEditor.name]) {
            for (let i in options[PVAlignTypeEditor.name]) {
              newOptions[i] = options[PVAlignTypeEditor.name][i]
            }
          }
        }
      }else{
        for (let i in options) {
          newOptions[i] = options[i]
        }
      }
      if (newOptions && Object.keys(newOptions).length !== 0){
        let layouts = new DDeiCoreAlignTypePropEditor(newOptions);
        return layouts;
      }
    }
    return DDeiCoreAlignTypePropEditor;
  }
}

export default DDeiCoreAlignTypePropEditor