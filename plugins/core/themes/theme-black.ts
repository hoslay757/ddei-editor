import {DDeiThemeBase} from "ddei-framework";
/**
 * 复制页签
 */
class DDeiCoreThemeBlack extends DDeiThemeBase {


  name: string = "ddei-core-theme-black"

  label:string = "黑色"

  // //背景色
  // background:string =  'black';
  // //主题色
  // theme:string = 'black';
  // //文本色
  // text:string = 'white';
  // //点缀色
  // dot: string = '#176eff';
  // //交互色
  // active:string = '#edefff';
  // //图标色
  // icon:string = '#424242';
  


  /**
   * 缺省实例
   */
  static defaultIns: DDeiCoreThemeBlack = new DDeiCoreThemeBlack();

  getThemes(editor) {
    let theme_ctx = import.meta.glob(
      "./theme-black.css", { eager: true }
    )
    for (let path in theme_ctx) {
      let css = theme_ctx[path].default
      this.css = css;
    }
    return super.getThemes(editor)
  }

  static configuration(options, fullConfig: boolean = false) {
    //解析options，只使用自己相关的
    if (options) {
      let newOptions = {}
      if (fullConfig) {
        if (fullConfig) {
          if (options[DDeiCoreThemeBlack.defaultIns.name]) {
            for (let i in options[DDeiCoreThemeBlack.defaultIns.name]) {
              newOptions[i] = options[DDeiCoreThemeBlack.defaultIns.name][i]
            }
          }
        }
      } else {
        newOptions = options
      }
      if (newOptions && Object.keys(newOptions).length !== 0) {
        let panels = new DDeiCoreThemeBlack(newOptions);
        return panels;
      }
    }
    return DDeiCoreThemeBlack;
  }

  static modify(fn) {
    return DDeiCoreThemeBlack.defaultIns.modify(fn)
  }
}

export default DDeiCoreThemeBlack;
