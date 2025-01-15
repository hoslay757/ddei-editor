import {DDeiEnumBusCommandType} from "ddei-framework";
import {DDeiMenuBase} from "ddei-framework";
/**
 * 采用系统避障策略
 */
class MenuSysDefaultAutoObi extends DDeiMenuBase {


  name: string = "ddei-core-menu-sysdefault-auto-obi"


  /**
   * 缺省实例
   */
  static defaultIns: MenuSysDefaultAutoObi = new MenuSysDefaultAutoObi();

  defaultOptions: object = {
    'label': 'ddei.sysDefaultAutoObi',
    'disabled': false
  }



  static configuration(options, fullConfig: boolean = false) {
    //解析options，只使用自己相关的
    if (options) {
      let newOptions = {}
      if (fullConfig) {
        if (fullConfig) {
          if (options[MenuSysDefaultAutoObi.defaultIns.name]) {
            for (let i in options[MenuSysDefaultAutoObi.defaultIns.name]) {
              newOptions[i] = options[MenuSysDefaultAutoObi.defaultIns.name][i]
            }
          }
        }
      } else {
        newOptions = options
      }
      if (newOptions && Object.keys(newOptions).length !== 0) {
        let panels = new MenuSysDefaultAutoObi(newOptions);
        return panels;
      }
    }
    return MenuSysDefaultAutoObi;
  }

  static modify(fn) {
    return MenuSysDefaultAutoObi.defaultIns.modify(fn)
  }
  /**
   * 执行的方法
   */
  action(model: object, evt: Event): void {
    if (model?.baseModelType == 'DDeiLine') {
      delete model.autoObiPolicy
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
    if (!this.disabled && model?.baseModelType == 'DDeiLine' 
      && ((model.stage.ddInstance.GLOBAL_AUTO_OBI && model.autoObiPolicy == 2) || (!model.stage.ddInstance.GLOBAL_AUTO_OBI && model.autoObiPolicy == 1))) {
      return true
    }
    return false;
  }

}

export default MenuSysDefaultAutoObi;
