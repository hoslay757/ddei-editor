import {DDeiEnumBusCommandType} from "ddei-framework";
import {DDeiMenuBase} from "ddei-framework";
/**
 * 删除列菜单
 */
class MenuRemoveCol extends DDeiMenuBase {


  name: string = "ddei-core-menu-remove-col"


  /**
   * 缺省实例
   */
  static defaultIns: MenuRemoveCol = new MenuRemoveCol();

  defaultOptions: object = {
    'label': '删除列',
    'icon': 'icon-delete-column',
    'disabled': false
  }


  static configuraton(options, fullConfig: boolean = false) {
    //解析options，只使用自己相关的
    if (options) {
      let newOptions = {}
      if (fullConfig) {
        if (fullConfig) {
          if (options[MenuRemoveCol.defaultIns.name]) {
            for (let i in options[MenuRemoveCol.defaultIns.name]) {
              newOptions[i] = options[MenuRemoveCol.defaultIns.name][i]
            }
          }
        }
      } else {
        newOptions = options
      }
      if (newOptions && Object.keys(newOptions).length !== 0) {
        let panels = new MenuRemoveCol(newOptions);
        return panels;
      }
    }
    return MenuRemoveCol;
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
        let col = cell.col;
        if (col < 0) {
          col = 0;
        } else if (col > table.cols.length - 1) {
          col = table.cols.length - 1;
        }
        table.removeCol(col);
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
      if (model?.cols?.length > 1) {
        return true
      }
    }
    return false;
  }

}

export default MenuRemoveCol;
