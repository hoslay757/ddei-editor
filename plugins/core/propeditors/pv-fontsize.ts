import {DDeiPluginBase} from "ddei-framework";
import PVFontSizeEditor from './PVFontSizeEditor.vue';



class DDeiCoreFontSizePropEditor extends DDeiPluginBase{

  type: string = "plugin"

  name: string = PVFontSizeEditor.name
  /**
   * 缺省实例
   */
  static defaultIns: DDeiCoreFontSizePropEditor = new DDeiCoreFontSizePropEditor(null);

  plugins: object[] = [PVFontSizeEditor]

  getPropEditors(editor){
    return this.plugins
  }
  
  static configuration(options,fullConfig:boolean = false ) {
    //解析options，只使用自己相关的
    if (options) {
      let newOptions = Object.assign({}, {}, DDeiCoreFontSizePropEditor.defaultIns.options)
      if (fullConfig) {
        if (fullConfig) {
          if (options[PVFontSizeEditor.name]) {
            for (let i in options[PVFontSizeEditor.name]) {
              newOptions[i] = options[PVFontSizeEditor.name][i]
            }
          }
        }
      }else{
        for (let i in options) {
          newOptions[i] = options[i]
        }
      }
      if (newOptions && Object.keys(newOptions).length !== 0){
        let layouts = new DDeiCoreFontSizePropEditor(newOptions);
        return layouts;
      }
    }
    return DDeiCoreFontSizePropEditor;
  }
}

export default DDeiCoreFontSizePropEditor