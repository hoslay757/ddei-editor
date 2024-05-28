import {DDeiEnumBusCommandType} from "ddei-framework";
import {DDeiEditor} from "ddei-framework";
import {DDeiEditorEnumBusCommandType} from "ddei-framework";
import {DDeiEditorState} from "ddei-framework";
import {DDeiSheet} from "ddei-framework";
import {DDeiMenuBase} from "ddei-framework";
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
    'label': '复制',
    'icon': '#icon-a-ziyuan488',
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
  /**
   * 执行的方法
   */
  action(model: object, evt: Event): void {
    if (model.modelType == 'DDeiSheet') {
      //将sheet插入文件
      let editor = DDeiEditor.ACTIVE_INSTANCE
      let file = editor?.files[editor.currentFileIndex];
      let ddInstance = model.stage.ddInstance
      let sheetJson = model.toJSON()
      let newSheet = DDeiSheet.loadFromJSON(sheetJson, { currentDdInstance: ddInstance });
      file.sheets.splice(file?.currentSheetIndex + 1, 0, newSheet);
      newSheet.name = "页面-" + file.sheets.length
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

  /**
   * 判定是否显示的方法
   */
  isVisiable(model: object): boolean {
    return !this.disabled;
  }

}

export default MenuCopySheet;
