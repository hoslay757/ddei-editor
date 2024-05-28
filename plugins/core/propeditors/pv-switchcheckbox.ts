import {DDeiPluginBase} from "ddei-framework";
import PVSwitchCheckboxEditor from './PVSwitchCheckboxEditor.vue';



class DDeiCoreSwitchCheckboxPropEditor extends DDeiPluginBase{

  type: string = "plugin"

  name: string = PVSwitchCheckboxEditor.name
  /**
   * 缺省实例
   */
  static defaultIns: DDeiCoreSwitchCheckboxPropEditor = new DDeiCoreSwitchCheckboxPropEditor(null);

  plugins: object[] = [PVSwitchCheckboxEditor]

  getPropEditors(editor){
    return this.plugins
  }
  
  static configuration(options,fullConfig:boolean = false ) {
    //解析options，只使用自己相关的
    if (options) {
      let newOptions = Object.assign({}, {}, DDeiCoreSwitchCheckboxPropEditor.defaultIns.options)
      if (fullConfig) {
        if (fullConfig) {
          if (options[PVSwitchCheckboxEditor.name]) {
            for (let i in options[PVSwitchCheckboxEditor.name]) {
              newOptions[i] = options[PVSwitchCheckboxEditor.name][i]
            }
          }
        }
      }else{
        for (let i in options) {
          newOptions[i] = options[i]
        }
      }
      if (newOptions && Object.keys(newOptions).length !== 0){
        let layouts = new DDeiCoreSwitchCheckboxPropEditor(newOptions);
        return layouts;
      }
    }
    return DDeiCoreSwitchCheckboxPropEditor;
  }
}

export default DDeiCoreSwitchCheckboxPropEditor