import {DDeiPluginBase} from "ddei-framework";
import PVColorComboEditor from './PVColorComboEditor.vue';



class DDeiCoreColorComboPropEditor extends DDeiPluginBase{

  type: string = "plugin"

  name: string = PVColorComboEditor.name
  /**
   * 缺省实例
   */
  static defaultIns: DDeiCoreColorComboPropEditor = new DDeiCoreColorComboPropEditor(null);

  plugins: object[] = [PVColorComboEditor]

  getPropEditors(editor){
    return this.plugins
  }
  
  static configuration(options,fullConfig:boolean = false ) {
    //解析options，只使用自己相关的
    if (options) {
      let newOptions = Object.assign({}, {}, DDeiCoreColorComboPropEditor.defaultIns.options)
      if (fullConfig) {
        if (fullConfig) {
          if (options[PVColorComboEditor.name]) {
            for (let i in options[PVColorComboEditor.name]) {
              newOptions[i] = options[PVColorComboEditor.name][i]
            }
          }
        }
      }else{
        for (let i in options) {
          newOptions[i] = options[i]
        }
      }
      if (newOptions && Object.keys(newOptions).length !== 0){
        let layouts = new DDeiCoreColorComboPropEditor(newOptions);
        return layouts;
      }
    }
    return DDeiCoreColorComboPropEditor;
  }
}

export default DDeiCoreColorComboPropEditor