import {DDeiEnumBusCommandType} from "ddei-framework";
import {DDeiEditor} from "ddei-framework";
import {DDeiEditorEnumBusCommandType} from "ddei-framework";
import {DDeiEditorState} from "ddei-framework";
import {DDeiSheet} from "ddei-framework";
import { DDeiMenuBase, DDeiEditorUtil, DDeiUtil } from "ddei-framework";
/**
 * 复制页签
 */
class MenuCopySheet extends DDeiMenuBase {


  name: string = "ddei-core-menu-copy-sheet"

 

  /**
   * 缺省实例
   */
  static defaultIns: MenuCopySheet = new MenuCopySheet();
  
  defaultOptions: object = {
    'label': 'ddei.copy',
    'icon': '#icon-paste',
    'models': ["DDeiSheet"],
    'disabled': false
  }


  static configuration(options, fullConfig: boolean = false) {
    //解析options，只使用自己相关的
    if (options) {
      let newOptions = {}
      if (fullConfig) {
        if (fullConfig) {
          if (options[MenuCopySheet.defaultIns.name]) {
            for (let i in options[MenuCopySheet.defaultIns.name]) {
              newOptions[i] = options[MenuCopySheet.defaultIns.name][i]
            }
          }
        }
      } else {
        newOptions = options
      }
      if (newOptions && Object.keys(newOptions).length !== 0) {
        let panels = new MenuCopySheet(newOptions);
        return panels;
      }
    }
    return MenuCopySheet;
  }

  static modify(fn) {
    return MenuCopySheet.defaultIns.modify(fn)
  }
  /**
   * 执行的方法
   */
  action(model: object, evt: Event): void {
    if (model.modelType == 'DDeiSheet') {
      //将sheet插入文件
      let editor = DDeiEditor.ACTIVE_INSTANCE
      let file = editor?.files[editor.currentFileIndex];
      let ddInstance = model.stage.ddInstance
      let rsState = DDeiEditorUtil.invokeCallbackFunc("EVENT_ADD_SHEET_BEFORE", "ADD_SHEET", null, ddInstance, null)
      if (rsState != -1) {
        
        let sheetJson = model.toJSON()
        //获取当前dpi缩放，不同终端编辑可能造成dpi不一致，因此需要对比还原
        let dpi = ddInstance.dpi?.x
        //执行转换，将存储的标尺坐标转换为网页坐标
        if (!sheetJson.stage.dpi) {
          sheetJson.stage.dpi = dpi;
        }
        let unit = sheetJson.stage.unit;
        //只有保存了dpi和unit才需要转换,并且unit为像素也不需要转换
        if (dpi && unit && unit != 'px') {
          sheetJson.stage?.layers?.forEach(layer => {
            DDeiUtil.convertChildrenJsonUnit(layer, sheetJson.stage, unit);
          });
        }
        
        let newSheet = DDeiSheet.loadFromJSON(sheetJson, { currentDdInstance: ddInstance });

        let pageText = editor.i18n('ddei.page');
        file.sheets.splice(file?.currentSheetIndex + 1, 0, newSheet);
        newSheet.name = pageText+"-" + file.sheets.length
        file.changeSheet(file.currentSheetIndex + 1);
        let stage = newSheet.stage;
        stage.ddInstance = ddInstance;
        //刷新页面
        ddInstance.stage = stage;
        
        //加载场景渲染器
        stage.initRender();
        editor.changeState(DDeiEditorState.DESIGNING);
        editor.bus.push(DDeiEditorEnumBusCommandType.ClearTemplateUI);
        editor.bus.push(DDeiEnumBusCommandType.RefreshShape, null, null);
        //记录日志
        editor.bus.push(DDeiEnumBusCommandType.AddHistroy)
        editor.bus.push(DDeiEditorEnumBusCommandType.RefreshEditorParts, { parts: ["bottommenu"] })
        editor.bus?.executeAll();
        editor.editorViewer?.changeFileModifyDirty();
      }
    }
  }

  /**
   * 判定是否显示的方法
   */
  isVisiable(model: object): boolean {
    if(model){
      let allowEditSheet = model.stage.ddInstance?.AC_DESIGN_EDIT != false ? true : false
      return allowEditSheet && !this.disabled;
    }
    return false
  }

}

export default MenuCopySheet;
