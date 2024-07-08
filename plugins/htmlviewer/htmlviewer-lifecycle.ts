import { DDeiLifeCycle, DDeiFuncData, DDeiEditorUtil, DDeiUtil, DDeiFuncCallResult, DDeiEditorState } from "ddei-framework";
import { debounce } from "lodash";

class DDeiExtHtmlViewerLifeCycle extends DDeiLifeCycle {
  
  name:string = "ddei-ext-htmlviewer-lifecycle"
  /**
   * 缺省实例
   */
  static defaultIns: DDeiExtHtmlViewerLifeCycle = new DDeiExtHtmlViewerLifeCycle({
    matchField:"code"
  });

  EVENT_CONTROL_VIEW_BEFORE: DDeiFuncData | null = new DDeiFuncData("htmlviewer-drawshape", 1, (operateType, data, ddInstance, evt) => {
    return this.htmlDrawShape(operateType, data, ddInstance, evt)
  });

  static configuration(options) {
    //解析options，只使用自己相关的
    
    if (options && Object.keys(options).length !== 0) {
      let lcs = new DDeiExtHtmlViewerLifeCycle(options);
      return lcs;
    }
    
    return DDeiExtHtmlViewerLifeCycle;
  }

  installed(editor:DDeiEditorState):void{
    //添加viewer到editor
    for(let i in this.options){
      if (this.options[i] && this.options[i].viewer){
        this.options[i].matchField = this.options.matchField
        editor.renderViewers.push(this.options[i])
      }
    }
  }
  
  htmlDrawShape(operate, data, ddInstance, evt){
    let rs = new DDeiFuncCallResult();
    rs.state = 1;
    let models = data?.models
    let editor = DDeiEditorUtil.getEditorInsByDDei(ddInstance);
    if (editor){
      let canvasEle = document.getElementById(editor.id + "_canvas");
      let canvasDomPos = DDeiUtil.getDomAbsPosition(canvasEle);
      let field = this.options.matchField
      for (let i = 0; i < models?.length; i++) {
        if (models[i][field]) {
          let displayDiv = editor.renderViewerIns[models[i][field]]
          if (displayDiv) {
            if(operate == 'VIEW'){
              let ruleWeight = 0
              
              if (ddInstance.stage.render.tempRuleDisplay == 1 || ddInstance.stage.render.tempRuleDisplay == '1'){
                ruleWeight = 15
              }
              
              let modelPos = DDeiUtil.getModelsDomAbsPosition([models[i]])
              let rat1 = window.remRatio
              displayDiv.style.position = 'absolute'
              displayDiv.style.left = (modelPos.left * rat1 - canvasDomPos.left - ruleWeight) + "px"
              displayDiv.style.top = (modelPos.top * rat1 - canvasDomPos.top - ruleWeight) + "px"
              displayDiv.style.display = "block"
              displayDiv.style.zIndex = 300;
              displayDiv.style.width = (modelPos.width * rat1) + "px";
              displayDiv.style.height = (modelPos.height * rat1) + "px";
              displayDiv.style.pointerEvents = "none"
              rs.state = -1;
              return rs
            }else if(operate == 'VIEW-HIDDEN'){
              displayDiv.style.display = 'none'
              rs.state = -1;
              return rs
            }
          }
        }
      }
    }

    return rs;
  }
}

export default DDeiExtHtmlViewerLifeCycle