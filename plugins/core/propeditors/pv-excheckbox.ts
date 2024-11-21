import {DDeiPluginBase} from "ddei-framework";
import PVExCheckboxEditor from './PVExCheckboxEditor.vue';



class DDeiCoreExCheckboxPropEditor extends DDeiPluginBase{

  type: string = "plugin"

  name: string = PVExCheckboxEditor.name
  /**
   * 缺省实例
   */
  static defaultIns: DDeiCoreExCheckboxPropEditor = new DDeiCoreExCheckboxPropEditor(null);

  plugins: object[] = [PVExCheckboxEditor]

  getPropEditors(editor){
    return this.plugins
  }
  
  static configuration(options,fullConfig:boolean = false ) {
    //解析options，只使用自己相关的
    if (options) {
      let newOptions = Object.assign({}, {}, DDeiCoreExCheckboxPropEditor.defaultIns.options)
      if (fullConfig) {
        if (fullConfig) {
          if (options[PVExCheckboxEditor.name]) {
            for (let i in options[PVExCheckboxEditor.name]) {
              newOptions[i] = options[PVExCheckboxEditor.name][i]
            }
          }
        }
      }else{
        for (let i in options) {
          newOptions[i] = options[i]
        }
      }
      if (newOptions && Object.keys(newOptions).length !== 0){
        let layouts = new DDeiCoreExCheckboxPropEditor(newOptions);
        return layouts;
      }
    }
    return DDeiCoreExCheckboxPropEditor;
  }

  static modify(fn) {
    return DDeiCoreExCheckboxPropEditor.defaultIns.modify(fn)
  }
}

export default DDeiCoreExCheckboxPropEditor