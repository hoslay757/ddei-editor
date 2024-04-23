import {DDeiEnumBusCommandType} from "ddei-framework1";
import {DDeiMenuBase} from "ddei-framework1";

/**
 * 取消合并单元格菜单
 */
class MenuCancelMergeCell extends DDeiMenuBase {


  name: string = "ddei-core-menu-cancel-merge-cell"


  /**
   * 缺省实例
   */
  static defaultIns: MenuCancelMergeCell = new MenuCancelMergeCell();

  defaultOptions: object = {
    'label': '取消合并单元格',
    'icon': 'icon-merge-cells',
    'disabled':false
  }


  static configuraton(options, fullConfig: boolean = false) {
    //解析options，只使用自己相关的
    if (options) {
      let newOptions = {}
      if (fullConfig) {
        if (fullConfig) {
          if (options[MenuCancelMergeCell.defaultIns.name]) {
            for (let i in options[MenuCancelMergeCell.defaultIns.name]) {
              newOptions[i] = options[MenuCancelMergeCell.defaultIns.name][i]
            }
          }
        }
      } else {
        newOptions = options
      }
      if (newOptions && Object.keys(newOptions).length !== 0) {
        let panels = new MenuCancelMergeCell(newOptions);
        return panels;
      }
    }
    return MenuCancelMergeCell;
  }

  // ============================ 方法 ===============================
  /**
   * 执行的方法
   */
  action(model: object, evt: Event): void {
    //当前控件为表格控件，TODO 或者布局方式为表格的容器控件
    if (model?.baseModelType == 'DDeiTable') {
      let table: DDeiTable = model;
      //执行取消合并单元格
      table.cancelSelectedMergeCells();
      model.stage.ddInstance.bus.push(DDeiEnumBusCommandType.NodifyChange);
      model.stage.ddInstance.bus.push(DDeiEnumBusCommandType.AddHistroy, null, evt);
      model.stage.ddInstance.bus.executeAll();
    }
  }

  /**
   * 判定是否显示的方法
   */
  isVisiable(model: object): boolean {
    //当前控件为表格控件
    if (!this.disabled && model?.baseModelType == 'DDeiTable') {
      let table = model;
      let selectedCells = table.getSelectedCells();
      //判断当前选中的单元格是否具备取消合并单元格的条件，如果具备条件，则返回true
      if (selectedCells.length == 1 && (selectedCells[0].mergeRowNum > 1 || selectedCells[0].mergeColNum > 1)) {
        return true;
      }
    }
    return false;
  }

}

export default MenuCancelMergeCell;
