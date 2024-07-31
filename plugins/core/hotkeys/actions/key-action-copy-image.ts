import {DDeiConfig} from "ddei-framework";
import {DDei} from "ddei-framework";
import {DDeiAbstractShape} from "ddei-framework";
import {DDeiUtil} from "ddei-framework";
import {DDeiEditor} from "ddei-framework";
import {DDeiEditorEnumBusCommandType} from "ddei-framework";
import {DDeiEditorState} from "ddei-framework";
import {DDeiKeyAction} from "ddei-framework";

/**
 * 键行为:复制为图片
 * 复制当前的已选控件
 */
class DDeiKeyActionCopyImage extends DDeiKeyAction {
  name: string = "ddei-core-keyaction-copy-image"


  /**
   * 缺省实例
   */
  static defaultIns: DDeiKeyActionCopyImage = new DDeiKeyActionCopyImage();

  defaultOptions: object = {
    'keys': [
      { ctrl: 1, keys: "73", editorState: DDeiEditorState.DESIGNING},
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
          if (options[DDeiKeyActionCopyImage.defaultIns.name]) {
            for (let i in options[DDeiKeyActionCopyImage.defaultIns.name]) {
              newOptions[i] = options[DDeiKeyActionCopyImage.defaultIns.name][i]
            }
          }
        }
      } else {
        newOptions = options
      }
      if (newOptions && Object.keys(newOptions).length !== 0) {
        let panels = new DDeiKeyActionCopyImage(newOptions);
        return panels;
      }
    }
    return DDeiKeyActionCopyImage;
  }
  // ============================ 方法 ===============================
  action(evt: Event, ddInstance: DDei, editor: DDeiEditor): void {
    if (DDeiConfig.ALLOW_CLIPBOARD || DDeiConfig.ALLOW_CLIPBOARD == undefined) {

      //修改当前操作控件坐标
      if (ddInstance && ddInstance.stage) {
        //当前激活的图层
        let selectedControls = ddInstance.stage.selectedModels;
        //存在选中控件
        let models = null
        if (selectedControls?.size > 0) {
          models = Array.from(selectedControls?.values());
        }
        this.copyToImage(editor, ddInstance, models)
      }


    }
  }

  copyToImage(editor, ddInstance, models) {
    try {
      let dataURL = ddInstance.stage.toImageDataUrl(models)
      let blob = DDeiUtil.dataURLtoBlob(dataURL)
      let cbData = navigator.clipboard;
      //得到blob对象
      let writeDatas = [new ClipboardItem({ [blob.type]: blob })]
      cbData.write(writeDatas).then(function () {
        editor.bus.push(DDeiEditorEnumBusCommandType.RefreshEditorParts, {
          parts: ["topmenu"],
        });
        editor.bus.executeAll();
        editor.changeState(DDeiEditorState.DESIGNING);
      });
    } catch (e) {
      console.error(e)
      DDeiConfig.ALLOW_CLIPBOARD = false
    }

  }

}


export default DDeiKeyActionCopyImage
