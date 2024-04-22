import {DDeiConverterBase} from "ddei-framework1";

class DDeiExtTestStep2Converter extends DDeiConverterBase {
  name:string = "ddei-ext-test-step2-converter"

  sort: number = 1

  /**
   * 缺省实例
   */
  static defaultIns: DDeiExtTestStep2Converter = new DDeiExtTestStep2Converter(null);

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
    console.log("convert2")
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
      let newOptions = Object.assign({}, {}, DDeiExtTestStep2Converter.defaultIns.defaultOptions)
      if (fullConfig) {
        if (fullConfig) {
          if (options[DDeiExtTestStep2Converter.defaultIns.name]) {
            for (let i in options[DDeiExtTestStep2Converter.defaultIns.name]) {
              newOptions[i] = options[DDeiExtTestStep2Converter.defaultIns.name][i]
            }
          }
        }
      } else {
        for (let i in options) {
          newOptions[i] = options[i]
        }
      }
      if (newOptions && Object.keys(newOptions).length !== 0) {
        let layouts = new DDeiExtTestStep2Converter(newOptions);
        return layouts;
      }
    }
    return DDeiExtTestStep2Converter;
  }
}
export {DDeiExtTestStep2Converter}
export default DDeiExtTestStep2Converter;