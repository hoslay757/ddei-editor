import {DDeiConfig} from "ddei-framework";
import {DDei} from "ddei-framework";
import { DDeiModelArrtibuteValue} from "ddei-framework";
import {DDeiEditor} from "ddei-framework";
import {DDeiEditorEnumBusCommandType} from "ddei-framework";
import {DDeiEditorState} from "ddei-framework";
import {DDeiKeyAction} from "ddei-framework";
import { DDeiUtil } from "ddei-framework"

/**
 * 键行为:复制
 * 复制当前的已选控件
 */
class DDeiKeyActionCopy extends DDeiKeyAction {

  name: string = "ddei-core-keyaction-copy"


  /**
   * 缺省实例
   */
  static defaultIns: DDeiKeyActionCopy = new DDeiKeyActionCopy();

  defaultOptions: object = {
    'keys': [
      { ctrl: 1, keys: "67", editorState: DDeiEditorState.DESIGNING },
    ]
  }

  isActive(element: object): boolean {
    if (!element) {
      return true
    }
    if (element.tagName == 'BODY' || element.tagName == 'HEAD' || element.tagName == 'HTML') {
      return true
    }

    return false
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
          if (options[DDeiKeyActionCopy.defaultIns.name]) {
            for (let i in options[DDeiKeyActionCopy.defaultIns.name]) {
              newOptions[i] = options[DDeiKeyActionCopy.defaultIns.name][i]
            }
          }
        }
      } else {
        newOptions = options
      }
      if (newOptions && Object.keys(newOptions).length !== 0) {
        let panels = new DDeiKeyActionCopy(newOptions);
        return panels;
      }
    }
    return DDeiKeyActionCopy;
  }

  static modify(fn) {
    return DDeiKeyActionCopy.defaultIns.modify(fn)
  }


  // ============================ 方法 ===============================
  async action(evt: Event, ddInstance: DDei, editor: DDeiEditor): boolean {
    //修改当前操作控件坐标
    if (ddInstance && ddInstance.stage && this.isActive(document.activeElement)) {
      //当前激活的图层
      let selectedControls = ddInstance.stage.selectedModels;
      let rsState = DDeiUtil.invokeCallbackFunc("EVENT_COPY_BEFORE", "COPY", { models: selectedControls}, ddInstance)
      if (rsState == 0 || rsState == 1){
        //存在选中控件
        if (selectedControls?.size > 0) {
          //按照midlist排序输出
          let models = Array.from(selectedControls.values())
          let sortedModels = []
          let modelLines = [];
          let selectedSubAllModels = new Map()
          models[0].pModel.midList.forEach(mid => {
            models.forEach(item => {
              if (item.id == mid) {
                sortedModels.push(item)
                if(item.baseModelType == 'DDeiContainer'){
                  let subLines = item.getModelsByBaseType("DDeiLine")
                  let subModels = item.getSubModels(null,100)
                  if (subModels?.length > 0){
                    subModels.forEach(element => {
                      selectedSubAllModels.set(element.id, element)
                    });
                    
                  }
                  if (subLines?.length > 0){
                    modelLines.push(...subLines)
                  }
                }else if(item.baseModelType == 'DDeiLine'){
                  modelLines.push(item)
                }
              }
            })
          })
          //生成控件HTML
          let copyHtml = '<html><head>';
          copyHtml += '<meta source="ddei">'
          let jsonStr = '['
          let jsonLinksStr = '['
          let innerHTML = ''
          sortedModels?.forEach((model, key) => {
            if (selectedControls?.size == 1) {
              if (model.baseModelType == "DDeiTable") {
                if (model.curRow == -1 && model.curCol == -1) {
                  let json = model.toJSON();
                  
                  jsonStr += JSON.stringify(json) + ","
                }
                let html = model.render.getHTML();
                if (html) {
                  innerHTML += html
                }
              } else {
                let json = model.toJSON();
                jsonStr += JSON.stringify(json) + ","
              }
            } else {
              let json = model.toJSON();
              jsonStr += JSON.stringify(json) + ","
            }
            //需要进一步复制其依附控件linkModels
            model.linkModels?.forEach(lineLM => {
              if (lineLM.dm) {
                if (!selectedControls.has(lineLM.dm.id) && !selectedSubAllModels.has(lineLM.dm.id)) {
                  //添加到复制的model中
                  let json = lineLM.dm.toJSON();
                  jsonStr += JSON.stringify(json) + ","
                }
              }
            });
          })
          
          modelLines.forEach(line=>{
            
            //如果控件为线段，则复制linkModels
            let distModelLinks = ddInstance.stage?.getDistModelLinks(line.id)
            //如果被复制的控件也在linkmodels里面，则需要复制linkModel信息
            distModelLinks?.forEach(link => {
              if (selectedControls?.has(link?.sm?.id) || selectedSubAllModels?.has(link?.sm?.id)) {
                jsonLinksStr += JSON.stringify(link) + ","
              }
            })
            
            
          })
       
          if (jsonStr.length > 1) {

            jsonStr = jsonStr.substring(0, jsonStr.length - 1)
            jsonStr += ']'
            ddInstance.stage.copyMode = "copy"
            jsonStr = '{"mode":"copy","data":' + jsonStr
            if (jsonLinksStr.length > 1) {
              jsonLinksStr = jsonLinksStr.substring(0, jsonLinksStr.length - 1)
              jsonLinksStr += ']'
              jsonStr += " , \"links\":" + jsonLinksStr
            }
            //读取当前单位
            //标尺单位
            let ruleDisplay
            let ruleInit
            if (ddInstance.stage.ruler?.display || ddInstance.stage.ruler?.display == 0 || ddInstance.stage.ruler?.display == false) {
              ruleDisplay = ddInstance.stage.ruler.display;
            } else if (ddInstance.ruler != null && ddInstance.ruler != undefined) {
              if (typeof (ddInstance.ruler) == 'boolean') {
                ruleDisplay = ddInstance.ruler ? 1 : 0;
              } else {
                ruleInit = ddInstance.ruler
                ruleDisplay = ruleInit.display;
              }
            } else {
              ruleDisplay = DDeiModelArrtibuteValue.getAttrValueByState(ddInstance.stage, "ruler.display", true);
            }


            //处理点坐标变换
            if (ruleDisplay) {
              //写入unit用于单位换算还原
              // json.dpi = this.ddInstance?.dpi?.x;
              let unit = DDeiModelArrtibuteValue.getAttrValueByState(ddInstance.stage, "ruler.unit", true, ruleInit);
              jsonStr += ',"unit":"'+unit+'"'
            }
            jsonStr += "}"

          } else {
            jsonStr = "";
          }
          copyHtml += jsonStr + '<meta source="ddeiend">'
          copyHtml += '</head><body>' + innerHTML + '</body></html>'
          let blob = new Blob([copyHtml], {
            type: 'text/html'
          })

          //如果不支持剪切板，则采用window对象存储，此时不允许外部复制粘贴
          if (DDeiConfig.ALLOW_CLIPBOARD || DDeiConfig.ALLOW_CLIPBOARD == undefined) {
            try {
              let writeDatas = []
              writeDatas.push(new ClipboardItem({ "text/html": blob }));

              let cbData = navigator.clipboard;
              cbData.write(writeDatas).then(function () {
                editor.bus.push(DDeiEditorEnumBusCommandType.RefreshEditorParts, {
                  parts: ["topmenu"],
                });
                editor.bus.executeAll();
                editor.changeState(DDeiEditorState.DESIGNING);
              }, function (e) {
                console.error("复制失败" + e);
              });
            } catch (e) {
              DDeiConfig.ALLOW_CLIPBOARD = false
            }
          }

          if (!DDeiConfig.ALLOW_CLIPBOARD) {
            window.DDEI_CLIPBOARD = blob
          }
          return true;
        }
      }
    }

    return false
  }

}


export default DDeiKeyActionCopy
