import {DDeiEnumBusCommandType} from "ddei-framework";
import {DDeiMenuBase} from "ddei-framework";
/**
 * 插入列菜单
 */
class MenuInsertCol extends DDeiMenuBase {


  name: string = "ddei-core-menu-insert-col"


  /**
   * 缺省实例
   */
  static defaultIns: MenuInsertCol = new MenuInsertCol();

  defaultOptions: object = {
    'label': '合并单元格',
    'icon': 'icon-merge-cells',
    'disabled': false
  }



  static configuration(options, fullConfig: boolean = false) {
    //解析options，只使用自己相关的
    if (options) {
      let newOptions = {}
      if (fullConfig) {
        if (fullConfig) {
          if (options[MenuInsertCol.defaultIns.name]) {
            for (let i in options[MenuInsertCol.defaultIns.name]) {
              newOptions[i] = options[MenuInsertCol.defaultIns.name][i]
            }
          }
        }
      } else {
        newOptions = options
      }
      if (newOptions && Object.keys(newOptions).length !== 0) {
        let panels = new MenuInsertCol(newOptions);
        return panels;
      }
    }
    return MenuInsertCol;
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
        //model所在列
        let col = cell.col;
        if (col < 0) {
          col = -1;
        } else if (col > table.cols.length - 1) {
          col = table.cols.length - 1;
        }
        //调用table的插入行方法插入行
        table.insertCol(col, 2);
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

export default MenuInsertCol;
