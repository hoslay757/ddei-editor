import {DDeiEnumBusCommandType} from "ddei-framework";
import {DDeiTable} from "ddei-framework";
import {DDeiMenuBase} from "ddei-framework";

/**
 * 插入行菜单
 */
class MenuInsertRow extends DDeiMenuBase {


  name: string = "ddei-core-menu-insert-row"


  /**
   * 缺省实例
   */
  static defaultIns: MenuInsertRow = new MenuInsertRow();

  defaultOptions: object = {
    'label': '插入行',
    'icon': 'icon-insert-row',
    'disabled': false
  }



  static configuration(options, fullConfig: boolean = false) {
    //解析options，只使用自己相关的
    if (options) {
      let newOptions = {}
      if (fullConfig) {
        if (fullConfig) {
          if (options[MenuInsertRow.defaultIns.name]) {
            for (let i in options[MenuInsertRow.defaultIns.name]) {
              newOptions[i] = options[MenuInsertRow.defaultIns.name][i]
            }
          }
        }
      } else {
        newOptions = options
      }
      if (newOptions && Object.keys(newOptions).length !== 0) {
        let panels = new MenuInsertRow(newOptions);
        return panels;
      }
    }
    return MenuInsertRow;
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
        if (row - 1 < 0) {
          row = -1;
        } else {
          row = row - 1;
        }
        if (row < 0) {
          row = -1;
        } else if (row > table.rows.length - 1) {
          row = table.rows.length - 1;
        }
        //调用table的插入行方法插入行
        table.insertRow(row, 1);
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
      return true
    }
    return false;
  }

}

export default MenuInsertRow;
