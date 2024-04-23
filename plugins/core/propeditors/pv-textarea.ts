import {DDeiPluginBase} from "ddei-framework1";
import PVTextAreaEditor from './PVTextAreaEditor.vue';



class DDeiCoreTextAreaPropEditor extends DDeiPluginBase{

  name: string = PVTextAreaEditor.name
  /**
   * 缺省实例
   */
  static defaultIns: DDeiCoreTextAreaPropEditor = new DDeiCoreTextAreaPropEditor(null);

  plugins: object[] = [PVTextAreaEditor]

  getPropEditors(editor){
    return this.plugins
  }
  
  static configuraton(options,fullConfig:boolean = false ) {
    //解析options，只使用自己相关的
    if (options) {
      let newOptions = Object.assign({}, {}, DDeiCoreTextAreaPropEditor.defaultIns.options)
      if (fullConfig) {
        if (fullConfig) {
          if (options[PVTextAreaEditor.name]) {
            for (let i in options[PVTextAreaEditor.name]) {
              newOptions[i] = options[PVTextAreaEditor.name][i]
            }
          }
        }
      }else{
        for (let i in options) {
          newOptions[i] = options[i]
        }
      }
      if (newOptions && Object.keys(newOptions).length !== 0){
        let layouts = new DDeiCoreTextAreaPropEditor(newOptions);
        return layouts;
      }
    }
    return DDeiCoreTextAreaPropEditor;
  }
}

export default DDeiCoreTextAreaPropEditor