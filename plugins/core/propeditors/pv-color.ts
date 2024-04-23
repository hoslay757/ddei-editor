import {DDeiPluginBase} from "ddei-framework1";
import PVColorEditor from './PVColorEditor.vue';



class DDeiCoreColorPropEditor extends DDeiPluginBase{

  type: string = "plugin"

  name: string = PVColorEditor.name
  /**
   * 缺省实例
   */
  static defaultIns: DDeiCoreColorPropEditor = new DDeiCoreColorPropEditor(null);

  plugins: object[] = [PVColorEditor]

  getPropEditors(editor){
    return this.plugins
  }
  
  static configuraton(options,fullConfig:boolean = false ) {
    //解析options，只使用自己相关的
    if (options) {
      let newOptions = Object.assign({}, {}, DDeiCoreColorPropEditor.defaultIns.options)
      if (fullConfig) {
        if (fullConfig) {
          if (options[PVColorEditor.name]) {
            for (let i in options[PVColorEditor.name]) {
              newOptions[i] = options[PVColorEditor.name][i]
            }
          }
        }
      }else{
        for (let i in options) {
          newOptions[i] = options[i]
        }
      }
      if (newOptions && Object.keys(newOptions).length !== 0){
        let layouts = new DDeiCoreColorPropEditor(newOptions);
        return layouts;
      }
    }
    return DDeiCoreColorPropEditor;
  }
}

export default DDeiCoreColorPropEditor