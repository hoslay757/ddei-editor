import {DDeiPluginBase} from "ddei-framework";
import UserRegistryDialog from './UserRegistryDialog.vue';

class DDeiCoreUserRegistryDialog extends DDeiPluginBase{
  name: string = UserRegistryDialog.name

  /**
   * 缺省实例
   */
  static defaultIns: DDeiCoreUserRegistryDialog = new DDeiCoreUserRegistryDialog(null);


  plugins: object[] = [UserRegistryDialog]

  getDialogs(editor){
    return this.plugins;
  }

  static configuraton(options, fullConfig: boolean = false) {
    //解析options，只使用自己相关的
    if (options) {
      let newOptions = {}
      if (fullConfig) {
        if (fullConfig) {
          if (options[UserRegistryDialog.name]) {
            for (let i in options[UserRegistryDialog.name]) {
              newOptions[i] = options[UserRegistryDialog.name][i]
            }
          }
        }
      } else {
        newOptions = options
      }
      if (newOptions && Object.keys(newOptions).length !== 0) {
        let panels = new DDeiCoreUserRegistryDialog(newOptions);
        return panels;
      }
    }
    return DDeiCoreUserRegistryDialog;
  }
}

export default DDeiCoreUserRegistryDialog