import {DDeiPluginBase} from "ddei-framework";
import PVBorderTypeEditor from './PVBorderTypeEditor.vue';



class DDeiCoreBorderTypePropEditor extends DDeiPluginBase{

  type: string = "plugin"

  name: string = PVBorderTypeEditor.name
  /**
   * 缺省实例
   */
  static defaultIns: DDeiCoreBorderTypePropEditor = new DDeiCoreBorderTypePropEditor(null);

  plugins: object[] = [PVBorderTypeEditor]

  getPropEditors(editor){
    return this.plugins
  }
  
  static configuraton(options,fullConfig:boolean = false ) {
    //解析options，只使用自己相关的
    if (options) {
      let newOptions = Object.assign({}, {}, DDeiCoreBorderTypePropEditor.defaultIns.options)
      if (fullConfig) {
        if (fullConfig) {
          if (options[PVBorderTypeEditor.name]) {
            for (let i in options[PVBorderTypeEditor.name]) {
              newOptions[i] = options[PVBorderTypeEditor.name][i]
            }
          }
        }
      }else{
        for (let i in options) {
          newOptions[i] = options[i]
        }
      }
      if (newOptions && Object.keys(newOptions).length !== 0){
        let layouts = new DDeiCoreBorderTypePropEditor(newOptions);
        return layouts;
      }
    }
    return DDeiCoreBorderTypePropEditor;
  }
}

export default DDeiCoreBorderTypePropEditor