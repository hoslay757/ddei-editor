import {DDeiPluginBase} from "ddei-framework";
import PVTextEditor from './PVTextEditor.vue';



class DDeiCoreTextPropEditor extends DDeiPluginBase{

  name: string = PVTextEditor.name

  type: string = "plugin"
  /**
   * 缺省实例
   */
  static defaultIns: DDeiCoreTextPropEditor = new DDeiCoreTextPropEditor(null);

  plugins: object[] = [PVTextEditor]

  getPropEditors(editor){
    return this.plugins
  }
  
  static configuraton(options,fullConfig:boolean = false ) {
    //解析options，只使用自己相关的
    if (options) {
      let newOptions = Object.assign({}, {}, DDeiCoreTextPropEditor.defaultIns.options)
      if (fullConfig) {
        if (fullConfig) {
          if (options[PVTextEditor.name]) {
            for (let i in options[PVTextEditor.name]) {
              newOptions[i] = options[PVTextEditor.name][i]
            }
          }
        }
      }else{
        for (let i in options) {
          newOptions[i] = options[i]
        }
      }
      if (newOptions && Object.keys(newOptions).length !== 0){
        let layouts = new DDeiCoreTextPropEditor(newOptions);
        return layouts;
      }
    }
    return DDeiCoreTextPropEditor;
  }
}

export default DDeiCoreTextPropEditor