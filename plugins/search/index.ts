import {DDeiPluginBase} from "ddei-framework";
import SearchDialog from "./searchdialog"
import SearchPanel from "./searchpanel"
import DDeiExtSearchHotkeys from "./hotkeys"
import DDeiExtSearchLifeCycle from "./search-lifecycle"

import DDeiExtQuickStyle from "@ddei/quickstyle"
import { DDeiExtQuickControl } from "@ddei/quickcontrol"
import { DDeiCoreToolboxSimplePanel } from "@ddei/core"


class DDeiExtSearch extends DDeiPluginBase {
  type: string = "package"

  order: number = 2

  static order: number = 2

  
  /**
   * 缺省实例
   */
  static defaultIns: DDeiExtSearch = new DDeiExtSearch(null);

  dialogs: object = SearchDialog;

  panels: object = SearchPanel;

  hotkeys: object = DDeiExtSearchHotkeys;

  lifecyclies: object = DDeiExtSearchLifeCycle;

  // initConfig:object|null = {
  //   //覆盖
  //   rewrite:{
  //     currentLayout: "ddei-core-layout-simple",
  //     config:{
  //       mark:"",
  //       grid:1,
  //       initData:[
  //         {
  //           id: "act_1",
  //           model: "102010",
  //           type: "emp_1",
  //           text: "第一步",
  //           border: { color: "yellow", dash: [10, 10, 5, 5], width: 5 },
  //           fill: { color: "grey" },
  //         },
  //         {
  //           id: "act_2",
  //           model: "102010",
  //           type: "emp_2",
  //           width: 200,
  //           height: 100,
  //           text: "第二步",
  //           offsetY: -70,
  //         }
  //       ]
  //     }
  //   },
  //   //追加
  //   append:{
  //     extensions:[
  //       DDeiExtQuickControl,
  //       DDeiCoreToolboxSimplePanel.configuration({
  //         direct: 2,//方向，1纵向，2横向
  //         position: 2,//位置1-9顺时针，1为左上角，9为中心
  //         drag: 0,//是否允许拖拽位置
  //         chooseCreate: 1,//是否在选择控件时创建一个控件
  //         groups: [
  //           {
  //             editMode: 1,
  //             desc: "选择",
  //             icon: `<svg class="icon" style="width: 28px; height: 28px;margin-left:-1px;margin-top:2px; " aria-hidden="true">
  //         <use xlink: href = "#icon-a-ziyuan432">< /use>
  //       </svg>`
  //           },
  //           {
  //             editMode: 2,
  //             desc: "平移画布",
  //             icon: `<svg class="icon" style="width: 28px; height: 28px;margin-left:-1px;margin-top:2px; " aria-hidden="true">
  //         <use xlink: href = "#icon-a-ziyuan431">< /use>
  //       </svg>`
  //           },
  //           {
  //             controls: [
  //               "100103"
  //             ]
  //           },
  //           {
  //             controls: [
  //               "100001",
  //               "100002",
  //               "100003",
  //               "100004",
  //               "100005",
  //               "100006",
  //               "100007",
  //             ]
  //           },
  //           {
  //             controls: [
  //               "100040",
  //               "100041",
  //               "100050",
  //               "100051"
  //             ]
  //           },
  //           {
  //             editMode: 4,
  //             desc: "连线",
  //             controls: [
  //               "100401"
  //             ]
  //           }
  //         ]
  //       })
  //     ]
  //   },
  //   //移除
  //   remove: {
  //     extensions: [
  //       DDeiExtQuickStyle
  //     ]
  //   }
  // }

  // //获取默认配置
  // static getInitConfig() {
  //   return DDeiExtSearch.defaultIns.getInitConfig()
  // }

  getDialogs(editor) {
    if (DDeiPluginBase.isSubclass(this.dialogs, DDeiPluginBase)) {
      return this.dialogs.defaultIns.getDialogs(editor);
    } else if (this.dialogs instanceof DDeiPluginBase) {
      return this.dialogs.getDialogs(editor);
    }
  }

  getPanels(editor) {
    if (DDeiPluginBase.isSubclass(this.panels, DDeiPluginBase)) {
      return this.panels.defaultIns.getPanels(editor);
    } else if (this.panels instanceof DDeiPluginBase) {
      return this.panels.getPanels(editor);
    }
  }

  getHotKeys(editor) {
    if (DDeiPluginBase.isSubclass(this.hotkeys, DDeiPluginBase)) {
      return this.hotkeys.defaultIns.getHotKeys(editor);
    } else if (this.hotkeys instanceof DDeiPluginBase) {
      return this.hotkeys.getHotKeys(editor);
    }
  }

  getLifeCyclies(editor) {
    if (DDeiPluginBase.isSubclass(this.lifecyclies, DDeiPluginBase)) {
      return this.lifecyclies.defaultIns.getLifeCyclies(editor);
    } else if (this.lifecyclies instanceof DDeiPluginBase) {
      return this.lifecyclies.getLifeCyclies(editor);
    }
  }

  
  


  static configuration(options) {
    let core = new DDeiExtSearch(options);
    core.dialogs = core.dialogs.configuration(options, true)
    core.panels = core.panels.configuration(options, true)
    core.hotkeys = core.hotkeys.configuration(options, true)
    core.lifecyclies = core.lifecyclies.configuration(options, true)
    return core;
  }
}

export {DDeiExtSearch}
export * from "./searchdialog"
export * from "./searchpanel"
export * from "./hotkeys"
export * from "./search-lifecycle"
export default DDeiExtSearch;