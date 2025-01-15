import {DDeiEnumBusCommandType} from "ddei-framework";
import {DDeiMenuBase} from "ddei-framework";
/**
 * 取消/开启 自动避障
 */
class MenuDisabledAutoObi extends DDeiMenuBase {


  name: string = "ddei-core-menu-disabled-auto-obi"


  /**
   * 缺省实例
   */
  static defaultIns: MenuDisabledAutoObi = new MenuDisabledAutoObi();

  defaultOptions: object = {
    'label': 'ddei.disabledAutoObi',
    'disabled': false
  }



  static configuration(options, fullConfig: boolean = false) {
    //解析options，只使用自己相关的
    if (options) {
      let newOptions = {}
      if (fullConfig) {
        if (fullConfig) {
          if (options[MenuDisabledAutoObi.defaultIns.name]) {
            for (let i in options[MenuDisabledAutoObi.defaultIns.name]) {
              newOptions[i] = options[MenuDisabledAutoObi.defaultIns.name][i]
            }
          }
        }
      } else {
        newOptions = options
      }
      if (newOptions && Object.keys(newOptions).length !== 0) {
        let panels = new MenuDisabledAutoObi(newOptions);
        return panels;
      }
    }
    return MenuDisabledAutoObi;
  }

  static modify(fn) {
    return MenuDisabledAutoObi.defaultIns.modify(fn)
  }
  /**
   * 执行的方法
   */
  action(model: object, evt: Event): void {
    if (model?.baseModelType == 'DDeiLine') {
      model.disabledAutoObi = 1
      let ddInstance = model.stage.ddInstance
      
      model.refreshLinePoints()
      ddInstance.bus.push(DDeiEnumBusCommandType.RefreshShape);
      ddInstance.bus.executeAll();
      
    }
  }

  /**
   * 判定是否显示的方法
   */
  isVisiable(model: object): boolean {
    //当前控件为表格控件，TODO 或者布局方式为表格的容器控件
    if (!this.disabled && model?.baseModelType == 'DDeiLine' && !model.disabledAutoObi) {
      return true
    }
    return false;
  }

}

export default MenuDisabledAutoObi;
