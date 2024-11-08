<template>
  <div class="ddei-core-panel-fileinfo">
    <div class="header"></div>
    <div class="content">
      <div class="part">
        <div class="button-v" @click="newFile" :title="editor.i18n('ddei.new') ">
          <svg class="icon" aria-hidden="true">
            <use xlink:href="#icon-new-file"></use>
          </svg>
          <div class="text">{{ editor.i18n('ddei.new')}}</div>
        </div>
      </div>
      <div class="part">
        <div class="button-v" @click="openFile" :title="editor.i18n('ddei.open') ">
          <svg class="icon" aria-hidden="true">
            <use xlink:href="#icon-folder"></use>
          </svg>
          <div class="text">{{ editor.i18n('ddei.open') }}</div>
        </div>
      </div>
      <div class="part">
        <div class="button-v" @click="save" :title="editor.i18n('ddei.save') ">
          <svg class="icon" aria-hidden="true">
            <use xlink:href="#icon-save"></use>
          </svg>
          <div class="text">{{ editor.i18n('ddei.save') }}</div>
        </div>
      </div>
      <div class="part">
        <div class="button-v" @click="download" :title="editor.i18n('ddei.download') ">
          <svg class="icon" aria-hidden="true">
            <use xlink:href="#icon-download"></use>
          </svg>
          <div class="text">{{ editor.i18n('ddei.download') }}</div>
        </div>
      </div>

    </div>
    <div class="tail">
      {{ editor.i18n('ddei.file') }}
    </div>
  </div>
</template>
<script lang="ts">

import {DDeiEnumBusCommandType} from "ddei-framework";
import {DDeiEditor} from "ddei-framework";
import {DDeiActiveType} from "ddei-framework";
import {DDeiEditorEnumBusCommandType} from "ddei-framework";
import {DDeiEditorState} from "ddei-framework";
import {DDeiFileState} from "ddei-framework";
import {DDeiFile} from "ddei-framework";
import {DDeiStage} from "ddei-framework";
import {DDeiSheet} from "ddei-framework";
import { DDeiUtil, DDeiEditorUtil } from "ddei-framework";

export default {
  name: "ddei-core-panel-fileinfo",
  extends: null,
  mixins: [],
  props: {
    //外部传入的插件扩展参数
    options: {
      type: Object,
      default: null
    }
    , editor: {
      type: DDeiEditor,
      default: null,
    }
  },
  data() {
    return {
      file: {},
      fileNameEditing: false,
      fileDescEditing: false,
    };
  },
  computed: {},
  watch: {},
  created() { },
  mounted() {
    this.file = this.editor?.files[this.editor?.currentFileIndex];
  },
  methods: {

    /**
     * 保存
     * @param evt
     */
    save(evt) {
      this.editor.changeState(DDeiEditorState.DESIGNING);
      this.editor.bus.push(DDeiEditorEnumBusCommandType.ClearTemplateUI);
      this.editor.bus.push(DDeiEditorEnumBusCommandType.SaveFile, {}, evt);
      this.editor.bus.executeAll();
    },

    /**
     * 下载文件
     */
    download(evt) {
      if (this.editor?.ddInstance?.stage) {
        //获取json信息
        let file = this.editor?.files[this.editor?.currentFileIndex];
        if (file) {
          let json = file.toJSON();
          if (json) {
            // 创建隐藏的可下载链接
            let eleLink = document.createElement("a");
            eleLink.download = file.name + ".dei";
            eleLink.style.display = "none";
            // 字符内容转变成blob地址
            let blob = new Blob([JSON.stringify(json)]);
            eleLink.href = URL.createObjectURL(blob);
            // 触发点击
            document.body.appendChild(eleLink);
            eleLink.click();
            // 然后移除
            document.body.removeChild(eleLink);
            this.editor.changeState(DDeiEditorState.DESIGNING);
          }
        }

      }
    },

    /**
     * 打开文件
     * @param evt
     */
    async openFile(evt) {
      let rsState = DDeiEditorUtil.invokeCallbackFunc("EVENT_ADD_FILE_BEFORE", "LOAD_FILE", null, this.editor.ddInstance, evt)
      if (rsState != -1) {
        let openFileHandle = await showOpenFilePicker({
          description: this.editor.i18n('ddei.fileDescription'),
          types: [{
            accept: {

              'text/plain': ['.dei']
            }
          }]
        })
        //获取图片数据  这个file其实就是和input元素<input type="file" id="file">，document.querySelector("#file").files[0]一样
        let openFile = await openFileHandle[0].getFile();
        //转成base64
        let read = new FileReader();
        read.readAsText(openFile);
        read.onload = async () => {
          //创建img，插入页面中
          let result = read.result;
          let resultJSON = JSON.parse(result);
          let ddInstance = this.editor?.ddInstance;
          let file = DDeiFile.loadFromJSON(resultJSON, {
            currentDdInstance: ddInstance,
          });
          let openedFiles = this.editor.files;
          let openedFileIndex = -1
          if(!file.id){
            file.id = DDeiUtil.getUniqueCode()
          }
          for (let fi = 0; fi < openedFiles.length; fi++) {
            if ((openedFiles[fi].id && openedFiles[fi].id == file.id)) {
              openedFileIndex = fi
              break;
            }
          }
          ddInstance.stage.destroyRender()
          if (openedFileIndex == -1) {
            file.localFileHandler = openFileHandle[0]
            file.local = 1
            this.editor.addFile(file);
            for (let x = 0; x < this.editor.files.length; x++) {
              this.editor.files[x].active = DDeiActiveType.NONE;
            }
            this.editor.currentFileIndex = this.editor.files.length - 1;
            file.state = DDeiFileState.NONE;
            file.active = DDeiActiveType.ACTIVE;
            let sheets = file?.sheets;

            if (file && sheets && ddInstance) {
              file.changeSheet(file.currentSheetIndex);

              let stage = sheets[file.currentSheetIndex].stage;
              
              stage.ddInstance = ddInstance;
              ddInstance.disabled = false
              //记录文件初始日志
              file.initHistroy();
              file.histroy[0].isNew = true;
              //刷新页面
              ddInstance.stage = stage;
              //加载场景渲染器
              stage.initRender();
              //设置视窗位置到中央
              if (!stage.wpv) {
                //缺省定位在画布中心点位置
                stage.wpv = {
                  x:
                    -(
                      stage.width -
                      ddInstance.render.container.clientWidth
                    ) / 2,
                  y:
                    -(
                      stage.height -
                      ddInstance.render.container.clientHeight
                    ) / 2,
                  z: 0,
                };
              }
              this.editor.changeState(DDeiEditorState.DESIGNING);
              ddInstance.bus.push(
                DDeiEditorEnumBusCommandType.ClearTemplateUI
              );
              ddInstance.bus.push(
                DDeiEditorEnumBusCommandType.RefreshEditorParts,
                { parts: ["bottommenu", "topmenu"] }
              );
              ddInstance?.bus?.push(DDeiEnumBusCommandType.RefreshShape);
              ddInstance?.bus?.executeAll();
            }
          } else {
            
            file = this.editor.files[openedFileIndex]
            if (file && ddInstance) {
              for (let x = 0; x < this.editor.files.length; x++) {
                this.editor.files[x].active = DDeiActiveType.NONE;
              }
              file.active = DDeiActiveType.ACTIVE
              this.editor.currentFileIndex = openedFileIndex;
              let stage = file.sheets[file.currentSheetIndex].stage;
              stage.ddInstance = ddInstance;
              
              //刷新页面
              ddInstance.stage = stage;
              ddInstance.disabled = false
              //加载场景渲染器
              stage.initRender();
              this.editor.changeState(DDeiEditorState.DESIGNING);
              ddInstance.bus.push(
                DDeiEditorEnumBusCommandType.ClearTemplateUI
              );
              ddInstance.bus.push(
                DDeiEditorEnumBusCommandType.RefreshEditorParts,
                { parts: ["bottommenu", "topmenu"] }
              );
              ddInstance?.bus?.push(DDeiEnumBusCommandType.RefreshShape);
              ddInstance?.bus?.executeAll();
            }
          }
          DDeiEditorUtil.invokeCallbackFunc("EVENT_ADD_FILE_AFTER", "LOAD_FILE", {file:file}, this.editor.ddInstance, evt)
        }
      }
    },

    /**
     * 新建文件
     * @param evt
     */
    newFile(evt) {
      if (this.editor?.ddInstance) {
        let ddInstance = this.editor.ddInstance;
        let fileText = this.editor.i18n('ddei.file')
        let newText = this.editor.i18n('ddei.new')
        let pageText = this.editor.i18n('ddei.page')
        let file = DDeiFile.loadFromJSON(
          {
            name: newText+fileText+"_NEW",
            path: "/"+newText+fileText+"_NEW",
            sheets: [
              new DDeiSheet({
                name: pageText+"-1",
                desc: pageText+"-1",
                stage: DDeiStage.initByJSON({ id: "stage_1" }, { currentDdInstance: ddInstance }),
                active: DDeiActiveType.ACTIVE,
              }),
            ],
            currentSheetIndex: 0,
            state: DDeiFileState.NEW,
            active: DDeiActiveType.ACTIVE,
          },
          { currentDdInstance: ddInstance }
        );
        //添加文件
        if (this.editor.currentFileIndex != -1) {
          this.editor.files[this.editor.currentFileIndex].active =
            DDeiActiveType.NONE;
        }
        this.editor.addFile(file);
        this.editor.currentFileIndex = this.editor.files.length - 1;
        let sheets = file?.sheets;
        if (file && sheets && ddInstance) {
          ddInstance.stage.destroyRender()
          let stage = sheets[0].stage;
          stage.ddInstance = ddInstance;
          //刷新页面
          ddInstance.stage = stage;
          //记录文件初始日志
          file.initHistroy();
          //设置视窗位置到中央
          if (!stage.wpv) {
            //缺省定位在画布中心点位置
            stage.wpv = {
              x: -(stage.width - ddInstance.render.container.clientWidth) / 2,
              y: -(stage.height - ddInstance.render.container.clientHeight) / 2,
              z: 0,
            };
          }
          //加载场景渲染器
          stage.initRender();
          ddInstance.bus.push(DDeiEditorEnumBusCommandType.ClearTemplateUI);
          ddInstance.bus.push(DDeiEnumBusCommandType.RefreshShape);
          ddInstance.bus.push(DDeiEditorEnumBusCommandType.RefreshEditorParts, {
            parts: ["bottommenu", "topmenu"],
          });

          this.editor.changeState(DDeiEditorState.DESIGNING);
          ddInstance?.bus?.executeAll();
        }
      }
    },
  },
};
</script>

<style lang="less" scoped>
.ddei-core-panel-fileinfo {
  height: 103px;
  width: 230px;
  flex:0 1 230px;
  display: grid;
  grid-template-rows: 20px 57px 26px;
  grid-template-columns: 1fr;
  text-align: center;

  .content {
    display: flex;
    justify-content: center;
    align-items: center;
    border-right: 1px solid var(--panel-border);//darken(var(--panel-header), 13%);
    padding: 0px 4px;

    .part {
      padding: 0px 2px;
      flex: 1;
      display: flex;
      justify-content: center;
      align-items: center;

      .button-v {
        flex: 1;
        height: 50px;
        display: flex;
        flex-direction: column;
        align-items: center;

        .text {
          white-space: nowrap;
          flex: 0 0 13px;
          font-size: 14px;
          font-weight: 400;
          color: var(--panel-title);
        }
      }

      .button-v:hover {
        cursor: pointer;
        background-color: var(--panel-hover);
      }

      .button-h {
        flex: 1;

        display: flex;
        flex-direction: column;
        margin-top: -2px;

        .button {
          flex: 1;
          display: flex;
          justify-content: center;
          align-items: center;
          border-radius: 4px;
          .icon {
            font-size: 28px;
            flex: 1;
          }

          .text {
            white-space: nowrap;
            flex: 0 0 25px;
            font-size: 14px;
            font-weight: 400;
            color: var(--panel-title);
          }
        }

        .button:hover {

          cursor: pointer;
          background-color: var(--panel-hover);
        }

      }
    }
  }

  .tail {
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 14px;
    font-weight: 400;
    color: var(--panel-title); // fade(var(--panel-title), 40%);
    border-right: 1px solid var(--panel-border);//darken(var(--panel-header), 13%);
  }
}
</style>
