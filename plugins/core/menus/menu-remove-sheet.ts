import {DDeiEnumBusCommandType} from "ddei-framework";
import {DDeiEditor} from "ddei-framework";
import {DDeiEditorEnumBusCommandType} from "ddei-framework";
import {DDeiEditorState} from "ddei-framework";
import {DDeiUtil} from "ddei-framework";
import {DDeiEditorUtil} from "ddei-framework";
import {DDeiMenuBase} from "ddei-framework";

/**
 * 插入列菜单
 */
class MenuRemoveSheet extends DDeiMenuBase {


  name: string = "ddei-core-menu-remove-sheet"


  /**
   * 缺省实例
   */
  static defaultIns: MenuRemoveSheet = new MenuRemoveSheet();

  defaultOptions: object = {
    'label': '删除',
    'icon': '#icon-a-ziyuan401',
    'models':["DDeiSheet"],
    'disabled': false
  }


  static configuration(options, fullConfig: boolean = false) {
    //解析options，只使用自己相关的
    if (options) {
      let newOptions = {}
      if (fullConfig) {
        if (fullConfig) {
          if (options[MenuRemoveSheet.defaultIns.name]) {
            for (let i in options[MenuRemoveSheet.defaultIns.name]) {
              newOptions[i] = options[MenuRemoveSheet.defaultIns.name][i]
            }
          }
        }
      } else {
        newOptions = options
      }
      if (newOptions && Object.keys(newOptions).length !== 0) {
        let panels = new MenuRemoveSheet(newOptions);
        return panels;
      }
    }
    return MenuRemoveSheet;
  }


  action(model: object, evt: Event): void {
    if (model.modelType == 'DDeiSheet') {
      //将sheet插入文件
      let editor = DDeiEditor.ACTIVE_INSTANCE
      let file = editor?.files[editor.currentFileIndex];
      if (file.sheets.length > 1) {
        let ddInstance = model.stage.ddInstance
        let rsState = DDeiEditorUtil.invokeCallbackFunc("EVENT_DEL_SHEET_BEFORE", "DEL_SHEET", null, ddInstance, null)
        if (rsState != -1) {
          let currentIndex = -1;
          for (let i = 0; i < file?.sheets?.length; i++) {
            if (file.sheets[i].unicode == model.unicode) {
              currentIndex = i;
              break;
            }
          }

          file.sheets.splice(currentIndex, 1);

          if (currentIndex <= file.currentSheetIndex) {
            file.changeSheet(file.currentSheetIndex - 1);
          }
          let stage = file.sheets[file?.currentSheetIndex].stage;
          stage.ddInstance = ddInstance;
          ddInstance.stage.destroyed()
          //刷新页面
          ddInstance.stage = stage;
          //加载场景渲染器
          stage.initRender();

          DDeiEditorUtil.invokeCallbackFunc("EVENT_DEL_SHEET_AFTER", "DEL_SHEET", null, ddInstance, null)

          editor.editorViewer?.changeFileModifyDirty();
          editor.bus.push(DDeiEnumBusCommandType.RefreshShape, null, null);
          //记录日志
          editor.bus.push(DDeiEnumBusCommandType.AddHistroy)
          editor.bus.push(DDeiEditorEnumBusCommandType.RefreshEditorParts, { parts: ["bottommenu"] })
          editor.bus?.executeAll();
          MenuRemoveSheet.showPopPicker(stage)
          editor.changeState(DDeiEditorState.DESIGNING);
        }
      }
    }
  }

  static showPopPicker(stage) {
    //显示弹出框
    if (stage.selectedModels?.size > 0) {
      let models = Array.from(stage.selectedModels.values())
      if (models?.length > 0) {
        let height = 100;
        //计算弹出框的显示位置，这里需要把模型的坐标转换为dom的坐标
        let modelPos = DDeiUtil.getModelsDomAbsPosition(models)
        let left = modelPos.left + (modelPos.width / 2)
        let top = modelPos.top + (modelPos.height / 2)
        if (modelPos.top - height <= modelPos.cTop) {
          if (modelPos.height > 400) {
            top = top + height + 20
          } else {
            top = top + modelPos.height / 2 + 20;
          }
        } else {
          top = top - height;
        }
        if (top < 0) {
          top = modelPos.cTop + modelPos.cHeight / 2
        }

        if (left < 0) {
          left = 0
        }
        DDeiEditorUtil.showDialog(this.editor,'ddei-core-dialog-quickpop', {
          group: "canvas-pop"
        }, { type: 99, left: left, top: top, hiddenMask: true }, null, true, true)
      }
    }
  }


  /**
   * 判定是否显示的方法
   */
  isVisiable(model: object): boolean {
    if(model){
      let allowEditSheet = model.stage.ddInstance?.AC_DESIGN_EDIT != false ? true : false
      if (allowEditSheet && !this.disabled && model?.modelType == 'DDeiSheet') {
        //将sheet插入文件
        let editor = DDeiEditor.ACTIVE_INSTANCE
        let file = editor?.files[editor.currentFileIndex];
        if (file.sheets.length > 1) {
          return true
        }
      }
    }
    return false;
  }

}

export default MenuRemoveSheet;
