import {DDeiPluginBase} from "ddei-framework";
import TopMenuSimple from './TopMenuSimple.vue';
import { DDeiCoreToolboxSimplePanel } from ".";

class DDeiCoreTopMenuSimplePanel extends DDeiPluginBase{
  name: string = TopMenuSimple.name
  /**
   * 缺省实例
   */
  static defaultIns: DDeiCoreTopMenuSimplePanel = new DDeiCoreTopMenuSimplePanel({
    direct:2,//方向，1纵向，2横向
    position:2,//位置1-9顺时针，1为左上角，9为中心
    drag:1//是否允许拖拽位置
  });

  plugins: object[] = [TopMenuSimple]

  getPanels(editor){
    return this.plugins;
  }


  
  static configuration(options, fullConfig: boolean = false) {
    //解析options，只使用自己相关的
    if (options) {
      let newOptions = {}
      if (fullConfig) {
        if (fullConfig) {
          if (options[TopMenuSimple.name]) {
            for (let i in options[TopMenuSimple.name]) {
              newOptions[i] = options[TopMenuSimple.name][i]
            }
          }
        }
      } else {
        newOptions = options
      }
      if (newOptions && Object.keys(newOptions).length !== 0) {
        let panels = new DDeiCoreTopMenuSimplePanel(newOptions);
        return panels;
      }
    }
    return DDeiCoreTopMenuSimplePanel;
  }

  static modify(fn) {
    return DDeiCoreToolboxSimplePanel.defaultIns.modify(fn)
  }
}

export default DDeiCoreTopMenuSimplePanel