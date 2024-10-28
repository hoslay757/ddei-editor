import {DDeiPluginBase} from "ddei-framework";
import { loadControlByFrom, loadAndSortGroup } from "@/editor/grouputil"
import { cloneDeep } from "lodash"
const control_ctx = import.meta.glob('./control/**', { eager: true })
const group_ctx = import.meta.glob('./group/**', { eager: true })

class DDeiExtUMLControls extends DDeiPluginBase{
  /**
   * 缺省实例
   */
  static defaultIns:DDeiExtUMLControls = new DDeiExtUMLControls(null);

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
        let c = cloneDeep(control)
        controls.set(control.id, c);
        controls1.set(control.id, c);

        if (extOptions && extOptions[control.id]) {
          for (let x in extOptions[control.id]) {
            c.define[x] = extOptions[control.id][x]
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
    
    loadAndSortGroup(groups, editor.controls)
    return groups;
  } 

  static configuration(options) {
    if (options){
      let controls = new DDeiExtUMLControls(options);
      return controls;
    }
    return DDeiExtUMLControls;
  }
}


export default DDeiExtUMLControls