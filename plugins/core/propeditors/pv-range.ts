import {DDeiPluginBase} from "ddei-framework";
import PVRangeEditor from './PVRangeEditor.vue';



class DDeiCoreRangePropEditor extends DDeiPluginBase{

  type: string = "plugin"

  name: string = PVRangeEditor.name
  /**
   * 缺省实例
   */
  static defaultIns: DDeiCoreRangePropEditor = new DDeiCoreRangePropEditor(null);

  plugins: object[] = [PVRangeEditor]

  getPropEditors(editor){
    return this.plugins
  }
  
  static configuration(options,fullConfig:boolean = false ) {
    //解析options，只使用自己相关的
    if (options) {
      let newOptions = Object.assign({}, {}, DDeiCoreRangePropEditor.defaultIns.options)
      if (fullConfig) {
        if (fullConfig) {
          if (options[PVRangeEditor.name]) {
            for (let i in options[PVRangeEditor.name]) {
              newOptions[i] = options[PVRangeEditor.name][i]
            }
          }
        }
      }else{
        for (let i in options) {
          newOptions[i] = options[i]
        }
      }
      if (newOptions && Object.keys(newOptions).length !== 0){
        let layouts = new DDeiCoreRangePropEditor(newOptions);
        return layouts;
      }
    }
    return DDeiCoreRangePropEditor;
  }
}

export default DDeiCoreRangePropEditor