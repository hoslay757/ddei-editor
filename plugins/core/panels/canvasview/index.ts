import {DDeiPluginBase} from "ddei-framework";
import CanvasView from './CanvasView.vue';

class DDeiCoreCanvasViewPanel extends DDeiPluginBase{
  
  name: string = CanvasView.name
  /**
   * 缺省实例
   */
  static defaultIns: DDeiCoreCanvasViewPanel = new DDeiCoreCanvasViewPanel(null);


  plugins: object[] = [CanvasView]

  getPanels(editor){
    return this.plugins;
  }


  
  static configuration(options, fullConfig: boolean = false) {
    //解析options，只使用自己相关的
    if (options) {
      let newOptions = {}
      if (fullConfig) {
        if (fullConfig) {
          if (options[CanvasView.name]) {
            for (let i in options[CanvasView.name]) {
              newOptions[i] = options[CanvasView.name][i]
            }
          }
        }
      } else {
        newOptions = options
      }
      if (newOptions && Object.keys(newOptions).length !== 0) {
        let panels = new DDeiCoreCanvasViewPanel(newOptions);
        return panels;
      }
    }
    return DDeiCoreCanvasViewPanel;
  }

  static modify(fn) {
    return DDeiCoreCanvasViewPanel.defaultIns.modify(fn)
  }
}

export default DDeiCoreCanvasViewPanel