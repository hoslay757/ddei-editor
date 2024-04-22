import {DDeiPluginBase} from "ddei-framework1";

class DDeiExtFontTest extends DDeiPluginBase {
  
  /**
   * 缺省实例
   */
  static defaultIns: DDeiExtFontTest = new DDeiExtFontTest(null);


  getFonts(editor) {
    let font_ctx = import.meta.glob(
      "./fonts/*.ttf", { eager: true }
    )
    let fontOptions = this.getOptions();
    let fonts = []
    for (let path in font_ctx) {
      let font = font_ctx[path].default
      let fontName = font.substring(font.lastIndexOf("/")+1,font.lastIndexOf("."))
      if (fontName.indexOf("-") != -1){
        fontName = fontName.substring(0, fontName.lastIndexOf("-"))
      }
      let fontData = { "ch": fontName, "en": fontName, "font": font }
      if (fontOptions && fontOptions[fontName]){
        for (let x in fontOptions){
          fontData[x] = fontOptions[x]
        }
      }
      fonts.push(fontData)
    }
    

    return fonts;
  }

  static configuraton(options) {
    let core = new DDeiExtFontTest(options);
    return core;
  }
}
export {DDeiExtFontTest}
export default DDeiExtFontTest;