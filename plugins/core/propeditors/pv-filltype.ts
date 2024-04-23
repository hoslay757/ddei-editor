import {DDeiPluginBase} from "ddei-framework";
import PVFillTypeEditor from './PVFillTypeEditor.vue';



class DDeiCoreFillTypePropEditor extends DDeiPluginBase{

  type: string = "plugin"

  name: string = PVFillTypeEditor.name
  /**
   * 缺省实例
   */
  static defaultIns: DDeiCoreFillTypePropEditor = new DDeiCoreFillTypePropEditor(null);

  plugins: object[] = [PVFillTypeEditor]

  getPropEditors(editor){
    return this.plugins
  }
  
  static configuraton(options,fullConfig:boolean = false ) {
    //解析options，只使用自己相关的
    if (options) {
      let newOptions = Object.assign({}, {}, DDeiCoreFillTypePropEditor.defaultIns.options)
      if (fullConfig) {
        if (fullConfig) {
          if (options[PVFillTypeEditor.name]) {
            for (let i in options[PVFillTypeEditor.name]) {
              newOptions[i] = options[PVFillTypeEditor.name][i]
            }
          }
        }
      }else{
        for (let i in options) {
          newOptions[i] = options[i]
        }
      }
      if (newOptions && Object.keys(newOptions).length !== 0){
        let layouts = new DDeiCoreFillTypePropEditor(newOptions);
        return layouts;
      }
    }
    return DDeiCoreFillTypePropEditor;
  }
}

export default DDeiCoreFillTypePropEditor