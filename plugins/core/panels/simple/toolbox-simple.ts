import {DDeiPluginBase} from "ddei-framework";
import ToolboxSimple from './ToolboxSimple.vue';

class DDeiCoreToolboxSimplePanel extends DDeiPluginBase{
  name: string = ToolboxSimple.name
  /**
   * 缺省实例
   */
  static defaultIns: DDeiCoreToolboxSimplePanel = new DDeiCoreToolboxSimplePanel({
    direct:1,//方向，1纵向，2横向
    position:8,//位置1-9顺时针，1为左上角，9为中心
    drag:1,//是否允许拖拽位置
    chooseCreate:0,//是否在选择控件时创建一个控件
    dragCreate:0,//是否在拖拽时创建控件
    groups:[
      {
        editMode: 1,
        desc:"选择",
        icon: `<svg class="icon" style="width: 28px; height: 28px;margin-left:-1px;margin-top:2px; " aria-hidden="true">
          <use xlink: href = "#icon-selector">< /use>
        </svg>`
      },
      {
        editMode: 2,
        desc: "平移画布",
        icon: `<svg class="icon" style="width: 28px; height: 28px;margin-left:-1px;margin-top:2px; " aria-hidden="true">
          <use xlink: href = "#icon-hand">< /use>
        </svg>`
      },
      {
        controls: [
          "100103"
        ]
      },
      {
        controls: [
          "100001",
          "100002",
          "100003",
          "100004",
          "100005",
          "100006",
          "100007",
        ]
      },
      {
        controls: [
          "100040",
          "100041",
          "100050",
          "100051"
        ]
      },
      {
        editMode:4,
        desc: "连线",
        controls: [
          "100401"
        ]
      }
    ]
  });

  plugins: object[] = [ToolboxSimple]

  getPanels(editor){
    return this.plugins;
  }


  
  static configuration(options, fullConfig: boolean = false) {
    //解析options，只使用自己相关的
    if (options) {
      let newOptions = {}
      if (fullConfig) {
        if (fullConfig) {
          if (options[ToolboxSimple.name]) {
            for (let i in options[ToolboxSimple.name]) {
              newOptions[i] = options[ToolboxSimple.name][i]
            }
          }
        }
      } else {
        newOptions = options
      }
      if (newOptions && Object.keys(newOptions).length !== 0) {
        let panels = new DDeiCoreToolboxSimplePanel(newOptions);
        return panels;
      }
    }
    return DDeiCoreToolboxSimplePanel;
  }
}

export default DDeiCoreToolboxSimplePanel