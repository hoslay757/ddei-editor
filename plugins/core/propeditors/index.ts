import {DDeiPluginBase} from "ddei-framework";
import DDeiCoreTextPropEditor from './pv-text';
import DDeiCoreAlignTypePropEditor from './pv-aligntype';
import DDeiCoreBorderDashComboPropEditor from './pv-borderdashcombo';
import DDeiCoreBorderTypePropEditor from './pv-bordertype';
import DDeiCoreColorComboPropEditor from './pv-colorcombo';
import DDeiCoreColorPropEditor from './pv-color';
import DDeiCoreComboxPropEditor from './pv-combox';
import DDeiCoreExCheckboxPropEditor from './pv-excheckbox';
import DDeiCoreFillTypePropEditor from './pv-filltype';
import DDeiCoreFontSizePropEditor from './pv-fontsize';
import DDeiCoreImagePropEditor from './pv-image';
import DDeiCoreRadioPropEditor from './pv-radio';
import DDeiCoreRangePropEditor from './pv-range';
import DDeiCoreSwitchCheckboxPropEditor from './pv-switchcheckbox';
import DDeiCoreTextAreaPropEditor from './pv-textarea';



class DDeiCorePVEditors extends DDeiPluginBase {

  type: string = "package"
  /**
   * 缺省实例
   */
  static defaultIns: DDeiCorePVEditors = new DDeiCorePVEditors(null);

  plugins: object[] = [DDeiCoreTextPropEditor, DDeiCoreAlignTypePropEditor
    , DDeiCoreBorderDashComboPropEditor, DDeiCoreBorderTypePropEditor
    , DDeiCoreColorComboPropEditor, DDeiCoreColorPropEditor, DDeiCoreComboxPropEditor
    , DDeiCoreExCheckboxPropEditor, DDeiCoreFillTypePropEditor, DDeiCoreFontSizePropEditor
    , DDeiCoreImagePropEditor, DDeiCoreRadioPropEditor, DDeiCoreRangePropEditor, DDeiCoreSwitchCheckboxPropEditor, DDeiCoreTextAreaPropEditor]



  getPropEditors(editor) {
    let pves = []
    this.plugins?.forEach(plugin => {
      let ls
      if (DDeiPluginBase.isSubclass(plugin, DDeiPluginBase)) {
        ls =  plugin.defaultIns.getPropEditors(editor);
      } else if (plugin instanceof DDeiPluginBase) {
        ls = plugin.getPropEditors(editor);
      }
      
      if (ls?.length > 0) {
        pves = pves.concat(ls);
      }
    })
    return pves
  }

  static configuraton(options) {
    if (options){
      //解析options，只使用自己相关的
      let pves = new DDeiCorePVEditors(options);
      for (let i = 0; i < pves.plugins?.length; i++) {
        pves.plugins[i] = pves.plugins[i].configuraton(options, true)
      }
      return pves;
    }
    return DDeiCorePVEditors;
  }
}


export { DDeiCorePVEditors, DDeiCoreTextPropEditor, DDeiCoreAlignTypePropEditor
  , DDeiCoreBorderDashComboPropEditor, DDeiCoreBorderTypePropEditor, DDeiCoreColorComboPropEditor
  , DDeiCoreColorPropEditor, DDeiCoreComboxPropEditor, DDeiCoreExCheckboxPropEditor, DDeiCoreFillTypePropEditor
  , DDeiCoreFontSizePropEditor, DDeiCoreImagePropEditor, DDeiCoreRadioPropEditor, DDeiCoreRangePropEditor, DDeiCoreSwitchCheckboxPropEditor, DDeiCoreTextAreaPropEditor
}
export default DDeiCorePVEditors