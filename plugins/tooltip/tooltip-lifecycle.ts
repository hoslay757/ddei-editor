import { DDeiLifeCycle, DDeiFuncData, DDeiEditorUtil, DDeiUtil, DDeiFuncCallResult, DDeiEditorState } from "ddei-framework";
import { debounce } from "lodash";

class DDeiExtTooltipLifeCycle extends DDeiLifeCycle {
  
  name:string = "ddei-ext-tooltip-lifecycle"
  /**
   * 缺省实例
   */
  static defaultIns: DDeiExtTooltipLifeCycle = new DDeiExtTooltipLifeCycle({
    time:400
  });

  static configuration(options, fullConfig: boolean = false) {
    //解析options，只使用自己相关的
    if (options) {
      let newOptions = {}
      if (fullConfig) {
        if (fullConfig) {
          if (options[DDeiExtTooltipLifeCycle.name]) {
            for (let i in options[DDeiExtTooltipLifeCycle.name]) {
              newOptions[i] = options[DDeiExtTooltipLifeCycle.name][i]
            }
          }
        }
      } else {
        newOptions = options
      }
      if (newOptions && Object.keys(newOptions).length !== 0) {
        let panels = new DDeiExtTooltipLifeCycle(newOptions);
        return panels;
      }
    }
    return DDeiExtTooltipLifeCycle;
  }

  EVENT_MOUSE_MOVE_IN_CONTROL: DDeiFuncData | null = new DDeiFuncData("tooltip-show", 1, (operateType, data, ddInstance, evt)=>{
    this.showTooltip(operateType, data, ddInstance, evt)
  });

  EVENT_MOUSE_MOVE_IN_LAYER: DDeiFuncData | null = new DDeiFuncData("tooltip-hidden", 1, this.mouseOperating);

  EVENT_CLOSE_FILE_AFTER: DDeiFuncData | null = new DDeiFuncData("tooltip-close", 1, this.mouseOperating);
  
  showTooltip(operateType, data, ddInstance, evt): DDeiFuncCallResult {
    
    let editor = DDeiEditorUtil.getEditorInsByDDei(ddInstance);
    let stage = editor.ddInstance?.stage
    //如果悬停时间大于400，显示tooltip
    if (stage?.render?.operateState == 0 && data.models?.length > 0 && data.models[0]){
     
      if (editor.tempHoverModel != data.models[0]){
        
        if (!editor.tempHoverX || !editor.tempHoverY || Math.abs(editor.tempHoverX - data.x) > 10 || Math.abs(editor.tempHoverY - data.y) > 10){
          //隐藏弹出框
          if (editor.tempPopData && editor.tempPopData['ddei-ext-dialog-tooltip']) {
            DDeiEditorUtil.closeDialog(editor, 'ddei-ext-dialog-tooltip', true)
          }
          editor.tempHoverModel = data.models[0]
          editor.tempHoverX = data.x
          editor.tempHoverY = data.y
          editor.tempHoverTime = new Date().getTime()
        }
      }else{
        if(new Date().getTime() - editor.tempHoverTime >= this.options.time){
          data.model = editor.tempHoverModel
   
          this.showTooltipDialog(operateType, data, ddInstance, evt)
        }
      }
    }
    //关闭tooltip
    else{
    
      //隐藏弹出框
      if (editor.tempPopData && editor.tempPopData['ddei-ext-dialog-tooltip']) {
        DDeiEditorUtil.closeDialog(editor, 'ddei-ext-dialog-tooltip', true)
      }
      delete editor.tempHoverModel
      delete editor.tempHoverTime
      delete editor.tempHoverX
      delete editor.tempHoverY
    }
    
    

  }

  /**
   * 鼠标进入控件
   */
  showTooltipDialog(operateType, data, ddInstance, evt,options): DDeiFuncCallResult {
    let editor = DDeiEditorUtil.getEditorInsByDDei(ddInstance);
    if (!editor.tempPopData || !editor.tempPopData['ddei-ext-dialog-tooltip'] || editor.tempPopData['ddei-ext-dialog-tooltip'].model != data.model) {
      //隐藏弹出框
      DDeiEditorUtil.closeDialog(editor, 'ddei-ext-dialog-tooltip', true)
      //显示弹出框
      let editorEle = document.getElementById(editor.id);
      let editorDomPos = DDeiUtil.getDomAbsPosition(editorEle);
      let modelPos = DDeiUtil.getModelsDomAbsPosition([data.model])
      let left = modelPos.left - editorDomPos.left+modelPos.width+20
      let top = modelPos.top - editorDomPos.top - 20
      DDeiEditorUtil.showDialog(editor, 'ddei-ext-dialog-tooltip', {
        group: "canvas-pop-tooltip",
        model: data.model
      }, { type: 99, left: left, top: top, hiddenMask: true }, null, true, true)
    }
    
  }

  mouseOperating(operateType, data, ddInstance, evt): DDeiFuncCallResult {
    let editor = DDeiEditorUtil.getEditorInsByDDei(ddInstance);
    if (editor.tempPopData && editor.tempPopData['ddei-ext-dialog-tooltip']) {
      DDeiEditorUtil.closeDialog(editor, 'ddei-ext-dialog-tooltip', true)
      
    }
    delete editor.tempHoverModel
    delete editor.tempHoverTime
    delete editor.tempHoverX
    delete editor.tempHoverY
  }

}

export default DDeiExtTooltipLifeCycle