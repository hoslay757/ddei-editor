import {DDeiEnumBusCommandType} from "ddei-framework1";
import {DDeiMenuBase} from "ddei-framework1";

/**
 * 删除行菜单
 */
class MenuRemoveRow extends DDeiMenuBase {


  name: string = "ddei-core-menu-remove-row"


  /**
   * 缺省实例
   */
  static defaultIns: MenuRemoveRow = new MenuRemoveRow();

  defaultOptions: object = {
    'label': '删除行',
    'icon': 'icon-delete-row',
    'disabled': false
  }


  static configuraton(options, fullConfig: boolean = false) {
    //解析options，只使用自己相关的
    if (options) {
      let newOptions = {}
      if (fullConfig) {
        if (fullConfig) {
          if (options[MenuRemoveRow.defaultIns.name]) {
            for (let i in options[MenuRemoveRow.defaultIns.name]) {
              newOptions[i] = options[MenuRemoveRow.defaultIns.name][i]
            }
          }
        }
      } else {
        newOptions = options
      }
      if (newOptions && Object.keys(newOptions).length !== 0) {
        let panels = new MenuRemoveRow(newOptions);
        return panels;
      }
    }
    return MenuRemoveRow;
  }
  /**
   * 执行的方法
   */
  action(model: object, evt: Event): void {
    //当前控件为表格控件，TODO 或者布局方式为表格的容器控件
    if (model?.baseModelType == 'DDeiTable') {
      let table: DDeiTable = model;
      //获取当前单元格
      if (table.curRow != undefined && table.curCol != undefined && table.curRow != -1 && table.curCol != -1) {
        let cell = table.rows[table.curRow][table.curCol];
        let row = cell.row;
        if (row < 0) {
          row = 0;
        } else if (row > table.rows.length - 1) {
          row = table.rows.length - 1;
        }
        table.removeRow(row);
        model.stage.ddInstance.bus.push(DDeiEnumBusCommandType.NodifyChange);
        model.stage.ddInstance.bus.push(DDeiEnumBusCommandType.AddHistroy, null, evt);
        model.stage.ddInstance.bus.executeAll();
      }
    }
  }

  /**
   * 判定是否显示的方法
   */
  isVisiable(model: object): boolean {
    //当前控件为表格控件，TODO 或者布局方式为表格的容器控件
    if (!this.disabled && model?.baseModelType == 'DDeiTable') {
      if (model?.rows?.length > 1) {
        return true
      }
    }
    return false;
  }

}

export default MenuRemoveRow;
