import {DDeiPluginBase} from "ddei-framework1";
import PVBorderDashComboEditor from './PVBorderDashComboEditor.vue';



class DDeiCoreBorderDashComboPropEditor extends DDeiPluginBase{

  type: string = "plugin"

  name: string = PVBorderDashComboEditor.name
  /**
   * 缺省实例
   */
  static defaultIns: DDeiCoreBorderDashComboPropEditor = new DDeiCoreBorderDashComboPropEditor(null);

  plugins: object[] = [PVBorderDashComboEditor]

  getPropEditors(editor){
    return this.plugins
  }
  
  static configuraton(options,fullConfig:boolean = false ) {
    //解析options，只使用自己相关的
    if (options) {
      let newOptions = Object.assign({}, {}, DDeiCoreBorderDashComboPropEditor.defaultIns.options)
      if (fullConfig) {
        if (fullConfig) {
          if (options[PVBorderDashComboEditor.name]) {
            for (let i in options[PVBorderDashComboEditor.name]) {
              newOptions[i] = options[PVBorderDashComboEditor.name][i]
            }
          }
        }
      }else{
        for (let i in options) {
          newOptions[i] = options[i]
        }
      }
      if (newOptions && Object.keys(newOptions).length !== 0){
        let layouts = new DDeiCoreBorderDashComboPropEditor(newOptions);
        return layouts;
      }
    }
    return DDeiCoreBorderDashComboPropEditor;
  }
}

export default DDeiCoreBorderDashComboPropEditor