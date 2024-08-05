import { DDeiLifeCycle, DDeiFuncData, DDeiEditorUtil, DDeiUtil, DDeiFuncCallResult, DDeiEditorEnumBusCommandType, DDeiEnumBusCommandType } from "ddei-framework";
import { debounce } from "lodash";

class DDeiCoreRenderLifeCycle extends DDeiLifeCycle {
  
  name:string = "ddei-core-renderviewer-lifecycle"
  /**
   * 缺省实例
   */
  static defaultIns: DDeiCoreRenderLifeCycle = new DDeiCoreRenderLifeCycle();

  EVENT_CONTROL_VIEW_BEFORE: DDeiFuncData | null = new DDeiFuncData("render-drawshape", 1, (operateType, data, ddInstance, evt) => {
    return this.htmlDrawShape(operateType, data, ddInstance, evt)
  });

  EVENT_BEFORE_CLOSE_FILE: DDeiFuncData | null = new DDeiFuncData("render-hidden", 1, (operateType, data, ddInstance, evt) => {
    return this.hiddenAllHtmlShape(operateType, data, ddInstance, evt)
  });

  EVENT_BEFORE_CHANGE_FILE: DDeiFuncData | null = new DDeiFuncData("render-hidden", 1, (operateType, data, ddInstance, evt) => {
    return this.hiddenAllHtmlShape(operateType, data, ddInstance, evt)
  });

  EVENT_BEFORE_ADD_FILE: DDeiFuncData | null = new DDeiFuncData("render-hidden", 1, (operateType, data, ddInstance, evt) => {
    return this.hiddenAllHtmlShape(operateType, data, ddInstance, evt)
  });

  EVENT_BEFORE_CLOSE_SHEET: DDeiFuncData | null = new DDeiFuncData("render-hidden", 1, (operateType, data, ddInstance, evt) => {
    return this.hiddenAllHtmlShape(operateType, data, ddInstance, evt)
  });

  EVENT_BEFORE_CHANGE_SHEET: DDeiFuncData | null = new DDeiFuncData("render-hidden", 1, (operateType, data, ddInstance, evt) => {
    return this.hiddenAllHtmlShape(operateType, data, ddInstance, evt)
  });

  EVENT_BEFORE_ADD_SHEET: DDeiFuncData | null = new DDeiFuncData("render-hidden", 1, (operateType, data, ddInstance, evt) => {
    return this.hiddenAllHtmlShape(operateType, data, ddInstance, evt)
  });

  EVENT_CONTROL_DEL_AFTER: DDeiFuncData | null = new DDeiFuncData("render-hidden", 1, (operateType, data, ddInstance, evt) => {
    this.deleteHtmlShape(operateType, data, ddInstance, evt)
    return this.hiddenAllHtmlShape(operateType, data, ddInstance, evt)
  });

  static configuration(options) {
    //解析options，只使用自己相关的
    
    if (options && Object.keys(options).length !== 0) {
      let lcs = new DDeiCoreRenderLifeCycle(options);
      return lcs;
    }
    
    return DDeiCoreRenderLifeCycle;
  }

  deleteHtmlShape(operate, data, ddInstance, evt) { 
    let editor = DDeiEditorUtil.getEditorInsByDDei(ddInstance);
    if (editor) {
      let models = data?.models
      for (let i = 0; i < models?.length; i++) {
        if (models[i].modelType != 'DDeiStage' && models[i].modelType != 'DDeiLayer' && models[i] && models[i].id) {
          editor.renderViewerIns[models[i].id] = null
          for (let n = 0; n < editor.renderViewers.length; n++) {
            if (editor.renderViewers[n]?.model?.id == models[i].id) {
              editor.renderViewers.splice(n,1)
              editor.bus.push(DDeiEditorEnumBusCommandType.RefreshEditorParts, {
                parts: ["renderviewers"],
              });
              editor.bus.executeAll();
              break;
            }
          }
        }
      }
    }
  }

  hiddenAllHtmlShape(operate, data, ddInstance, evt) {
    let editor = DDeiEditorUtil.getEditorInsByDDei(ddInstance);
    for (let i in editor.renderViewerIns){
      if (editor.renderViewerIns[i]){
        editor.renderViewerIns[i].style.display = "none"
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
      for (let i = 0; i < models?.length; i++) {
        if (models[i].modelType != 'DDeiStage' && models[i].modelType != 'DDeiLayer' && models[i] && models[i].id) {
          let displayDiv = editor.renderViewerIns[models[i].id]
         
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
          } else {
            //识别是否需要添加控件
            let modelDefine = DDeiEditorUtil.getControlDefine(models[i]);
            if (modelDefine?.viewer) {
              let finded = false
              for (let n = 0; n < editor.renderViewers.length;n++){
                if (editor.renderViewers[n].model.id == models[i].id){
                  finded = true
                  break;
                }
              }
              if (!finded){
                editor.renderViewers.push({ model: models[i], viewer: modelDefine.viewer })
              }
              editor.bus.push(DDeiEditorEnumBusCommandType.RefreshEditorParts, {
                parts: ["renderviewers"],
              });
              
              editor.bus.executeAll();
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

export default DDeiCoreRenderLifeCycle