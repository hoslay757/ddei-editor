import {DDeiPluginBase} from "ddei-framework";
import DDeiCoreAddFontSizeButton from "./buttons/qbt-addfontsize"
import DDeiCoreBorderDashButton from "./buttons/qbt-borderdash"
import DDeiCoreBorderWeightButton from "./buttons/qbt-borderweight"
import DDeiCoreEditBoxButton from "./buttons/qbt-editbox"
import DDeiCoreEditColorButton from "./buttons/qbt-editcolor"
import DDeiCoreEditFontFamilyButton from "./buttons/qbt-fontfamily"
import DDeiCoreEditFontSizeButton from "./buttons/qbt-fontsize"
import DDeiCoreEditLinePointTypeButton from "./buttons/qbt-linepointtype"
import DDeiCoreEditLineTypeButton from "./buttons/qbt-linetype"
import DDeiCoreEditTextAlignButton from "./buttons/qbt-textalign"

class DDeiCoreComponents extends DDeiPluginBase{

  type: string = "package"

  plugins: object[] = [DDeiCoreAddFontSizeButton, DDeiCoreBorderDashButton, DDeiCoreBorderWeightButton
    , DDeiCoreEditBoxButton, DDeiCoreEditColorButton,
    DDeiCoreEditFontFamilyButton, DDeiCoreEditFontSizeButton, DDeiCoreEditLinePointTypeButton, DDeiCoreEditLineTypeButton, DDeiCoreEditTextAlignButton]

  /**
   * 缺省实例
   */
  static defaultIns:DDeiCoreComponents = new DDeiCoreComponents(null);


  getComponents(editor){
    let components = []
    this.plugins?.forEach(plugin => {
      let ls
      if (DDeiPluginBase.isSubclass(plugin, DDeiPluginBase)) {
        ls = plugin.defaultIns.getComponents(editor);
      } else if (plugin instanceof DDeiPluginBase) {
        ls = plugin.getComponents(editor);
      }
      if (ls?.length > 0) {
        components = components.concat(ls);
      }
    })
    return components
  }

  

  static configuration(options) {
    //解析options，只使用自己相关的
    if (options) {
      //解析options，只使用自己相关的
      let components = new DDeiCoreComponents(options);
      for (let i = 0; i < components.plugins?.length; i++) {
        components.plugins[i] = components.plugins[i].configuration(options, true)
      }
      return components;
    }
    return DDeiCoreComponents;
  }

  static modify(fn) {
    return DDeiCoreComponents.defaultIns.modify(fn)
  }
}

export {DDeiCoreComponents,DDeiCoreAddFontSizeButton, DDeiCoreBorderDashButton, DDeiCoreBorderWeightButton
  , DDeiCoreEditBoxButton, DDeiCoreEditColorButton,
  DDeiCoreEditFontFamilyButton, DDeiCoreEditFontSizeButton, DDeiCoreEditLinePointTypeButton, DDeiCoreEditLineTypeButton, DDeiCoreEditTextAlignButton}
export default DDeiCoreComponents