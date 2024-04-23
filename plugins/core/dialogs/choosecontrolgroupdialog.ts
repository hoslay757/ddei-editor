import {DDeiPluginBase} from "ddei-framework";
import ChooseControlGroupDialog from './ChooseControlGroupDialog.vue';

class DDeiCoreChooseControlGroupDialog extends DDeiPluginBase{
  name: string = ChooseControlGroupDialog.name
  /**
   * 缺省实例
   */
  static defaultIns: DDeiCoreChooseControlGroupDialog = new DDeiCoreChooseControlGroupDialog(null);


  plugins: object[] = [ChooseControlGroupDialog]

  getDialogs(editor){
    return this.plugins;
  }

  static configuraton(options, fullConfig: boolean = false) {
    //解析options，只使用自己相关的
    if (options) {
      let newOptions = {}
      if (fullConfig) {
        if (fullConfig) {
          if (options[ChooseControlGroupDialog.name]) {
            for (let i in options[ChooseControlGroupDialog.name]) {
              newOptions[i] = options[ChooseControlGroupDialog.name][i]
            }
          }
        }
      } else {
        newOptions = options
      }
      if (newOptions && Object.keys(newOptions).length !== 0) {
        let panels = new DDeiCoreChooseControlGroupDialog(newOptions);
        return panels;
      }
    }
    return DDeiCoreChooseControlGroupDialog;
  }
}

export default DDeiCoreChooseControlGroupDialog