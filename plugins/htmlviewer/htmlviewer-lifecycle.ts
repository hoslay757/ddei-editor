import { DDeiLifeCycle, DDeiFuncData, DDeiEditorUtil, DDeiUtil, DDeiFuncCallResult, DDeiEditorState, DDeiEditorEnumBusCommandType } from "ddei-framework";
import { createVNode,toRaw ,markRaw } from "vue";

class DDeiExtHtmlViewerLifeCycle extends DDeiLifeCycle {
  
  name:string = "ddei-ext-htmlviewer-lifecycle"
  /**
   * 缺省实例
   */
  static defaultIns: DDeiExtHtmlViewerLifeCycle = new DDeiExtHtmlViewerLifeCycle({
    matchField:"code"
  });

  EVENT_CONTROL_VIEW: DDeiFuncData | null = new DDeiFuncData("htmlviewer-drawshape", 1, (operateType, data, ddInstance, evt) => {
    return this.htmlDrawShape(operateType, data, ddInstance, evt)
  });

  installed(editor: DDeiEditor) {
    for(let i in this.options){
      if(i != 'matchField'){
        if (this.options[i]['viewer']){
          this.options[i]['viewer'] = markRaw(this.options[i]['viewer'])
        }
      }
    }
  }

  static configuration(options) {
    //解析options，只使用自己相关的
    
    if (options && Object.keys(options).length !== 0) {
      let lcs = new DDeiExtHtmlViewerLifeCycle(options);
      return lcs;
    }
    
    return DDeiExtHtmlViewerLifeCycle;
  }
  
  htmlDrawShape(operate, data, ddInstance, evt){
    let models = data?.models
    let editor = DDeiEditorUtil.getEditorInsByDDei(ddInstance);
    if (editor){
      let field = this.options.matchField
      for (let i = 0; i < models?.length; i++) {
        let model = models[i]
        if (model && model[field]) {
          let option = this.options[model[field]]
          if (option && option.viewer){
            if (model.render.tempCanvas){
              model.render.tempCanvas.remove()
            }
            if (model.render.viewerOption != option && toRaw(model.render.viewerOption) != option){
              //如果已存在则销毁
              DDeiUtil.removeRenderViewer(model)
              model.render.viewerOption = option
              model.render.viewer = option.viewer
            }
          }
        }
      }
    }
  }
}

export default DDeiExtHtmlViewerLifeCycle