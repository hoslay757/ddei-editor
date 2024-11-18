import {DDeiPluginBase} from "ddei-framework";
import PVImageEditor from './PVImageEditor.vue';



class DDeiCoreImagePropEditor extends DDeiPluginBase{

  type: string = "plugin"

  name: string = PVImageEditor.name
  /**
   * 缺省实例
   */
  static defaultIns: DDeiCoreImagePropEditor = new DDeiCoreImagePropEditor(null);

  plugins: object[] = [PVImageEditor]

  getPropEditors(editor){
    return this.plugins
  }
  
  static configuration(options,fullConfig:boolean = false ) {
    //解析options，只使用自己相关的
    if (options) {
      let newOptions = Object.assign({}, {}, DDeiCoreImagePropEditor.defaultIns.options)
      if (fullConfig) {
        if (fullConfig) {
          if (options[PVImageEditor.name]) {
            for (let i in options[PVImageEditor.name]) {
              newOptions[i] = options[PVImageEditor.name][i]
            }
          }
        }
      }else{
        for (let i in options) {
          newOptions[i] = options[i]
        }
      }
      if (newOptions && Object.keys(newOptions).length !== 0){
        let layouts = new DDeiCoreImagePropEditor(newOptions);
        return layouts;
      }
    }
    return DDeiCoreImagePropEditor;
  }

  static modify(fn) {
    return DDeiCoreImagePropEditor.defaultIns.modify(fn)
  }
}

export default DDeiCoreImagePropEditor