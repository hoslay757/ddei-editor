import {DDei} from "ddei-framework";
import {DDeiEnumControlState} from "ddei-framework";
import {DDeiKeyAction} from "ddei-framework";
import {DDeiEnumBusCommandType} from "ddei-framework";
import {DDeiUtil} from "ddei-framework";
import {DDeiStage} from "ddei-framework";
import {DDeiConfig} from "ddei-framework";
import {DDeiAbstractShape} from "ddei-framework";
import {DDeiTable} from "ddei-framework";
import { Matrix3 } from 'three';
import {DDeiEnumOperateType} from "ddei-framework";
import {DDeiPolygon} from "ddei-framework";
import {DDeiLink} from "ddei-framework";
import {DDeiLineLink} from "ddei-framework";
import {DDeiEditorState} from "ddei-framework";
/**
 * 键行为:粘贴
 * 粘贴剪切板内容
 */
class DDeiKeyActionPaste extends DDeiKeyAction {
  name: string = "ddei-core-keyaction-paste"


  /**
   * 缺省实例
   */
  static defaultIns: DDeiKeyActionPaste = new DDeiKeyActionPaste();

  defaultOptions: object = {
    'keys': [
      { ctrl: 1, keys: "86", editorState: DDeiEditorState.DESIGNING},
    ]
  }

  getHotKeys(editor) {
    return [this];
  }


  static configuration(options, fullConfig: boolean = false) {
    //解析options，只使用自己相关的
    if (options) {
      let newOptions = {}
      if (fullConfig) {
        if (fullConfig) {
          if (options[DDeiKeyActionPaste.defaultIns.name]) {
            for (let i in options[DDeiKeyActionPaste.defaultIns.name]) {
              newOptions[i] = options[DDeiKeyActionPaste.defaultIns.name][i]
            }
          }
        }
      } else {
        newOptions = options
      }
      if (newOptions && Object.keys(newOptions).length !== 0) {
        let panels = new DDeiKeyActionPaste(newOptions);
        return panels;
      }
    }
    return DDeiKeyActionPaste;
  }


  // ============================ 方法 ===============================
  action(evt: Event, ddInstance: DDei): void {
    //修改当前操作控件坐标
    if (ddInstance && ddInstance.stage) {
      let modeName = DDeiUtil.getConfigValue("MODE_NAME", ddInstance);
      let accessCreate = DDeiUtil.isAccess(
        DDeiEnumOperateType.CREATE, null, null, modeName,
        ddInstance
      );
      //校验权限
      if (accessCreate) {
        this.doPaste(evt, ddInstance);
      }
    }
  }

  /**
   * 执行粘贴
   */
  async doPaste(evt: Event, ddInstance: DDei) {

    //剪切板中的数据
    let blobData = null;
    let type = null;
    if (DDeiConfig.ALLOW_CLIPBOARD || DDeiConfig.ALLOW_CLIPBOARD == undefined) {
      try {
        //读取剪切板数据
        let items = await navigator.clipboard.read();
        //优先级html>图片/文本
        items[0].types.forEach(t => {
          if (!type) {
            type = t;
          } else if (t = 'text/html') {
            type = t;
          }
        });
        //三种粘贴类型，文本、图片、HTML
        blobData = await items[0].getType(type)
        DDeiConfig.ALLOW_CLIPBOARD = true
      } catch (e) {
        DDeiConfig.ALLOW_CLIPBOARD = false
      }
    }
    //如果不支持剪切板，则从window.DDEI_CLIPBOARD取得数据
    if (!DDeiConfig.ALLOW_CLIPBOARD) {
      type = 'text/html'
      blobData = window.DDEI_CLIPBOARD
    }
    if (blobData) {
      switch (type) {
        //剪切板中是文本
        case 'text/plain': {
          let dataText = await new Response(blobData).text()
          this.textPaste(evt, ddInstance.stage, dataText);
          break;
        }
        //剪切板中是图片
        case 'image/png': {
          this.imagePaste(evt, ddInstance.stage, blobData);
          break;
        }
        //剪切板中是HTML
        case 'text/html': {
          let dataText = await new Response(blobData).text()
          this.htmlPaste(evt, ddInstance.stage, dataText);
        }
      }
    }
  }


  /**
   * 粘贴图片
   */
  imagePaste(evt: Event, stage: DDeiStage, blobData: object) {
    let that = this;
    //将二进制转换为图片
    let reader = new FileReader();
    reader.onload = function (e) {
      let image = new Image();
      image.onload = function () {
        let imgBase64 = e.target.result
        //当前激活的图层
        let layer = stage.layers[stage.layerIndex];
        //获取当前的鼠标落点
        
        let offsetX = stage.ddInstance.render.inAreaX - stage.wpv.x;
        let offsetY = stage.ddInstance.render.inAreaY - stage.wpv.y;
        //当前选中控件是否为1且有表格，且选中表格的单元格，则作为表格单元格的内容粘贴
        let createControl = true;
        let hasChange = false;
        if (stage.selectedModels?.size == 1) {
          let table = Array.from(stage.selectedModels.values())[0]
          if (table.baseModelType == 'DDeiTable') {
            //粘贴到表格单元格
            let cells = table.getSelectedCells();
            if (cells.length > 0) {
              cells.forEach(cell => {
                cell.setImgBase64(imgBase64);
              })
              hasChange = true;
              createControl = false
            }
          } else {
            if (!table.fill) {
              table.fill = { type: 2 }

            }
            table.fill.type = 2
            table.fill.image = imgBase64
            // table.setImgBase64(imgBase64);
            hasChange = true;
            createControl = false
          }
        } else if (stage.selectedModels?.size > 1) {
          let isSimpleControl = true
          stage.selectedModels?.forEach(item => {
            if (isSimpleControl && (item.baseModelType == 'DDeiTable' || item.baseModelType == 'DDeiContainer')) {
              isSimpleControl = false;
            }
          })
          //如果都是简单控件，则允许粘贴
          if (isSimpleControl) {
            createControl = false;
            stage.selectedModels?.forEach(item => {
              if (!item.fill) {
                item.fill = { type: 2 }

              }
              item.fill.type = 2
              item.fill.image = imgBase64
            })
            hasChange = true;
          }
        }



        //如果没有粘贴到表格在最外层容器的鼠标位置，创建rectangle控件
        if (createControl) {
          that.createNewImage(image, imgBase64, offsetX, offsetY, stage, layer, evt)
          hasChange = true;
        }
        if (hasChange) {
          stage.ddInstance.bus.push(DDeiEnumBusCommandType.NodifyChange);
          stage.ddInstance.bus.push(DDeiEnumBusCommandType.AddHistroy, null, evt);
        }
        stage.ddInstance.bus.push(DDeiEnumBusCommandType.RefreshShape, null, evt);
        stage.ddInstance.bus?.executeAll();
      }
      image.src = e.target.result
    }
    reader.readAsDataURL(blobData);
  }



  /**
   * 粘贴文本
   */
  textPaste(evt: Event, stage: DDeiStage, textData: string) {
    //当前激活的图层
    let layer = stage.layers[stage.layerIndex];
    //获取当前的鼠标落点
    let offsetX = stage.ddInstance.render.inAreaX - stage.wpv.x;
    let offsetY = stage.ddInstance.render.inAreaY - stage.wpv.y;
    //当前选中控件是否为1且有表格，且选中表格的单元格，则作为表格单元格的内容粘贴
    let createControl = true;
    let hasChange = false;
    if (stage.selectedModels?.size == 1) {
      let table = Array.from(stage.selectedModels.values())[0]
      if (table.baseModelType == 'DDeiTable') {
        //粘贴到表格单元格
        let cells = table.getSelectedCells();
        if (cells.length > 0) {
          cells.forEach(cell => {
            cell.text = textData
          })
          hasChange = true
          createControl = false
        }
      } else if (table.baseModelType != 'DDeiContainer') {
        table.text = textData
        hasChange = true
        createControl = false
      }
    } else if (stage.selectedModels?.size > 1) {
      let isSimpleControl = true
      stage.selectedModels?.forEach(item => {
        if (isSimpleControl && (item.baseModelType == 'DDeiTable' || item.baseModelType == 'DDeiContainer')) {
          isSimpleControl = false;
        }
      })
      //如果都是简单控件，则允许粘贴
      if (isSimpleControl) {
        createControl = false;
        stage.selectedModels?.forEach(item => {
          item.text = textData
        })
        hasChange = true;
      }

    }

    //如果没有粘贴到表格在最外层容器的鼠标位置，创建rectangle控件
    if (createControl) {
      stage.idIdx++
      hasChange = true;

      let searchPaths = [
        "font.size",
        "font.family",
      ];
      let configAtrs = DDeiUtil.getAttrValueByConfig(
        { modelCode: "100002" },
        searchPaths
      );
      let stageRatio = stage.getStageRatio()
      //获取文本高度宽度
      let size = DDeiUtil.measureTextSize(stage.ddInstance, textData, configAtrs.get('font.family').data, configAtrs.get('font.size').data * stageRatio)


      let dataJson = {
        id: "rect_" + stage.idIdx,
        modelCode: "100002",

      };


      let ccDefine = DDeiUtil.getControlDefine(dataJson)
      //设置配置的属性值
      searchPaths.forEach((key) => {
        if (configAtrs.get(key)) {
          dataJson[key] = configAtrs.get(key).data;
        }
        if (ccDefine[key] != undefined && ccDefine[key] != null) {
          dataJson[key] = ccDefine[key];
        }
      });

      for (let i in ccDefine?.define) {
        dataJson[i] = ccDefine?.define[i];
      }
      dataJson.text = textData;
      dataJson.border = { type: 0 };
      dataJson.fill = { type: 0 }
      dataJson.width = size.width;
      dataJson.height = size.height;
      //如果有from则根据from读取属性
      delete dataJson.ovs
      delete dataJson.font

      let model: DDeiAbstractShape = DDeiPolygon.initByJSON(
        dataJson,
        { currentStage: stage }
      );

      model.initPVS()

      let moveMatrix = new Matrix3(
        1, 0, offsetX,
        0, 1, offsetY,
        0, 0, 1
      )

      model.transVectors(moveMatrix)
      stage.ddInstance.bus.push(DDeiEnumBusCommandType.ModelChangeContainer, { newContainer: layer, models: [model] }, evt);
      stage.ddInstance.bus.push(DDeiEnumBusCommandType.CancelCurLevelSelectedModels, null, evt);
      stage.ddInstance.bus?.push(DDeiEnumBusCommandType.ModelChangeSelect, { models: [model], value: DDeiEnumControlState.SELECTED }, evt);
    }
    if (hasChange) {
      stage.ddInstance.bus.push(DDeiEnumBusCommandType.StageChangeSelectModels, {}, evt);
      stage.ddInstance.bus.push(DDeiEnumBusCommandType.UpdateSelectorBounds, {}, evt);
      stage.ddInstance.bus.push(DDeiEnumBusCommandType.NodifyChange);
      stage.ddInstance.bus.push(DDeiEnumBusCommandType.AddHistroy, null, evt);
    }

    stage.ddInstance.bus.push(DDeiEnumBusCommandType.RefreshShape, null, evt);
    stage.ddInstance.bus?.executeAll();

  }


  /**
  * 粘贴HTML
  */
  htmlPaste(evt: Event, stage: DDeiStage, textData: string) {
    //当前激活的图层
    let layer = stage.layers[stage.layerIndex];
    //获取当前的鼠标落点
    let offsetX = stage.ddInstance.render.inAreaX - stage.wpv.x;
    let offsetY = stage.ddInstance.render.inAreaY - stage.wpv.y;
    //识别粘贴的内容来自于外部还是内部
    let ddeiJson = null;

    try {
      let searchText = '<meta source="ddei">';
      if (textData.indexOf(searchText) != -1) {
        let startIndex = textData.indexOf(searchText) + searchText.length;
        let endIndex = textData.indexOf('<meta source="ddeiend">')
        let ddeiJsonStr = textData.substring(startIndex, endIndex);
        if (ddeiJsonStr) {
          ddeiJson = JSON.parse(ddeiJsonStr);
        }
      }
    } catch (e) {
      console.error(e)
    }
    //内部复制
    let hasChange = false;
    if (ddeiJson) {
      //对内部复制的对象进行反序列化处理
      let mode = ddeiJson.mode
      let jsonArray = ddeiJson.data
      
      let jsonLinkArray = ddeiJson.links
      if (!Array.isArray(jsonArray)) {
        jsonArray = [jsonArray]
      }
      let unit = ddeiJson.unit
      
      //只有保存了unit才需要转换,并且unit为像素也不需要转换
      if (unit && unit != 'px') {
        //对model的坐标进行处理
        jsonArray.forEach(model => {
          //如果是容器则递归处理其子控件
          DDeiUtil.convertChildrenJsonUnit(model, stage, unit);
        });
      }
      
      //当前选中控件是否为1且有表格，且选中表格的单元格，则作为表格单元格的内容粘贴
      let createControl = true;
      if (stage.selectedModels?.size == 1) {
        let model = Array.from(stage.selectedModels.values())[0]
        if (model.baseModelType == 'DDeiTable') {
          //添加控件到表格单元格
          let cells = model.getSelectedCells();
          if (cells.length > 0) {
            cells.forEach(cell => {
              this.createControl(jsonArray, jsonLinkArray, offsetX, offsetY, stage, cell, mode, evt)
            })
            hasChange = true;
            createControl = false
          }
        }
        //添加到容器
        else if (model.baseModelType == 'DDeiContainer') {
          this.createControl(jsonArray, jsonLinkArray, offsetX, offsetY, stage, model, mode, evt)
          createControl = false
          hasChange = true;
        }
      }
      //如果没有粘贴到表格在最外层容器的鼠标位置，反序列化控件，重新设置ID，其他信息保留
      if (createControl) {
        this.createControl(jsonArray, jsonLinkArray, offsetX, offsetY, stage, layer, mode, evt)
        hasChange = true;
      }
      if (hasChange) {
        stage.ddInstance.bus.push(DDeiEnumBusCommandType.NodifyChange);
        stage.ddInstance.bus.push(DDeiEnumBusCommandType.AddHistroy, null, evt);
        stage.ddInstance.bus.push(DDeiEnumBusCommandType.UpdatePaperArea);
        stage.ddInstance.bus.push(DDeiEnumBusCommandType.StageChangeSelectModels, {}, evt);
        stage.ddInstance.bus.push(DDeiEnumBusCommandType.UpdateSelectorBounds, {}, evt);
        // stage.ddInstance.bus.push(DDeiEditorEnumBusCommandType.RefreshEditorParts);
      }
      stage.ddInstance.bus.push(DDeiEnumBusCommandType.RefreshShape, null, evt);
      stage.ddInstance.bus?.executeAll();
    }
    //外部复制
    else {
      //只考虑从excel粘贴的情况，识别为一个table
      let tableJson = this.parseDomToJson(textData);
      let createControl = true;
      if (stage.selectedModels?.size == 1) {
        let model = Array.from(stage.selectedModels.values())[0]
        if (model.baseModelType == 'DDeiTable') {
          //复制表格内容到表格
          this.copyTableToTableCell(model, tableJson);
          createControl = false
          hasChange = true;
        }
        //添加表格到容器
        else if (model.baseModelType == 'DDeiContainer') {
          this.createTable(tableJson, offsetX, offsetY, stage, model, evt)
          createControl = false
          hasChange = true;
        }
      }
      //如果没有粘贴到表格在最外层容器的鼠标位置，反序列化控件，重新设置ID，其他信息保留
      if (createControl) {
        this.createTable(tableJson, offsetX, offsetY, stage, layer, evt)
        hasChange = true;
      }
      if (hasChange) {
        stage.ddInstance.bus.push(DDeiEnumBusCommandType.NodifyChange);
        stage.ddInstance.bus.push(DDeiEnumBusCommandType.AddHistroy, null, evt);
      }
      stage.ddInstance.bus.push(DDeiEnumBusCommandType.RefreshShape, null, evt);
      stage.ddInstance.bus?.executeAll();
    }
  }

  /**
   * 复制表格内容到另外一个表格的单元格中
   * @param table 表格
   * @param tableJson 表格单元格
   */
  copyTableToTableCell(table: DDeiTable, tableJson: object): void {
    //取得当前表格的当前选中单元格
    let distCells = table.getSelectedCells();
    //校验目标区域和当前源区域是否能够满足粘贴条件
    if (distCells && distCells.length > 0 && tableJson) {
      let sourceTable = tableJson;
      let distTable = table;
      let sourceMinMaxRow = { minRow: 0, minCol: 0, maxRow: sourceTable.rows.length - 1, maxCol: sourceTable.rows[0].length - 1 }
      //校验1:目标是否为一个连续的选中区域
      let distMinMaxRow = distTable.getMinMaxRowAndCol(distCells);
      let distAreaAllSelected = distTable.isAllSelected(distMinMaxRow.minRow, distMinMaxRow.minCol, distMinMaxRow.maxRow, distMinMaxRow.maxCol);

      if (!distAreaAllSelected) {
        console.log("表格粘贴目标不是一个有效的连续区域");
        return;
      }
      //计算粘贴后的区域大小
      let rowNum = 1;
      let colNum = 1;
      let sourceRowNum = sourceMinMaxRow.maxRow - sourceMinMaxRow.minRow + 1;
      let distRowNum = distMinMaxRow.maxRow - distMinMaxRow.minRow + 1;
      let sourceColNum = sourceMinMaxRow.maxCol - sourceMinMaxRow.minCol + 1;
      let distColNum = distMinMaxRow.maxCol - distMinMaxRow.minCol + 1;
      //如果目标区域的行数/列数=1，则粘贴后的目标行数=源行数/列数=源列数，如果不是，则取得能够整除的区域
      if (distRowNum == sourceRowNum) {
        rowNum = sourceRowNum;
      } else if (distRowNum > sourceRowNum) {
        rowNum = distRowNum - (distRowNum % sourceRowNum);
      } else if (distRowNum < sourceRowNum) {
        rowNum = sourceRowNum;
      }
      if (distColNum == sourceColNum) {
        colNum = sourceColNum;
      } else if (distColNum > sourceColNum) {
        colNum = distColNum - (distColNum % sourceColNum);
      } else if (distColNum < sourceColNum) {
        colNum = sourceColNum;
      }

      //校验2：粘贴区域内存在合并单元格
      if (distTable.hasMergeCell(distMinMaxRow.minRow, distMinMaxRow.minCol, distMinMaxRow.minRow + rowNum - 1, distMinMaxRow.minCol + colNum - 1)) {
        console.log("表格粘贴区域存在合并单元格");
        return;
      }

      //校验3：粘贴后超出表格所在最大区域
      if (distTable.rows.length <= distMinMaxRow.minRow + rowNum - 1 || distTable.cols.length <= distMinMaxRow.minCol + colNum - 1) {
        console.log("表格粘贴区域超出表格所在最大区域");
        return;
      }
      //执行复制
      let mergeCells = [];
      for (let i = 0; i < rowNum && distMinMaxRow.minRow + i < distTable.rows.length; i++) {
        let offsetI = i % sourceRowNum;
        for (let j = 0; j < colNum && distMinMaxRow.minCol + j < distTable.cols.length; j++) {
          //获取要复制的单元格
          let offsetJ = j % sourceColNum;
          let sourceCell = sourceTable.rows[sourceMinMaxRow.minRow + offsetI][sourceMinMaxRow.minCol + offsetJ];
          //取得目标单元格
          let targetCell = distTable.rows[distMinMaxRow.minRow + i][distMinMaxRow.minCol + j];
          //文本
          targetCell.text = sourceCell.text;
          //样式
          targetCell.textStyle = sourceCell.textStyle;
          targetCell.font = sourceCell.font
          targetCell.border = sourceCell.border;
          //记录合并单元格
          if (sourceCell.mergeRowNum > 1 || sourceCell.mergeColNum > 1) {
            targetCell.mergeRowNum = sourceCell.mergeRowNum;
            targetCell.mergeColNum = sourceCell.mergeColNum;
            mergeCells[mergeCells.length] = targetCell;
          }
          targetCell.render?.renderCacheData?.clear();
        }
      }
      //执行合并单元格
      for (let i = 0; i < mergeCells.length; i++) {
        let mc = mergeCells[i];
        //合并单元格
        let cells = distTable.getCellsByRect(mc.row, mc.col, mc.row + mc.mergeRowNum - 1, mc.col + mc.mergeColNum - 1);
        distTable.mergeCells(cells);
      }
    }
  }

  /**
   * 解析dom文本到json
   * @param textData 文本
   * @returns json
   */
  parseDomToJson(textData): string {
    let tableJson = { rows: [], modelCode: "100301" }
    let parser = new DOMParser();
    let doc = parser.parseFromString(textData, "text/html");
    //解析table，获取基本的行列定义
    if (doc) {
      let tableEle = doc.body.children[0];
      let tableHeight = 0;
      tableJson.id = 'copytable'
      let tableWidth = 0;
      //解析行列
      let eleRows = tableEle.rows;
      //合并区域的定义
      let mergeAreas = []
      let colSize = {}
      let rowSize = {}
      for (let i = 0; i < eleRows.length; i++) {
        let eleCells = eleRows[i].cells;
        if (!tableJson.rows[i]) {
          tableJson.rows[i] = []
        }
        let rowJson = tableJson.rows[i]
        for (let j = 0; j < eleCells.length; j++) {
          let cellEle = eleCells[j]
          //获取样式以及合并单元格信息
          //合并单元格信息
          let cellJson = { modelCode: '100302', row: i, col: j, text: cellEle.innerText, domRow: i, domCol: j }
          rowJson.push(cellJson)


          if (cellEle.rowSpan > 1) {
            cellJson.mergeRowNum = parseInt(cellEle.rowSpan)
          }
          if (cellEle.colSpan > 1) {
            cellJson.mergeColNum = parseInt(cellEle.colSpan)
          }

          //记录合并单元格区域
          if (cellJson.mergeRowNum > 1 || cellJson.mergeColNum > 1) {
            if (!cellJson.mergeRowNum) {
              cellJson.mergeRowNum = 1;
            }
            if (!cellJson.mergeColNum) {
              cellJson.mergeColNum = 1;
            }
            mergeAreas.push(cellJson);
          }

          //字体样式信息
          cellJson.font = {}
          if (cellEle.style.fontSize) {
            cellJson.font.size = parseFloat(cellEle.style.fontSize)
          }
          if (cellEle.style.color) {
            cellJson.font.color = DDeiUtil.getColor(cellEle.style.color)
          }
          if (cellEle.style.fontFamily) {
            cellJson.font.family = cellEle.style.fontFamily
          }
          cellJson.border = {}
          cellJson.border.top = {}
          cellJson.border.bottom = {}
          cellJson.border.left = {}
          cellJson.border.right = {}
          if (cellEle.style.borderTopColor) {
            cellJson.border.top.color = cellEle.style.borderTopColor
            if (cellJson.border.top.color == 'initial') {
              delete cellJson.border.top.color
            }
          }
          if (cellEle.style.borderTopWidth) {
            cellJson.border.top.width = parseFloat(cellEle.style.borderTopWidth)
            if (isNaN(cellJson.border.top.width) || cellJson.border.top.width == 'initial') {
              delete cellJson.border.top.width
            }
          }
          if (cellEle.style.borderTopStyle) {
            cellJson.border.top.style = cellEle.style.borderTopStyle
          }



          if (cellEle.style.borderBottomColor) {
            cellJson.border.bottom.color = cellEle.style.borderBottomColor
            if (cellJson.border.bottom.color == 'initial') {
              delete cellJson.border.bottom.color;
            }
          }
          if (cellEle.style.borderBottomWidth) {
            cellJson.border.bottom.width = parseFloat(cellEle.style.borderBottomWidth)
            if (isNaN(cellJson.border.bottom.width) || cellJson.border.bottom.width == 'initial') {
              delete cellJson.border.bottom.width
            }
          }
          if (cellEle.style.borderBottomStyle) {
            cellJson.border.bottom.style = cellEle.style.borderBottomStyle
          }


          if (cellEle.style.borderLeftColor) {
            cellJson.border.left.color = cellEle.style.borderLeftColor
            if (cellJson.border.left.color == 'initial') {
              delete cellJson.border.left.color
            }
          }
          if (cellEle.style.borderLeftWidth) {
            cellJson.border.left.width = parseFloat(cellEle.style.borderLeftWidth)
            if (isNaN(cellJson.border.left.width) || cellJson.border.left.width == 'initial') {
              delete cellJson.border.left.width
            }
          }
          if (cellEle.style.borderLeftStyle) {
            cellJson.border.left.style = cellEle.style.borderLeftStyle
          }

          if (cellEle.style.borderRightColor) {
            cellJson.border.right.color = cellEle.style.borderRightColor
            if (cellJson.border.right.color == 'initial') {
              delete cellJson.border.right.color
            }
          }
          if (cellEle.style.borderRightWidth) {
            cellJson.border.right.width = parseFloat(cellEle.style.borderRightWidth)
            if (isNaN(cellJson.border.right.width) || cellJson.border.right.width == 'initial') {
              delete cellJson.border.right.width
            }
          }
          if (cellEle.style.borderRightStyle) {
            cellJson.border.right.style = cellEle.style.borderRightStyle
          }

          //填充信息
          cellJson.fill = {};
          if (cellEle.style.backgroundColor) {
            cellJson.fill.color = cellEle.style.backgroundColor
          }
          //对齐
          cellJson.textStyle = {}
          if (cellEle.style.textAlign) {
            if (cellEle.style.textAlign == "left") {
              cellJson.textStyle.align = 1
            } else if (cellEle.style.textAlign == "center") {
              cellJson.textStyle.align = 2
            } else if (cellEle.style.textAlign == "right") {
              cellJson.textStyle.align = 3
            }
          }
          if (cellEle.style.verticalAlign) {
            if (cellEle.style.verticalAlign == "top") {
              cellJson.textStyle.valign = 1
            } else if (cellEle.style.verticalAlign == "middle") {
              cellJson.textStyle.valign = 2
            } else if (cellEle.style.verticalAlign == "bottom") {
              cellJson.textStyle.valign = 3
            }
          }
          if (cellEle.style.textDecoration == "underline") {
            cellJson.textStyle.underline = "1"
          }
          if (cellEle.style.textDecoration == "line-through") {
            cellJson.textStyle.deleteline = "1"
          }
          if (cellEle.style.whiteSpace == "nowrap") {
            cellJson.textStyle.feed = "0"
          } else {
            cellJson.textStyle.feed = "1"
          }

          if (cellEle.style.fontStyle == "italic") {
            cellJson.textStyle.italic = "1"
          }
          if (cellEle.style.fontWeight) {
            if (cellEle.style.fontWeight == 'bold') {
              cellJson.textStyle.bold = "1"
            }
            else if (parseInt(cellEle.style.fontWeight) > 400)
              cellJson.textStyle.bold = "1"
          }
        }
      }
      //处理合并单元格区域
      mergeAreas.forEach(mergeCell => {
        //向右下方扩展表格区域
        for (let i = 1; i <= mergeCell.mergeRowNum; i++) {
          for (let j = 1; j <= mergeCell.mergeColNum; j++) {
            //自身单元格不用扩展
            if (!(i == 1 && j == 1)) {
              tableJson.rows[mergeCell.row + i - 1].splice(mergeCell.col + j - 1, 0, { width: 0, height: 0, modelCode: '100302', mCell: mergeCell });
              //重新设置关系
              for (let k = 0; k < tableJson.rows.length; k++) {
                let rowObj = tableJson.rows[k];
                for (let l = 0; l < rowObj.length; l++) {
                  rowObj[l].row = k;
                  rowObj[l].col = l;
                }
              }
            }
          }
        }
      });

      //计算每一行列的大小以及合并单元格的大小
      for (let k = 0; k < tableJson.rows.length; k++) {
        let rowObj = tableJson.rows[k];
        for (let l = 0; l < rowObj.length; l++) {
          if ((rowObj[l].domRow || rowObj[l].domRow == 0)
            && (!rowObj[l].mergeRowNum || rowObj[l].mergeRowNum <= 1) && (!rowObj[l].mergeColNum <= 1 || rowObj[l].mergeColNum <= 1)) {
            let rowHeight = null;
            let domRowEle = tableEle.rows[rowObj[l].domRow];
            let domCellEle = tableEle.rows[rowObj[l].domRow].cells[rowObj[l].domCol];
            if (!rowSize["" + k]) {
              if (domRowEle.style.height) {
                rowHeight = parseFloat(domRowEle.style.height);
              } else {
                rowHeight = parseFloat(domRowEle.getAttribute("height"));
              }
              if (!isNaN(rowHeight)) {
                rowSize["" + k] = rowHeight;
              }
            }
            let colWidth = null;
            if (!colSize["" + l]) {
              if (domCellEle.style.width) {
                colWidth = parseFloat(domCellEle.style.width);
              } else {
                colWidth = parseFloat(domCellEle.getAttribute("width"));
              }
              if (!isNaN(colWidth)) {
                colSize["" + l] = colWidth;
              }
            }
          }
        }
      }
      //补全行列大小
      for (let k = 0; k < tableJson.rows.length; k++) {
        //可能存在合并单元格，
        if (!rowSize[k]) {
          //寻找非合并单元格，填充大小，如果找不到则用合并单元格大小的平均数
          let mCell = null;
          let rowObj = tableJson.rows[k];
          for (let l = 0; l < rowObj.length; l++) {
            if (rowObj[l].domRow || rowObj[l].domRow == 0) {
              let domCellEle = tableEle.rows[rowObj[l].domRow].cells[rowObj[l].domCol];
              if (rowObj[l].mergeRowNum > 1 || rowObj[l].mergeColNum > 1) {
                mCell = rowObj[l];
              } else if (!mCell && rowObj[l].mCell) {
                mCell = rowObj[l].mCell;
              } else if (!rowObj[l].mCell) {
                let rowHeight = 0;
                if (domCellEle.style.height) {
                  rowHeight = parseFloat(domCellEle.style.height);
                } else {
                  rowHeight = parseFloat(domCellEle.getAttribute("height"));
                }
                if (!isNaN(rowHeight)) {
                  rowSize["" + k] = rowHeight;
                }
                break;
              }
            }
          }
          if (!rowSize[k] && mCell) {
            let domCellEle = tableEle.rows[mCell.domRow].cells[mCell.domCol];
            let rowHeight = 0;
            if (domCellEle.style.height) {
              rowHeight = parseFloat(domCellEle.style.height);
            } else {
              rowHeight = parseFloat(domCellEle.getAttribute("height"));
            }
            if (!isNaN(rowHeight)) {
              rowSize[k] = rowHeight / mCell.mergeRowNum
            }
          }
        }
      }
      for (let l = 0; l < tableJson.rows[0].length; l++) {
        //可能存在合并单元格，
        if (!colSize[l]) {
          //寻找非合并单元格，填充大小，如果找不到则用合并单元格大小的平均数
          let mCell = null;

          for (let k = 0; k < tableJson.rows.length; k++) {
            if (tableJson.rows[k][l].domRow || tableJson.rows[k][l].domRow == 0) {
              let domCellEle = tableEle.rows[tableJson.rows[k][l].domRow].cells[tableJson.rows[k][l].domCol];
              if (tableJson.rows[k][l].mergeRowNum > 1 || tableJson.rows[k][l].mergeColNum > 1) {
                mCell = tableJson.rows[k][l];
              } else if (!mCell && tableJson.rows[k][l].mCell) {
                mCell = tableJson.rows[k][l].mCell;
              } else if (!tableJson.rows[k][l].mCell) {
                let colWidth = 0;
                if (domCellEle.style.width) {
                  colWidth = parseFloat(domCellEle.style.width);
                } else {
                  colWidth = parseFloat(domCellEle.getAttribute("width"));
                }
                if (!isNaN(colWidth)) {
                  colSize["" + l] = colWidth;
                }
                break;
              }
            }
          }
          if (!colSize[l] && mCell) {
            let domCellEle = tableEle.rows[mCell.domRow].cells[mCell.domCol];
            let colWidth = 0;
            if (domCellEle.style.width) {
              colWidth = parseFloat(domCellEle.style.width);
            } else {
              colWidth = parseFloat(domCellEle.getAttribute("width"));
            }
            if (!isNaN(colWidth)) {
              colSize[l] = colWidth / mCell.mergeColNum
            }
          }
        }
      }
      //写入单元格大小
      for (let k = 0; k < tableJson.rows.length; k++) {
        let rowObj = tableJson.rows[k];
        for (let l = 0; l < rowObj.length; l++) {
          if (k == 0) {
            if (isNaN(colSize["" + l])) {
              colSize["" + l] = 40
            }
            tableWidth += colSize["" + l];
          }
          if (l == 0) {
            if (isNaN(rowSize["" + k])) {
              rowSize["" + k] = 20
            }
            tableHeight += rowSize["" + k];
          }

          //如果是合并单元格
          if (rowObj[l].mergeRowNum > 1 || rowObj[l].mergeColNum > 1) {
            //计算高度和宽度
            let mHeight = 0
            let mWidth = 0
            for (let ki = 1; ki <= rowObj[l].mergeRowNum; ki++) {
              if (isNaN(rowSize["" + (k + ki - 1)])) {
                rowSize["" + (k + ki - 1)] = 20
              }
              mHeight += rowSize["" + (k + ki - 1)];
            }
            for (let ki = 1; ki <= rowObj[l].mergeColNum; ki++) {
              if (isNaN(colSize["" + (l + ki - 1)])) {
                colSize["" + (l + ki - 1)] = 40
              }
              mWidth += colSize["" + (l + ki - 1)];
            }
            rowObj[l].height = mHeight;
            rowObj[l].width = mWidth;
            rowObj[l].originWidth = colSize["" + l];
            rowObj[l].originHeight = rowSize["" + k];
            delete rowObj[l].domRow
            delete rowObj[l].domCol
          }
          //如果不是合并单元格但是属于合并单元格区域，则属于被合并单元格
          else if (rowObj[l].mCell) {
            rowObj[l].originWidth = colSize["" + l];
            rowObj[l].originHeight = rowSize["" + k];
            delete rowObj[l].mCell
            delete rowObj[l].domRow
            delete rowObj[l].domCol
          }
          //普通单元格
          else {
            rowObj[l].width = colSize["" + l];
            rowObj[l].height = rowSize["" + k];
            delete rowObj[l].domRow
            delete rowObj[l].domCol
          }
        }
      }
      tableJson.height = tableHeight
      tableJson.width = tableWidth
      return tableJson
    }
  }

  //创建新的表格
  createTable(tableJson: object, x: number, y: number, stage: DDeiStage, container: object, evt: Event): void {
    //当前激活的图层
    let layer = stage.layers[stage.layerIndex];
    let tableModel = DDeiTable.loadFromJSON(tableJson, { currentDdInstance: stage.ddInstance, currentStage: stage, currentLayer: layer, currentContainer: container });
    stage.idIdx++
    let newId = "table_" + stage.idIdx;
    tableModel.id = newId
    tableModel.x = x - tableModel.width / 2;
    tableModel.y = y - tableModel.height / 2;
    tableModel.resetCellData();
    stage.ddInstance.bus.push(DDeiEnumBusCommandType.ModelChangeContainer, { newContainer: container, models: [tableModel] }, evt);
    stage.ddInstance.bus.push(DDeiEnumBusCommandType.CancelCurLevelSelectedModels, null, evt);
    stage.ddInstance.bus.push(DDeiEnumBusCommandType.ModelChangeSelect, { models: [tableModel], value: DDeiEnumControlState.SELECTED }, evt);
  }


  //创建新的控件
  createControl(jsonArray: [], jsonLinkArray: [], x: number, y: number, stage: DDeiStage, container: object, mode: string, evt: Event): void {
    //当前激活的图层
    let layer = stage.layers[stage.layerIndex];
    let models: DDeiAbstractShape[] = []
    let oldIdMap = {}
    jsonArray.forEach(json => {
      if (mode == 'copy') {
        
        let copyModel = stage.ddInstance.controlModelClasses[json.modelType].loadFromJSON(json, { currentDdInstance: stage.ddInstance, currentStage: stage, currentLayer: layer, currentContainer: container });
        models.push(copyModel);
        this.loadJsonModelToMap(copyModel,stage,mode, oldIdMap)
        this.changeModelId(stage, copyModel)
      } else if (mode == 'cut') {
        let model = stage.getModelById(json.id);
        models.push(model);
        this.loadJsonModelToMap(model, stage, mode, oldIdMap)
      }
    });
    
    //加载事件的配置
    let rsState = -1
    if(mode == 'copy'){
      rsState = DDeiUtil.invokeCallbackFunc("EVENT_CONTROL_CREATE_BEFORE", DDeiEnumOperateType.CREATE, { models: models }, stage.ddInstance)
    } else if (mode == 'cut') {
      rsState = DDeiUtil.invokeCallbackFunc("EVENT_CONTROL_DRAG_BEFORE", DDeiEnumOperateType.DRAG, { models: models }, stage.ddInstance)
    }
    //选中前
    if (rsState != -1) {
      //重新计算坐标，基于粘贴的中心点
      let outRect = DDeiAbstractShape.getOutRectByPV(models);
      outRect = { x: outRect.x + outRect.width / 2, y: outRect.y + outRect.height / 2 }
      //处理links信息,构建新的link信息
      if (mode == 'copy') {
        let appendExPvs = {}
        jsonLinkArray?.forEach(lk => {
          let sm = null;
          let dm = null;
          if (lk.smid) {
            sm = oldIdMap[lk.smid]
          }
          if (lk.dmid) {
            dm = oldIdMap[lk.dmid]
          }
          //重命名关联的smpath以及点
          if (lk.smpath) {
            let sourcePV = DDeiUtil.getDataByPathList(sm, lk.smpath)
            let newId = "_" + DDeiUtil.getUniqueCode()
            sourcePV.id = newId
            if (!appendExPvs[sm.id]) {
              appendExPvs[sm.id] = {}
            }
            appendExPvs[sm.id][newId] = sourcePV
            lk.smpath = "exPvs." + newId
          }
          let link = new DDeiLink({
            group: lk.group,
            smpath: lk.smpath,
            dmpath: lk.dmpath,
            stage: stage,
            sm: sm,
            dm: dm
          });
          stage.links.push(link);
        })
        
        for (let m in oldIdMap) {
          let item = oldIdMap[m];
          item.exPvs = {}
          if (appendExPvs[item.id]) {
            item.exPvs = appendExPvs[item.id]
          }
          //处理linkmodels
          if (item.baseModelType == 'DDeiLine') {
            let linkModels: Map<string, DDeiLineLink> = new Map<string, DDeiLineLink>();
            for (let key in item.linkModels) {
              let lkItem = item.linkModels[key];
              if (lkItem?.dmid) {
                let dm = oldIdMap[lkItem.dmid]
                lkItem.dm = dm
                lkItem.line = item;
                let lm = new DDeiLineLink(lkItem);
                linkModels.set(dm.id, lm)
              }
            }
            item.linkModels = linkModels
          }
        }


        stage.refreshLinkCache()
      }
      models.forEach(item => {
        
        let cpx = item.cpv.x;
        let cpy = item.cpv.y;
        let dx = outRect.x - cpx;
        let dy = outRect.y - cpy;
        let moveMatrix = new Matrix3(
          1, 0, x - dx - cpx,
          0, 1, y - dy - cpy,
          0, 0, 1
        )
        item.transVectors(moveMatrix)

      })
     

      stage.ddInstance.bus.push(DDeiEnumBusCommandType.ModelChangeContainer, { newContainer: container, models: models }, evt);
      stage.ddInstance.bus.push(DDeiEnumBusCommandType.CancelCurLevelSelectedModels, null, evt);
      stage.ddInstance.bus.push(DDeiEnumBusCommandType.ModelChangeSelect, { models: models, value: DDeiEnumControlState.SELECTED }, evt);
      if (mode == 'copy') {
        stage.ddInstance.bus.push(DDeiEnumBusCommandType.NodifyControlCreated, {
          models: models,
        });
      } else if (mode == 'cut') {
        DDeiUtil.invokeCallbackFunc("EVENT_CONTROL_DRAG_AFTER", DDeiEnumOperateType.DRAG, { models: models }, stage.ddInstance, evt)
      }
    }
  }

  /**
   * 修改模型ID
   * @param stage 舞台
   * @param item 控件
   * @return 新的ID
   */
  changeModelId(stage: DDeiStage, item: DDeiAbstractShape): string {
    stage.idIdx++
    let newId = ""
    if (item.id.indexOf("_") != -1) {
      newId = item.id.substring(0, item.id.lastIndexOf("_")) + "_" + stage.idIdx;
    } else {
      newId = item.id + "_cp_" + stage.idIdx;
    }
    item.id = newId
    item.unicode = DDeiUtil.getUniqueCode()
    let accuContainer = item.getAccuContainer()
    if (accuContainer?.baseModelType == 'DDeiContainer') {
      let midList: string = []
      let models: Map<string, DDeiAbstractShape> = new Map<string, DDeiAbstractShape>();
      accuContainer.midList.forEach(mid => {
        let model = accuContainer.models.get(mid);
        let modelNewId = this.changeModelId(stage, model)
        models.set(modelNewId, model)
        midList.push(modelNewId)
      })
      accuContainer.models = models
      accuContainer.midList = midList
    } else if (accuContainer?.baseModelType == 'DDeiTable') {
      for (let i = 0; i < accuContainer.rows; i++) {
        let rowObj = accuContainer.rows[i];
        for (let j = 0; j < rowObj.length; j++) {
          let accuContainer = rowObj[j].getAccuContainer()
          let midList: string[] = []
          let models: Map<string, DDeiAbstractShape> = new Map<string, DDeiAbstractShape>();
          accuContainer.midList.forEach(mid => {
            let model = accuContainer.models.get(mid);
            let modelNewId = this.changeModelId(stage, model)
            models.set(modelNewId, model)
            midList.push(modelNewId)
          })
          accuContainer.models = models
          accuContainer.midList = midList
        }
      }
    }
    return newId;
  }

  //创建新的图片控件
  createNewImage(image: Image, imgBase64: string, x: number, y: number, stage: DDeiStage, container: object, evt: Event): void {
    stage.idIdx++
    let rat1 = stage.ddInstance.render.ratio;
    let stageRatio = stage.getStageRatio()

    let dataJson = {
      id: "img_" + stage.idIdx,
      modelCode: "100002"
    };


    let ccDefine = DDeiUtil.getControlDefine(dataJson)
    for (let i in ccDefine?.define) {
      dataJson[i] = ccDefine?.define[i];
    }
    dataJson.text = "";
    dataJson.border = { type: 0 };
    dataJson.fill = { type: 2 };
    dataJson.fill.image = imgBase64
    dataJson.width = image.width / rat1 / stageRatio;
    dataJson.height = image.height / rat1 / stageRatio;
    //如果有from则根据from读取属性
    delete dataJson.ovs

    let model: DDeiAbstractShape = DDeiPolygon.initByJSON(
      dataJson,
      { currentStage: stage }
    );

    model.initPVS()

    let moveMatrix = new Matrix3(
      1, 0, x,
      0, 1, y,
      0, 0, 1
    )

    model.transVectors(moveMatrix)
    // model.setImgBase64(imgBase64);

    stage.ddInstance.bus.push(DDeiEnumBusCommandType.ModelChangeContainer, { newContainer: container, models: [model] }, evt);
    stage.ddInstance.bus.push(DDeiEnumBusCommandType.CancelCurLevelSelectedModels, null, evt);
    stage.ddInstance.bus.push(DDeiEnumBusCommandType.ModelChangeSelect, { models: [model], value: DDeiEnumControlState.SELECTED }, evt);
    stage.ddInstance.bus.push(DDeiEnumBusCommandType.StageChangeSelectModels);
  }


  loadJsonModelToMap(json,stage,mode,map){
    map[json.id] = json
    
    if(json.baseModelType == 'DDeiContainer'){
      json.models.forEach(item => {
        this.loadJsonModelToMap(item,stage,mode,map)
      });
        
    }
  }
}

export default DDeiKeyActionPaste
