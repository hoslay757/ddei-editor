import {DDeiThemeBase} from "ddei-framework";
/**
 * 复制页签
 */
class DDeiCoreThemeDefault extends DDeiThemeBase {


  name: string = "ddei-core-theme-default"

  label:string = "默认"

  default:boolean = true;

  // //背景色
  // background:string =  'white';
  // //主题色
  // theme:string = '#F5F5F5';
  // //文本色
  // text:string = 'black';
  // //点缀色
  // dot: string = '#176eff';
  // //交互色
  // active:string = '#edefff';
  // //图标色
  // icon:string = '#424242';
  


  /**
   * 缺省实例
   */
  static defaultIns: DDeiCoreThemeDefault = new DDeiCoreThemeDefault();


  getThemes(editor) {
    let theme_ctx = import.meta.glob(
      "./theme-default.css", { eager: true }
    )
    for (let path in theme_ctx) {
      let css = theme_ctx[path].default
      this.css = css;
    }
    return super.getThemes(editor)
  }

  static configuraton(options, fullConfig: boolean = false) {
    //解析options，只使用自己相关的
    if (options) {
      let newOptions = {}
      if (fullConfig) {
        if (fullConfig) {
          if (options[DDeiCoreThemeDefault.defaultIns.name]) {
            for (let i in options[DDeiCoreThemeDefault.defaultIns.name]) {
              newOptions[i] = options[DDeiCoreThemeDefault.defaultIns.name][i]
            }
          }
        }
      } else {
        newOptions = options
      }
      if (newOptions && Object.keys(newOptions).length !== 0) {
        let panels = new DDeiCoreThemeDefault(newOptions);
        return panels;
      }
    }
    return DDeiCoreThemeDefault;
  }
}

export default DDeiCoreThemeDefault;
