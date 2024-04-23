import {DDeiPluginBase} from "ddei-framework1";
import { loadControlByFrom, loadAndSortGroup } from "./toolgroup"
const control_ctx = import.meta.glob('./control/**', { eager: true })
const group_ctx = import.meta.glob('./group/**', { eager: true })

class DDeiCoreControls extends DDeiPluginBase{
  /**
   * 缺省实例
   */
  static defaultIns:DDeiCoreControls = new DDeiCoreControls(null);

  controls:Map<string,object>  = new Map()

  getControls(editor) {
    //获取扩展options
    let extOptions = this.getOptions();
    //加载控件定义
    let controls: Map<string, object> = new Map();
    let controls1 = new Map(editor.controls);
    for (let i in control_ctx) {
      let control = control_ctx[i].default;
      if (control) {
        controls.set(control.id, control);
        controls1.set(control.id, control);
        
        if (extOptions && extOptions[control.id]){
          for (let x in extOptions[control.id]){
            control.define[x] = extOptions[control.id][x]
          }
        }
      }
    }

    //初始化控件定义
    controls.forEach(control => {
      loadControlByFrom(controls1, control)
    });
    this.controls = controls;
    return controls
  }

  getGroups(editor) {
    if (!this.controls){
      this.getControls(editor);
    }
    //加载分组定义
    let groups = [];
    for (let path in group_ctx) {
      groups.push(group_ctx[path].default);
    }
    
    loadAndSortGroup(groups, this.controls)
    return groups;
  } 

  static configuraton(options) {
    if (options){
      let controls = new DDeiCoreControls(options);
      return controls;
    }
    return DDeiCoreControls;
  }
}

export {DDeiCoreControls}
export default DDeiCoreControls