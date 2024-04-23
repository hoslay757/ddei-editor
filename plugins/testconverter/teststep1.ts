import {DDeiConverterBase} from "ddei-framework";

class DDeiExtTestStep1Converter extends DDeiConverterBase {
  
  name: string = "ddei-ext-test-step1-converter"

  sort:number = 2

  /**
   * 缺省实例
   */
  static defaultIns: DDeiExtTestStep1Converter = new DDeiExtTestStep1Converter(null);

  /**
   * 判定是否生效
   */
  isEnable(fileData: object): boolean{
    return true;
  }

  /**
   * 输入
   */
  input(fileData: object): object{
    console.log("convert1")
    return fileData;
  }

  /**
   * 输出
   */
  output(fileData: object): object{
    console.log("convert3")
    return fileData;
  }

  static configuraton(options, fullConfig: boolean = false) {
    //解析options，只使用自己相关的
    if (options) {
      let newOptions = Object.assign({}, {}, DDeiExtTestStep1Converter.defaultIns.defaultOptions)
      if (fullConfig) {
        if (fullConfig) {
          if (options[DDeiExtTestStep1Converter.defaultIns.name]) {
            for (let i in options[DDeiExtTestStep1Converter.defaultIns.name]) {
              newOptions[i] = options[DDeiExtTestStep1Converter.defaultIns.name][i]
            }
          }
        }
      } else {
        for (let i in options) {
          newOptions[i] = options[i]
        }
      }
      if (newOptions && Object.keys(newOptions).length !== 0) {
        let layouts = new DDeiExtTestStep1Converter(newOptions);
        return layouts;
      }
    }
    return DDeiExtTestStep1Converter;
  }
}
export {DDeiExtTestStep1Converter}
export default DDeiExtTestStep1Converter;