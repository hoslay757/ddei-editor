import { DDeiLifeCycle, DDeiEnumControlState,DDeiFuncData, DDeiEditorUtil, DDeiUtil, DDeiFuncCallResult } from "ddei-framework";
import {debounce} from 'lodash';

class DDeiExtSearchLifeCycle extends DDeiLifeCycle {
  
  name:string = "quickcontrol-ext-lifecycle"
  /**
   * 缺省实例
   */
  static defaultIns: DDeiExtSearchLifeCycle = new DDeiExtSearchLifeCycle(null);


  EVENT_MOUSE_MOVE_IN_CONTROL: DDeiFuncData | null = new DDeiFuncData("quickcontrol-ext-show", 1, this.moveInControl);

  EVENT_MOUSE_MOVE_IN_LAYER: DDeiFuncData | null = new DDeiFuncData("quickcontrol-ext-close", 1, this.closeQuickControlDialog);
  
  EVENT_CONTROL_SELECT_AFTER: DDeiFuncData | null = new DDeiFuncData("quickcontrol-ext-show", 1, this.closeAndShowQuickControlDialog);
  
  EVENT_MOUSE_OPERATING: DDeiFuncData | null = new DDeiFuncData("quickstyle-ext-close", 1, this.mouseOperating);
  
  EVENT_CLOSE_FILE_AFTER: DDeiFuncData | null = new DDeiFuncData("quickcontrol-ext-close", 1, this.closeDialogs);

  moveInControl(operateType, data, ddInstance, evt){
    if (ddInstance && ddInstance["AC_DESIGN_EDIT"] && data?.models?.length > 0) {
      
      let editor = DDeiEditorUtil.getEditorInsByDDei(ddInstance);
      if (editor.state == 'designing'){
        let model = data.models[0]
        
        //如果存在选中控件，则重新定位到选中控件
        if (editor.ddInstance.stage.selectedModels?.size > 0) {
          if (!editor.ddInstance.stage.selectedModels.has(model.id)) {
            if (editor.ddInstance.stage.selectedModels?.size == 1) {
              model = Array.from(editor.ddInstance.stage.selectedModels.values())[0]
            } else {
              return;
            }
          }
        }
        data.model = model
        DDeiExtSearchLifeCycle.showQuickControlDialog(operateType, data, ddInstance, evt)
      }
    }
  }

  /**
     * 正在进行鼠标操作
     */
  mouseOperating(operateType, data, ddInstance, evt): DDeiFuncCallResult {
    if (ddInstance && ddInstance["AC_DESIGN_EDIT"]) {
      let editor = DDeiEditorUtil.getEditorInsByDDei(ddInstance);
      if (editor.state == 'designing') {
        let oldState = editor.state;
        DDeiEditorUtil.closeDialog(editor, 'ddei-ext-dialog-quickcontrol', true)
        DDeiEditorUtil.closeDialog(editor, 'ddei-ext-dialog-quickchoosecontrol', true)
        editor.changeState(oldState);
      }
    }
  }

 

  /**
   * 鼠标进入控件
   */
  closeAndShowQuickControlDialog(operateType, data, ddInstance, evt): DDeiFuncCallResult {
    if (ddInstance && ddInstance["AC_DESIGN_EDIT"]) {
      let editor = DDeiEditorUtil.getEditorInsByDDei(ddInstance);
      if (editor.state == 'designing') {
        DDeiEditorUtil.closeDialog(editor, 'ddei-ext-dialog-quickcontrol', true)
        DDeiEditorUtil.closeDialog(editor, 'ddei-ext-dialog-quickchoosecontrol', true)
        if(data.models?.length > 0){
          data.model = data.models[0]
          DDeiExtSearchLifeCycle.showQuickControlDialog(operateType, data, ddInstance, evt)
        }
      }
    }
  }
  
  /**
   * 鼠标进入控件
   */
  static showQuickControlDialog(operateType, data, ddInstance, evt): DDeiFuncCallResult {
    if (ddInstance && ddInstance["AC_DESIGN_EDIT"] && data?.model) {
      let editor = DDeiEditorUtil.getEditorInsByDDei(ddInstance);
      if (!data.model?.rotate && data.model?.baseModelType != 'DDeiLine' && (!editor.tempPopData || !editor.tempPopData['ddei-ext-dialog-quickcontrol'] || editor.tempPopData['ddei-ext-dialog-quickcontrol'].model != data.model)){
        //隐藏弹出框
        DDeiEditorUtil.closeDialog(editor, 'ddei-ext-dialog-quickcontrol', true)
        DDeiEditorUtil.closeDialog(editor, 'ddei-ext-dialog-quickchoosecontrol', true)
        //显示弹出框
        let editorEle = document.getElementById(editor.id);
        let editorDomPos = DDeiUtil.getDomAbsPosition(editorEle);
        let modelPos = DDeiUtil.getModelsDomAbsPosition([data.model])
        
        let stageRatio = ddInstance.stage.getStageRatio()
        let width = 50
        let height = 50
        let left = modelPos.left - editorDomPos.left - width/2
        let top = modelPos.top - editorDomPos.top - height/2
        
        let offset = null
        if (data.model.state == DDeiEnumControlState.SELECTED) {
          height = 70
          top-=20
          offset =  {
            'left': "margin-top:20px",
            'right': "margin-top:20px"
          }
        }
        DDeiEditorUtil.showDialog(editor, 'ddei-ext-dialog-quickcontrol', {
          group: "canvas-pop-quickcontrol",
          model:data.model,
          width: width,
          height: height,
          offset:offset
        }, { type: 99, left: left, top: top, ignoreOutSide:1, hiddenMask: true }, null, true, true)
      }
    }
  }

  /**
   * 鼠标进入画布
   */
  closeQuickControlDialog(operateType, data, ddInstance, evt): DDeiFuncCallResult {
    if (ddInstance && ddInstance["AC_DESIGN_EDIT"]) {
      //如果离开当前操作区域，则隐藏
      let editor = DDeiEditorUtil.getEditorInsByDDei(ddInstance);

      if (editor.tempPopData && editor.tempPopData['ddei-ext-dialog-quickcontrol']?.model) {

        let model = editor.tempPopData['ddei-ext-dialog-quickcontrol']?.model;
        let type = editor.tempPopData['ddei-ext-dialog-quickchoosecontrol']?.type;
        let modelPos = DDeiUtil.getModelsDomAbsPosition([model])
        let width = 25;
        let height = 25;
        if (model.state == DDeiEnumControlState.SELECTED) {
          height = 35;
        }
        modelPos.x -= width
        modelPos.x1 += width
        modelPos.y -= height
        modelPos.y1 += height
        if (type == 1) {
          modelPos.y -= 15
        } else if (type == 2) {
          modelPos.x1 += 10
        } else if (type == 3) {
          modelPos.y1 += 10
        } else if (type == 4) {
          modelPos.x -= 10
        }
        //不在控件的区域里
        if (!(modelPos.x <= data.ex && modelPos.x1 >= data.ex && modelPos.y <= data.ey && modelPos.y1 >= data.ey)) {
          let selectedModels = ddInstance.stage.selectedModels;
          if (selectedModels?.size == 1 && Array.from(selectedModels.values())[0] == editor.tempPopData['ddei-ext-dialog-quickcontrol']?.model) {
            DDeiEditorUtil.closeDialog(editor, 'ddei-ext-dialog-quickchoosecontrol', true)
          } else {
            let quickChooseControlDialog = document.getElementById(editor.id + "_ddei-ext-dialog-quickchoosecontrol")
            if (quickChooseControlDialog) {
              let quickChooseControlDialogPos = DDeiUtil.getDomAbsPosition(quickChooseControlDialog);
              let dx1 = quickChooseControlDialogPos.left + quickChooseControlDialog?.clientWidth;
              let dy1 = quickChooseControlDialogPos.top + quickChooseControlDialog?.clientHeight;
              let dx = quickChooseControlDialogPos.left
              let dy = quickChooseControlDialogPos.top
              if (!(dx <= evt.clientX && dx1 >= evt.clientX && dy <= evt.clientY && dy1 > evt.clientY)) {
                //隐藏弹出框
                DDeiEditorUtil.closeDialog(editor, 'ddei-ext-dialog-quickcontrol', true)
                DDeiEditorUtil.closeDialog(editor, 'ddei-ext-dialog-quickchoosecontrol', true)
              }
            } else {
              DDeiEditorUtil.closeDialog(editor, 'ddei-ext-dialog-quickcontrol', true)
            }
          }
        }

      }
    }
  }

  /**
   * 鼠标进入画布
   */
  closeDialogs(operateType, data, ddInstance, evt): DDeiFuncCallResult {
    if (ddInstance && ddInstance["AC_DESIGN_EDIT"]) {
      //如果离开当前操作区域，则隐藏
      let editor = DDeiEditorUtil.getEditorInsByDDei(ddInstance);

      if (editor.tempPopData && editor.tempPopData['ddei-ext-dialog-quickcontrol']?.model) {
        DDeiEditorUtil.closeDialog(editor, 'ddei-ext-dialog-quickcontrol', true)
        DDeiEditorUtil.closeDialog(editor, 'ddei-ext-dialog-quickchoosecontrol', true)
      }
    }
  }

  static configuration(options, fullConfig: boolean = false) {
    //解析options，只使用自己相关的
    if (options) {
      let newOptions = {}
      if (fullConfig) {
        if (fullConfig) {
          if (options[DDeiExtSearchLifeCycle.name]) {
            for (let i in options[DDeiExtSearchLifeCycle.name]) {
              newOptions[i] = options[DDeiExtSearchLifeCycle.name][i]
            }
          }
        }
      } else {
        newOptions = options
      }
      if (newOptions && Object.keys(newOptions).length !== 0) {
        let panels = new DDeiExtSearchLifeCycle();
        if (newOptions.name) {
          panels.name = newOptions.name
        }
        if (newOptions.sort) {
          panels.sort = newOptions.sort
        }
        return panels;
      }
    }
    return DDeiExtSearchLifeCycle;
  }
}

export default DDeiExtSearchLifeCycle