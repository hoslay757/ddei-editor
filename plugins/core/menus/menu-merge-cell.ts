import {DDeiEnumBusCommandType} from "ddei-framework";
import {DDeiMenuBase} from "ddei-framework";
/**
 * 合并单元格菜单
 */
class MenuMergeCell extends DDeiMenuBase {


  name: string = "ddei-core-menu-merge-cell"


  /**
   * 缺省实例
   */
  static defaultIns: MenuMergeCell = new MenuMergeCell();

  defaultOptions: object = {
    'label': '插入列',
    'icon': 'icon-insert-col',
    'disabled': false
  }


  static configuration(options, fullConfig: boolean = false) {
    //解析options，只使用自己相关的
    if (options) {
      let newOptions = {}
      if (fullConfig) {
        if (fullConfig) {
          if (options[MenuMergeCell.defaultIns.name]) {
            for (let i in options[MenuMergeCell.defaultIns.name]) {
              newOptions[i] = options[MenuMergeCell.defaultIns.name][i]
            }
          }
        }
      } else {
        newOptions = options
      }
      if (newOptions && Object.keys(newOptions).length !== 0) {
        let panels = new MenuMergeCell(newOptions);
        return panels;
      }
    }
    return MenuMergeCell;
  }
  /**
   * 执行的方法
   */
  action(model: object, evt: Event): void {
    //当前控件为表格控件，TODO 或者布局方式为表格的容器控件
    if (model?.baseModelType == 'DDeiTable') {
      let table: DDeiTable = model;
      //执行合并单元格
      table.mergeSelectedCells();
      model.stage.ddInstance.bus.push(DDeiEnumBusCommandType.NodifyChange);
      model.stage.ddInstance.bus.push(DDeiEnumBusCommandType.AddHistroy, null, evt);
      model.stage.ddInstance.bus.executeAll();
    }
  }

  /**
   * 判定是否显示的方法
   */
  isVisiable(model: object): boolean {
    //当前控件为表格控件，TODO 或者布局方式为表格的容器控件
    if (!this.disabled && model?.baseModelType == 'DDeiTable') {
      //判断是否满足合并单元格条件
      let table = model;
      //如果出现连续的单元格则允许合并，循环选中最大和最小区域，如果都选中，则返回true
      let selectedCells = table.getSelectedCells();
      if (selectedCells.length >= 2) {
        let minMaxColRow = table.getMinMaxRowAndCol(selectedCells);
        return table.isAllSelected(minMaxColRow.minRow, minMaxColRow.minCol, minMaxColRow.maxRow, minMaxColRow.maxCol);
      }
    }
    return false;
  }

}

export default MenuMergeCell;
