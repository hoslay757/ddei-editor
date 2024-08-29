import { DDeiLifeCycle, DDeiFuncData, DDeiEditorUtil, DDeiUtil, DDeiFuncCallResult, DDeiEditorEnumBusCommandType, DDeiEnumBusCommandType } from "ddei-framework";
import { debounce } from "lodash";

class DDeiCoreRenderLifeCycle extends DDeiLifeCycle {
  
  name:string = "ddei-core-renderviewer-lifecycle"
  /**
   * 缺省实例
   */
  static defaultIns: DDeiCoreRenderLifeCycle = new DDeiCoreRenderLifeCycle();

  EVENT_CONTROL_VIEW: DDeiFuncData | null = new DDeiFuncData("render-drawshape", 1, (operateType, data, ddInstance, evt) => {
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
          editor.renderViewerElements[models[i].id] = null
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
    for (let i in editor.renderViewerElements){
      if (editor.renderViewerElements[i]){
        editor.renderViewerElements[i].style.display = "none"
      }
    }
  }
  
  htmlDrawShape(operate, data, ddInstance, evt){
    let rs = new DDeiFuncCallResult();
    rs.state = 1;
    let models = data?.models
    let editor = DDeiEditorUtil.getEditorInsByDDei(ddInstance);
    if (editor){
      for (let i = 0; i < models?.length; i++) {
        if (models[i].modelType != 'DDeiStage' && models[i].modelType != 'DDeiLayer' && models[i] && models[i].id) {
          let displayViewer = editor.renderViewerIns[models[i].id]
          if (displayViewer) {
            let displayDiv = editor.renderViewerElements[models[i].id]
            if(operate == 'VIEW'){
              this.refreshView(models[i], displayDiv,data.tempShape, data.composeRender)
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

  //刷新数据
  refreshView(model, shapeElement ,tempShape, composeRender) {
    let stage = model.stage
    let ddInstance = stage.ddInstance
    let editor = DDeiEditorUtil.getEditorInsByDDei(ddInstance)
  
    let render = model.render
    let ruleWeight = 0
    if (stage.render.tempRuleDisplay == 1 || stage.render.tempRuleDisplay == '1') {
      ruleWeight = 15
    }
    //位置
    let canvasEle = document.getElementById(editor.id + "_canvas");
    let canvasDomPos = DDeiUtil.getDomAbsPosition(canvasEle);

    let stageRatio = model.getStageRatio()
    //创建图形，修改图形大小、旋转、边框等属性，以及移动图形位置

    //获取model的绝对位置
    let modelPos = DDeiUtil.getModelsDomAbsPosition([model])

    let rat1 = window.remRatio

    //大小
    shapeElement.style.width = (model.width * rat1) + "px"
    shapeElement.style.height = (model.height * rat1) + "px"

    //旋转,缩放
    let transform = ""
    if (stageRatio > 0 && stageRatio != 1) {
      transform += " scale(" + stageRatio + ")"
    }

    if (model.rotate) {
      transform += " rotate(" + model.rotate + "deg)"
    }
    if (transform) {
      shapeElement.style.transform = transform
    }

    //边框
    let type = tempShape?.border?.type || tempShape?.border?.type == 0 ? tempShape?.border?.type : render.getCachedValue("border.type")
    let opacity = tempShape?.border?.opacity || tempShape?.border?.opacity == 0 ? tempShape?.border?.opacity : render.getCachedValue("border.opacity");
    let width = tempShape?.border?.width || tempShape?.border?.width == 0 ? tempShape?.border?.width : render.getCachedValue("border.width");
    let dash = tempShape?.border?.dash || tempShape?.border?.dash == 0 ? tempShape?.border?.dash : render.getCachedValue("border.dash");
    let color = tempShape?.border?.color || tempShape?.border?.color == 0 ? tempShape?.border?.color : render.getCachedValue("border.color");
    let drawLine = ((type == 1 || type == '1') && width > 0)
    if (drawLine) {
      let type = !dash || dash.length == 0 ? "solid" : "dashed"
      if (!color) {
        color = "var(--border)"
      }
      if (opacity >= 0 && opacity < 1) {
        let value16 = parseInt(opacity * 255)
        color += value16.toString(16);
      }
      shapeElement.style.setProperty("--borderColor", color)
      shapeElement.style.setProperty("--borderType", type)
      shapeElement.style.setProperty("--borderWidth", width + "px")
    }

    shapeElement.style.left = ((modelPos.left + (model.width * stageRatio - model.width) / 2 - 2 - width / 2) * rat1 - canvasDomPos.left - ruleWeight) + "px"
    shapeElement.style.top = ((modelPos.top + (model.height * stageRatio - model.height) / 2 - 2 - width / 2) * rat1 - canvasDomPos.top - ruleWeight) + "px"


    //背景
    //如果被选中，使用选中的颜色填充,没被选中，则使用默认颜色填充
    let fillColor = tempShape?.fill?.color ? tempShape.fill.color : render.getCachedValue("fill.color");
    if (!fillColor) {
      fillColor = DDeiUtil.getStyleValue("canvas-control-background", ddInstance);
    }
    let fillOpacity = tempShape?.fill?.opacity ? tempShape.fill.opacity : render.getCachedValue("fill.opacity");

    let fillType = tempShape?.fill?.type ? tempShape.fill.type : render.getCachedValue("fill.type");
    if (fillType == 1) {

      if (fillOpacity >= 0 && fillOpacity < 1) {
        let value16 = parseInt(fillOpacity * 255)
        fillColor += value16.toString(16);
      }
      shapeElement.style.setProperty("--fillColor", fillColor)
    }
    //圆角
    let round = tempShape?.border?.round ? tempShape?.border?.round : render.getCachedValue("border.round");
    if (round) {
      shapeElement.style.setProperty("--borderRound", round + "px")
    }

    //字体
    let fiFamily = tempShape?.font?.family ? tempShape?.font?.family : render.getCachedValue("font.family");
    let fiSize = tempShape?.font?.size ? tempShape?.font?.size : render.getCachedValue("font.size");
    let fiColor = tempShape?.font?.color ? tempShape?.font?.color : render.getCachedValue("font.color");
    if (!fiColor) {
      fiColor = DDeiUtil.getStyleValue("canvas-control-title", ddInstance);
    }
    if (fiFamily) {
      shapeElement.style.setProperty("--fontFamily", fiFamily)
    }
    if (fiSize) {
      shapeElement.style.setProperty("--fontSize", fiSize+"px")
    }
    if (fiColor) {
      shapeElement.style.setProperty("--fontColor", fiColor)
    }
    //粗体
    let bold = tempShape?.textStyle?.bold ? tempShape?.textStyle?.bold : render.getCachedValue("textStyle.bold");
    if (bold == 1 || bold == '1') {
      shapeElement.style.setProperty("--fontWeight", "bold")
    }
    //斜体
    let italic = tempShape?.textStyle?.italic ? tempShape?.textStyle?.italic : render.getCachedValue("textStyle.italic"); 
    if (italic == 1 || italic == '1') {
      shapeElement.style.setProperty("--fontStyle", "italic")
    }
    //下划线
    let underline = tempShape?.textStyle?.underline ? tempShape?.textStyle?.underline : render.getCachedValue("textStyle.underline");
    if (underline == '1' || underline == 1) {
      shapeElement.style.setProperty("--textDecoration", "underline")
    }else{
      //删除线
      let deleteline = tempShape?.textStyle?.deleteline ? tempShape?.textStyle?.deleteline : render.getCachedValue("textStyle.deleteline");
      if (deleteline == '1' || deleteline == 1) {
        shapeElement.style.setProperty("--textDecoration", "line-through")
      }else{
        //上画线
        let overline = tempShape?.textStyle?.topline ? tempShape?.textStyle?.topline : render.getCachedValue("textStyle.topline");
        if (overline == '1' || overline == 1) {
          shapeElement.style.setProperty("--textDecoration", "overline")
        }
      }
    }
    
    //文本背景色
    let textBgColor = tempShape?.textStyle?.bgcolor ? tempShape?.textStyle?.bgcolor : render.getCachedValue("textStyle.bgcolor");
    if (textBgColor) {
      shapeElement.style.setProperty("--textBgColor", textBgColor)
    }
    //zIndex
    shapeElement.style.zIndex = model.render.tempZIndex

    shapeElement.style.display = "block"
    
    
    if (model.baseModelType == 'DDeiContainer') {
      for (let m = 0; m < model.midList?.length; m++) {
        let key = model.midList[m];
        let item = model.models.get(key);
        if(item?.render){
          item.render.tempZIndex = model.render.tempZIndex + (m + 1)
          item.render.drawShape(tempShape, composeRender)
        }
      }   
    }
    let displayViewer = editor.renderViewerIns[model.id]
    if (displayViewer.refreshView) {
      displayViewer.refreshView(model, shapeElement, tempShape, composeRender)
    }
  }


  // loadSubRenderViewers(model, shapeElement, tempShape, composeRender):boolean {
  //   let modelDefine = DDeiEditorUtil.getControlDefine(model);
  //   let returnValue = false
  //   let stage = model.stage
  //   let ddInstance = stage.ddInstance
  //   let editor = DDeiEditorUtil.getEditorInsByDDei(ddInstance)
  //   if (modelDefine?.viewer) {
  //     let finded = false
  //     for (let n = 0; n < editor.renderViewers.length; n++) {
  //       if (editor.renderViewers[n].model.id == model.id) {
  //         finded = true
  //         break;
  //       }
  //     }
  //     if (!finded) {
  //       editor.renderViewers.push({ model: model, viewer: modelDefine.viewer })
  //       returnValue = true
  //     }
      
  //     let displayDiv = editor.renderViewerElements[model.id]
  //     this.refreshView(model, displayDiv, tempShape, composeRender)
  //   }
  //   if (model.baseModelType == 'DDeiContainer') {
  //     model.models.forEach(subModel => {
  //       if (this.loadSubRenderViewers(subModel, shapeElement, tempShape, composeRender)) {
  //         returnValue = true
  //       }
  //     });
  //   }
  //   return returnValue
  // }
}


export default DDeiCoreRenderLifeCycle