<template>
  <div @mousedown="changeEditorFocus" v-if="forceRefresh" ref="topmenu" class="ddei-core-panel-topmenu-simple">
    <div
      :class="{ 'item-drag': options?.drag == 1 && options?.direct != 2, 'item-drag-2': options?.drag == 1 && options?.direct == 2, 'item-block': options?.drag != 1 }"
      @mousedown="options?.drag == 1 && prepareDragBox()">
    </div>
    <div class="item" v-if="!options?.items" @click="newFile">
      {{ editor.i18n('ddei.new') }}
    </div>
    <div class="item" v-if="!options?.items" @click="openFile">
      {{ editor.i18n('ddei.open') }}
    </div>
    <div class="item" v-if="!options?.items" @click="save">
      {{ editor.i18n('ddei.save') }}
    </div>
    <div class="item" v-if="!options?.items" @click="download">
      {{ editor.i18n('ddei.download') }}
    </div>
    <div class="item" v-for="menu in options?.items">
      <div v-if="menu && !menu.viewer && menu.id" @click="internalAction(menu.id,$event)">{{ editor.i18n(menu.name) }}</div>
      <div v-if="menu && !menu.viewer && !menu.id" @click="menu.action(editor,$event)">{{ editor.i18n(menu.name) }}</div>
      <component v-if="menu && menu.viewer" :is="menu.viewer" :options="options" :editor="editor"></component>
    </div>

    <div class="item-block"></div>
  </div>
</template>

<script lang="ts">
import {DDeiEditor} from "ddei-framework";
import {DDeiEditorState} from "ddei-framework";
import {DDeiEditorUtil} from "ddei-framework";
import {DDeiEditorEnumBusCommandType} from "ddei-framework";
import {DDeiUtil} from "ddei-framework";
import {DDeiEnumBusCommandType} from "ddei-framework";
import { DDeiActiveType } from "ddei-framework";
import { DDeiFileState } from "ddei-framework";
import { DDeiFile } from "ddei-framework";
import { DDeiStage } from "ddei-framework";
import { DDeiSheet } from "ddei-framework";

export default {
  name: "ddei-core-panel-topmenu-simple",
  extends: null,
  mixins: [],
  props: {
    //外部传入的插件扩展参数
    options: {
      type: Object,
      default: null
    },
    editor: {
      type: DDeiEditor,
      default: null,
    },
  },
  data() {
    return {
      forceRefresh: true
    };
  },
  computed: {},
  watch: {},
  created() {
    
  },
  mounted() {
    let middleCanvas = document.getElementById(this.editor.id + "_canvas");
    // 创建 ResizeObserver 实例
    const resizeObserver = new ResizeObserver(entries => {
      // entries 是一个 ResizeObserverEntry 对象数组，包含目标元素的大小信息
      for (const entry of entries) {
        // 获取宽度和高度
        const { width, height } = entry.contentRect;
        if (width != 0 && height != 0) {
          this.width = width
          this.height = height
          this.resetPosition(width,height)
          
        }
      }
    });

    //开始监听目标元素的大小变化
    resizeObserver.observe(middleCanvas);
    this.refreshData();
  },
  methods: {

    internalAction(id,evt){
      if(id == 'ddei-core-save'){
        this.save(evt)
      } else if (id == 'ddei-core-open') {
        this.openFile(evt)
      } else if (id == 'ddei-core-new') {
        this.newFile(evt)
      } else if (id == 'ddei-core-download') {
        this.download(evt)
      }
    },
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
          description: "DDei Design File",
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
          if (!file.id) {
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
          DDeiEditorUtil.invokeCallbackFunc("EVENT_ADD_FILE_AFTER", "LOAD_FILE", { file: file }, this.editor.ddInstance, evt)
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
        let file = DDeiFile.loadFromJSON(
          {
            name: "新建文件_NEW",
            path: "/新建文件_NEW",
            sheets: [
              new DDeiSheet({
                name: "页面-1",
                desc: "页面-1",
                stage: DDeiStage.initByJSON({ id: "stage_1" },{ currentDdInstance: ddInstance }),
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

    resetPosition(width,height){
      
      //横向
      if (this.options?.direct == 2) {
        this.$refs['topmenu'].style.maxWidth = (width - 80) + "px"
        this.$refs['topmenu'].style.flexDirection = ""
        if (this.options?.width) {
          this.$refs['topmenu'].style.width = this.options.width
        } else {
          this.$refs['topmenu'].style.width = ""
        }
        if (this.options?.height) {
          this.$refs['topmenu'].style.height = this.options.height
        } else {
          this.$refs['topmenu'].style.height = "32px"
        }

      }
      //纵向
      else {
        this.$refs['topmenu'].style.flexDirection = "column";
        this.$refs['topmenu'].style.maxHeight = (height - 80) + "px"
        if (this.options?.width) {
          this.$refs['topmenu'].style.width = this.options.width
        } else {
          this.$refs['topmenu'].style.width = "32px"
        }
        if (this.options?.height) {
          this.$refs['topmenu'].style.height = this.options.height
        } else {
          this.$refs['topmenu'].style.height = ""
        }
      }
      //读取缓存位置
      let cachePos = null;
      if (this.options?.drag == 1) {
        cachePos = localStorage.getItem("pos-" + this.editor.id + "-ddei-core-panel-topmenu-simple")
      }
      if (!cachePos) {
        //位置
        switch (this.options?.position) {
          case 2:
            this.$refs['topmenu'].style.left = (width - this.$refs['topmenu'].clientWidth) / 2 + "px";
            this.$refs['topmenu'].style.top = "30px";
            break;
          case 3:
            this.$refs['topmenu'].style.left = (width - this.$refs['topmenu'].clientWidth - 30) + "px";
            this.$refs['topmenu'].style.top = "30px";
            break;
          case 4:
            this.$refs['topmenu'].style.left = (width - this.$refs['topmenu'].clientWidth - 30) + "px";
            this.$refs['topmenu'].style.top = (height - this.$refs['topmenu'].clientHeight) / 2 + "px";
            break;
          case 5:
            this.$refs['topmenu'].style.left = (width - this.$refs['topmenu'].clientWidth - 30) + "px";
            this.$refs['topmenu'].style.top = (height - this.$refs['topmenu'].clientHeight - 30) + "px";
            break;
          case 6:
            this.$refs['topmenu'].style.left = (width - this.$refs['topmenu'].clientWidth) / 2 + "px";
            this.$refs['topmenu'].style.top = (height - this.$refs['topmenu'].clientHeight - 30) + "px";
            break;
          case 7:
            this.$refs['topmenu'].style.left = "30px";
            this.$refs['topmenu'].style.top = (height - this.$refs['topmenu'].clientHeight - 30) + "px";
            break;
          case 8:
            this.$refs['topmenu'].style.left = "30px";
            this.$refs['topmenu'].style.top = (height - this.$refs['topmenu'].clientHeight) / 2 + "px";
            break;
          case 9:
            this.$refs['topmenu'].style.left = (width - this.$refs['topmenu'].clientWidth) / 2 + "px";
            this.$refs['topmenu'].style.top = (height - this.$refs['topmenu'].clientHeight) / 2 + "px";
            break;
          default:
            this.$refs['topmenu'].style.left = "30px";
            this.$refs['topmenu'].style.top = "30px";
            break;
        }

      } else {
        let posJson = JSON.parse(cachePos)
        this.$refs['topmenu'].style.left = posJson.left + "px";
        this.$refs['topmenu'].style.top = posJson.top + "px";
      }
      this.$refs['topmenu'].style.display="flex"
    },

    refreshData() {
      
    },

    //强制刷新当前以及下层组件
    forceRefreshParts(parts) {
      if (!parts || parts == 'topmenu' || parts.indexOf('topmenu') != -1){
        this.forceRefresh = false
        this.$nextTick(() => {
          this.forceRefresh = true;
          if (this.refreshData) {
            this.refreshData();
            this.$nextTick(() => {
              this.resetPosition(this.width, this.height)
            })
          }
        });
      }
    },

  

    /**
     * 准备拖拽
     */
    prepareDragBox(e) {
      this.editor.dragPart = this;
      this.$refs['topmenu'].style.userSelect = "none";
      this.$refs['topmenu'].children[0].style.backgroundColor = "var(--dot)";
      this.$refs['topmenu'].style.pointerEvents = "none";
      
    },

    /**
     * 拖拽中
     */
    boxDraging(e) {
      if (this.editor.dragPart) {
        let middleCanvas = document.getElementById(this.editor.id + "_canvas");
        let posLeft = e.offsetX - 15
        let posTop = e.offsetY - 5
        if(this.options?.direct == 2){
          posLeft = e.offsetX-5
          posTop = e.offsetY-15
        }
        if (posLeft < 0) {
          posLeft = 0
        }
        if (posLeft < 0) {
          posTop = 0
        }
        if (posLeft + this.$refs['topmenu'].offsetWidth > middleCanvas.offsetWidth) {
          posLeft = middleCanvas.offsetWidth - this.$refs['topmenu'].offsetWidth
        }
        if (posTop + this.$refs['topmenu'].offsetHeight > middleCanvas.offsetHeight) {
          posTop = middleCanvas.offsetHeight - this.$refs['topmenu'].offsetHeight
        }
        this.$refs['topmenu'].style.left = posLeft +"px";
        this.$refs['topmenu'].style.top = posTop +"px";
      }
    },

    /**
     * 拖拽完毕
     */
    boxDragEnd(e) {
      if (this.editor.dragPart) {
        let posJson = { left: this.$refs['topmenu'].offsetLeft, top: this.$refs['topmenu'].offsetTop}
        localStorage.setItem("pos-" + this.editor.id + "-ddei-core-panel-topmenu-simple", JSON.stringify(posJson))
        this.$refs['topmenu'].style.userSelect = "";
        this.$refs['topmenu'].style.pointerEvents = "";
        this.$refs['topmenu'].children[0].style.backgroundColor = "";
        delete this.editor.dragPart;
      }
    },

    
    /**
     * 焦点进入当前区域
     */
    changeEditorFocus() {
      this.editor.changeState(DDeiEditorState.TOP_MENU_OPERATING);
      this.editor.bus.push(DDeiEditorEnumBusCommandType.ClearTemplateUI);
      this.editor.bus.executeAll();
    }
  },
};
</script>

<style lang="less" scoped>
.ddei-core-panel-topmenu-simple {
  text-align: center;
  position: absolute;
  color:var(--text);
  z-index: 99999;
  border: 1px solid var(--panel-border);
  box-shadow: 0px 2px 24px 0px hsl(0deg 0% 0% /0.25);
  border-radius: 5px;
  overflow: hidden;
  background-color: var(--panel-background);
  display: flex;
  font-size: 14px;
  justify-content: start;
  align-items: center;

  .item {
    min-width: 60px;
    padding:0 10px;
    height: 24px;
    border-radius: 3px;
    display: flex;
    justify-content: center;
    align-items: center;
    border-right: 0.5px solid #e2dede;
    border-top-right-radius: 0px;
    border-bottom-right-radius: 0px;
    >div{
      width:100%;
    }

    &:hover {
      background-color: #e2dede;
      cursor: pointer;
      border-top-right-radius: 3px;
      border-bottom-right-radius: 3px;
    }
  }
  .item-selected {
    background-color: #e2dede;
  }

  .item-block {
    width: 10px;

    height: 10px;
  }

    .item-drag {
      width: 100%;
      height: 10px;
      background-color: #efefef;
  
      &:hover {
        background-color: var(--dot);
        cursor: grab;
      }
    }
    .item-drag-2 {
      height: 100%;
      width: 10px;
      background-color: #efefef;

      &:hover {
        background-color: var(--dot);
        cursor: grab;
      }
    }
}
</style>
