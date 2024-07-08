<template>
  <div @mousedown="changeEditorFocus()" v-if="forceRefresh" @mouseup="drag && fileDragDrop($event)" ref="openFilesView"
    class="ddei-core-panel-openfilesview">
    <div v-show="this.editor?.leftWidth == 0 && expand" class="ddei-core-panel-openfilesview-expandbox"
      @click="expandToolBox">
      <svg class="icon" aria-hidden="true">
        <use xlink:href="#icon-a-ziyuan474"></use>
      </svg>
    </div>
    <div class="ddei-core-panel-openfilesview-item" v-if="!editor?.files"></div>
    <div
      :class="item.active == 1 ? 'ddei-core-panel-openfilesview-item ddei-core-panel-openfilesview-item--selected' : 'ddei-core-panel-openfilesview-item'"
      @click="changeFile(item)" @mousedown="drag && fileDragStart(index, $event)"
      @mousemove="drag && fileDragOver($event)" v-for="(item, i) in editor?.files"
      v-show="i >= openIndex && ((i - openIndex + 1) * unitFileWidth + 120) <= width" :title="item.name">
      <svg class="icon" aria-hidden="true">
        <use xlink:href="#icon-wenjian01"></use>
      </svg>

      <span class="textcontent">
        <div class="text"  @dblclick="rename && startChangeFileName(item, $event)">{{ item.name }}</div>
        <div class="dirty" v-show="item.state != 0">ꔷ</div>
      </span>
      <svg @click.prevent.stop="closeFile(item, $event)" v-if="close" class="icon close" aria-hidden="true">
        <use xlink:href="#icon-a-ziyuan422"></use>
      </svg>
    </div>
    <svg class="icon addfile" aria-hidden="true" v-if="create && (!max || editor?.files?.length < max)"
      @click="newFile">
      <use xlink:href="#icon-a-ziyuan376"></use>
    </svg>
    <div style="flex:1 1 1px"></div>
    <div class="ddei-core-panel-openfilesview-movebox" v-show="editor?.files?.length > maxOpenSize"
      @click="moveItem(-1)">
      <svg class="icon" aria-hidden="true">
        <use xlink:href="#icon-a-ziyuan481"></use>
      </svg>
    </div>
    <div class="ddei-core-panel-openfilesview-movebox" v-show="editor?.files?.length > maxOpenSize"
      @click="moveItem(1)">
      <svg class="icon" aria-hidden="true">
        <use xlink:href="#icon-a-ziyuan480"></use>
      </svg>
    </div>
  </div>
</template>

<script lang="ts">
import {DDeiUtil} from "ddei-framework";
import {DDeiEditor} from "ddei-framework";
import {DDeiActiveType} from "ddei-framework";
import {DDeiEditorState} from "ddei-framework";
import {DDeiFileState} from "ddei-framework";
import {DDeiFile} from "ddei-framework";
import {DDeiEditorUtil} from "ddei-framework";
import {DDeiStoreLocal} from "ddei-framework";
import {DDeiEnumBusCommandType} from "ddei-framework";
import {DDeiEditorEnumBusCommandType} from "ddei-framework";
import {DDeiStage} from "ddei-framework";
import {DDeiSheet} from "ddei-framework";

export default {
  name: "ddei-core-panel-openfilesview",
  extends: null,
  mixins: [],
  props: {
    //外部传入的插件扩展参数
    options: {
      type: Object,
      default: null
    },
    //是否允许展开收折
    expand: {
      type: Boolean,
      default: false
    },
    create: {
      type: Boolean,
      default: true
    },
    close: {
      type: Boolean,
      default: true
    },
    rename: {
      type: Boolean,
      default: true
    },
    drag: {
      type: Boolean,
      default: true
    },
    max:{
      type: Number,
      default: 0
    },
    beforeCloseFile:{
      type: Function,
      default: null
    }
    , editor: {
      type: DDeiEditor,
      default: null,
    }
  },
  data() {
    return {
      //当前打开的页的开始下标
      openIndex: 0,
      //最大可以打开的数量
      maxOpenSize: 1,
      // tempFile: null,
      unitFileWidth: 160,
      // user: null,
      forceRefresh:true
    };
  },
  computed: {},
  watch: {},
  created() {
    
    // 监听文件列表大小变化
    this.$watch("editor.files.length", function (newVal, oldVal) {
      //打开新文件
      setTimeout(() => {
        let activeIndex = -1;
        for (let i = 0; i < this.editor.files.length; i++) {
          if (this.editor.files[i].active == DDeiActiveType.ACTIVE) {
            activeIndex = i;
            this.editor.bus.push(DDeiEditorEnumBusCommandType.RefreshEditorParts, {
              parts: ["toolbox", "property"]
            });
            this.editor.bus.executeAll();
            break;
          }
        }
        this.openIndex = activeIndex + 1 - this.maxOpenSize;
        if (this.openIndex < 0) {
          this.openIndex = 0;
        }
      }, 10);
    });
  },
  mounted() {
    // 创建 ResizeObserver 实例
    const resizeObserver = new ResizeObserver(entries => {
      // entries 是一个 ResizeObserverEntry 对象数组，包含目标元素的大小信息
      for (const entry of entries) {
        // 获取宽度和高度
        let { width, height } = entry.contentRect;
        if(width == 0 || height == 0){
          width = this.$refs.openFilesView.clientWidth
          height = this.$refs.openFilesView.clientHeight
        }
        if (width != 0 && height != 0) { 
          //获取单个tab大小
          let fileEles = this.$refs.openFilesView.getElementsByClassName("ddei-core-panel-openfilesview-item")
          let fileWidth = 0;
          if (fileEles.length > 0) {
            fileWidth = fileEles[0].clientWidth
          }
          if (!fileWidth) {
            fileWidth = 160
          }
          this.unitFileWidth = fileWidth
          let size = parseInt((width - 120) / fileWidth);
          if (size > this.maxOpenSize && this.openIndex > 0) {
            this.openIndex--;
          }
          this.maxOpenSize = size;
          this.width = width
        }
      }
    });
    // 开始监听目标元素的大小变化
    resizeObserver.observe(this.$refs.openFilesView);
    this.refreshData();
  },
  methods: {

    //强制刷新当前以及下层组件
    forceRefreshParts(parts) {
      if (!parts || parts == 'openfiles' || parts.indexOf('openfiles') != -1) {
        this.forceRefresh = false
        this.$nextTick(() => {
          this.forceRefresh = true;
          if (this.refreshData) {
            this.refreshData();
          }
        });
      }
    },

    refreshData() {
      this.editor.openFilesViewer = this;
      // let userCookie = Cookies.get("user");
      // if (userCookie) {
      //   this.user = JSON.parse(userCookie)
      // }
    },

    /**
     * 新建文件
     * @param evt
     */
    newFile(evt) {
      if (this.editor?.ddInstance) {
        let rsState = DDeiEditorUtil.invokeCallbackFunc("EVENT_BEFORE_ADD_FILE", "ADD_FILE", null, this.editor.ddInstance, null)
        if (rsState != -1) {
          let ddInstance = this.editor.ddInstance;
          let file = DDeiFile.loadFromJSON(
            {
              name: "新建文件_NEW",
              path: "/新建文件_NEW",
              sheets: [
                new DDeiSheet({
                  name: "页面-1",
                  desc: "页面-1",
                  stage: DDeiStage.initByJSON({ id: "stage_1" }, { currentDdInstance :ddInstance}),
                  active: DDeiActiveType.ACTIVE,
                }),
              ],
              currentSheetIndex: 0,
              state: DDeiFileState.NEW,
              active: DDeiActiveType.ACTIVE,
            },
            { currentDdInstance: ddInstance }
          );
          file.local = 1
          //添加文件
          if (this.editor.currentFileIndex != -1) {
            this.editor.files[this.editor.currentFileIndex].active =
              DDeiActiveType.NONE;
          }
          this.editor.addFile(file);
          this.editor.currentFileIndex = this.editor.files.length - 1;
          let sheets = file?.sheets;
          
          if (file && sheets && ddInstance) {
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
                x: -(stage.width - ddInstance.render.canvas.width / ddInstance.render.ratio) / 2,
                y: -(stage.height - ddInstance.render.canvas.height / ddInstance.render.ratio) / 2,
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
          DDeiEditorUtil.invokeCallbackFunc("EVENT_AFTER_ADD_FILE", "ADD_FILE", null, this.editor.ddInstance, null)
          if (this.editor.files.length == 0) {
            ddInstance.disabled = true
          } else {
            ddInstance.disabled = false
          }
        }
      }
    },

    /**
     * 修改文件标题
     */
    startChangeFileName(file, evt) {
      let ele = evt.target;
      let domPos = DDeiUtil.getDomAbsPosition(ele);
      let editor = DDeiEditor.ACTIVE_INSTANCE;
      let editorEle = document.getElementById(editor.id);
      let editorDomPos = DDeiUtil.getDomAbsPosition(editorEle);
      let input = document.getElementById(editor.id+"_change_file_name_input");
      if (!input) {
        input = document.createElement("input");
        input.setAttribute("id", editor.id +"_change_file_name_input");
        input.style.position = "absolute";
        editorEle.appendChild(input);
        input.onblur = function () {
          //设置属性值
          if (input.value) {
            let editor = DDeiEditor.ACTIVE_INSTANCE;
            let file = editor?.files[editor?.currentFileIndex];
            if (input.value != file.name) {
              file.name = input.value;
              if (file.path) {
                if (file.path.indexOf("/") != -1) {
                  file.path = file.path.substring(0, file.path.lastIndexOf("/")) + "/" + file.name
                } else {
                  file.path = file.name;
                }
              }
              editor.editorViewer?.changeFileModifyDirty();
              editor.bus.push(DDeiEditorEnumBusCommandType.AddFileHistroy);
              editor.bus.push(DDeiEditorEnumBusCommandType.RefreshEditorParts, {
                parts: ["openfiles"],
              });
              editor.bus.executeAll();
              editor.changeState(DDeiEditorState.DESIGNING);
            }
            input.style.display = "none";
            input.style.left = "0px";
            input.style.top = "0px";
            input.value = "";
          }
        };
        input.onkeydown = function (e) {
          //回车
          if (e.keyCode == 13) {
            let editor = DDeiEditor.ACTIVE_INSTANCE;
            let file = editor?.files[editor?.currentFileIndex];
            if (input.value != file.name) {
              file.name = input.value;
              if (file.path){
                if (file.path.indexOf("/") != -1){
                  file.path = file.path.substring(0, file.path.lastIndexOf("/"))+"/"+file.name
                }else{
                  file.path = file.name;
                }
              }
              
              editor.editorViewer?.changeFileModifyDirty();
              editor.bus.push(DDeiEditorEnumBusCommandType.AddFileHistroy);
              editor.bus.push(DDeiEditorEnumBusCommandType.RefreshEditorParts, {
                parts: ["openfiles"],
              });
              editor.bus.executeAll();
              editor.changeState(DDeiEditorState.DESIGNING);
            }
            input.style.display = "none";
            input.style.left = "0px";
            input.style.top = "0px";
            input.value = "";
          } else if (e.keyCode == 27) {
            let editor = DDeiEditor.ACTIVE_INSTANCE;
            input.style.display = "none";
            input.style.left = "0px";
            input.style.top = "0px";
            input.value = "";
            editor.changeState(DDeiEditorState.DESIGNING);
          }
        };
      }
      
      input.style.width = ele.offsetWidth + "px";
      input.style.height = ele.offsetHeight - 3 + "px";
      input.style.left = domPos.left - editorDomPos.left + "px";
      input.style.top = (domPos.top + 2 - editorDomPos.top) + "px";
      input.style.border = "none";
      input.style.outline = "none";
      input.style.borderBottom = "1px solid #1F72FF";
      input.style.borderRadius = "1px";
      input.value = file.name;
      input.style.display = "block";
      input.selectionStart = 0; // 选中开始位置
      input.selectionEnd = input.value.length; // 获取输入框里的长度。
      input.style.background = "var(--background)";
      input.style.color = "var(--text)";
      input.focus();
      //修改编辑器状态为快捷编辑中
      this.editor.bus.push(DDeiEditorEnumBusCommandType.ClearTemplateUI);
      this.editor.bus.executeAll();
      if (this.editor.state != DDeiEditorState.PROPERTY_EDITING && this.editor.state != DDeiEditorState.QUICK_EDITING) {
        this.editor.changeState(DDeiEditorState.PROPERTY_EDITING);
      }
    },

    /**
     * file开始拖拽移动
     */
    fileDragStart(fileEle, evt) {
      this.dragFileEle = evt.currentTarget;
    },

    /**
     * 拖拽元素移动
     */
    fileDragOver(e) {
      if (this.dragFileEle) {
        if (e.currentTarget.className.indexOf("ddei-core-panel-openfilesview-item") != -1) {
          let parentDiv = this.dragFileEle.parentElement;
          let sourceIndex = -1;
          let targetIndex = -1;
          let children = parentDiv.children;
          for (let i = 1; i < children.length - 4; i++) {
            children[i].style.borderLeft = "";
            children[i].style.borderRight = "";
            if (children[i] == this.dragFileEle) {
              sourceIndex = i;
            } else if (e.currentTarget == children[i]) {
              targetIndex = i;
            }
          }
          if (sourceIndex != -1 && targetIndex != -1) {
            this.sourceFileIndex = sourceIndex - 1;
            if (targetIndex == children.length - 5) {
              let pos = DDeiUtil.getDomAbsPosition(children[targetIndex]);
              let halfPos = pos.left + children[targetIndex].offsetWidth / 2;
              if (
                halfPos <= e.clientX &&
                e.clientX <= pos.left + children[targetIndex].offsetWidth
              ) {
                this.changeFileIndex = targetIndex;
                children[targetIndex].style.borderRight = "2px solid #1F72FF";
              } else {
                this.changeFileIndex = targetIndex - 1;
                children[targetIndex].style.borderLeft = "2px solid #1F72FF";
              }
            } else {
              this.changeFileIndex = targetIndex - 1;
              children[targetIndex].style.borderLeft = "2px solid #1F72FF";
            }
          }

          e.preventDefault();
        }
      }
    },

    /**
     * 拖拽元素放开
     */
    fileDragDrop(e) {
      if (
        (this.sourceFileIndex || this.sourceFileIndex == 0) &&
        (this.changeFileIndex || this.changeFileIndex == 0)
      ) {
        //修改file位置
        let files = this.editor.files;
        let sourceFile = this.editor.files[this.sourceFileIndex];
        let currentFile = this.editor.files[this.editor.currentFileIndex];
        files[this.sourceFileIndex] = null;
        files.splice(this.changeFileIndex, 0, sourceFile);
        for (let j = files.length; j >= 0; j--) {
          if (files[j] == null) {
            files.splice(j, 1);
          }
        }
        for (let j = files.length; j >= 0; j--) {
          if (currentFile == files[j]) {
            this.editor.currentFileIndex = j;
          }
        }
        let parentDiv = this.dragFileEle.parentElement;
        let children = parentDiv.children;
        for (let i = 1; i < children.length - 4; i++) {
          children[i].style.borderLeft = "";
          children[i].style.borderRight = "";
        }
        //刷新
        this.editor.bus.push(DDeiEditorEnumBusCommandType.RefreshEditorParts, {
          parts: ["openfiles"],
        });
        this.editor.bus.executeAll();
      }
    
      this.dragFileEle = null;
      this.sourceFileIndex = null;
      this.changeFileIndex = null;
    },

    /**
     * 变更实例
     * @param instance
     */
    changeFile(file) {
      let ddInstance = this.editor?.ddInstance;
      if (!file) {
        ddInstance.bus.push(DDeiEnumBusCommandType.RefreshShape);
        ddInstance.bus.push(DDeiEditorEnumBusCommandType.RefreshEditorParts, {});
        ddInstance.bus.executeAll();
      }else{
        if (this.editor.files.indexOf(file) != this.editor.currentFileIndex){
          let rsState = DDeiEditorUtil.invokeCallbackFunc("EVENT_BEFORE_CHANGE_FILE", "CHANGE_FILE", null, ddInstance, null)
          if (rsState != -1) {
            this.editor.changeFile(this.editor.files.indexOf(file))
            DDeiEditorUtil.invokeCallbackFunc("EVENT_AFTER_CHANGE_FILE", "CHANGE_FILE", null, ddInstance, null)
            ddInstance.bus.push(DDeiEnumBusCommandType.RefreshShape);
            ddInstance.bus.push(DDeiEditorEnumBusCommandType.RefreshEditorParts, {});
            ddInstance.bus.executeAll();
          }
        }
      }
      if (this.editor.files.length == 0) {
        ddInstance.disabled = true
      } else {
        ddInstance.disabled = false
      }
      

    },


    // /**
    //  * 放弃并关闭确认弹框
    //  */
    // abortAndCloseFileConfirmDialog() {
    //   this.tempFile.state = DDeiFileState.NONE;
    //   this.closeFile(this.tempFile);
    // },

    // /**
    //  * 保存
    //  * @param evt
    //  */
    // saveAndCloseFileConfirmDialog() {
    //   if (this.tempFile) {
    //     //获取json信息
    //     let file = this.tempFile;
    //     if (file) {
    //       let json = file.toJSON();
    //       if (json) {

    //         //执行保存
    //         let storeIns = new DDeiStoreLocal();
    //         json.state = DDeiFileState.NONE;
    //         storeIns.save(file.id, json).then((data) => {
    //           //回写ID
    //           file.id = data;
    //           file.state = DDeiFileState.NONE;
    //           this.closeFile(this.tempFile);
    //         });
    //       }
    //     }
    //   }
    // },

    /**
     * 关闭文件
     * @param instance
     */
    closeFile(file, evt) {
      //如果文件为脏状态，询问是否保存，放弃，或取消
      let canClose = true;
      
      if (this.beforeCloseFile){
        canClose = this.beforeCloseFile(file)
      }
      
     
      if(canClose){
        let ddInstance = this.editor.ddInstance;
        let rsState = DDeiEditorUtil.invokeCallbackFunc("EVENT_BEFORE_CLOSE_FILE", "CLOSE_FILE", null, ddInstance, evt)
        if (rsState != -1) {
    
        // if (
        //   file.state == DDeiFileState.NEW ||
        //   file.state == DDeiFileState.MODIFY
        // ) {
          // DDeiEditorUtil.showDialog(this.editor, "ddei-core-dialog-closefile", {
          //   msg: '是否保存对"' + file.name + '"的更改？',
          //   callback: {
          //     abort: this.abortAndCloseFileConfirmDialog,
          //     ok: this.saveAndCloseFileConfirmDialog,
          //   },
          //   background: "white",
          //   opacity: "1%",
          //   event: -1
          // })
          // this.tempFile = file;
        // } else {
          //刷新画布
          let index = this.editor.files.indexOf(file);
          this.editor.removeFile(file);
          if (index < this.editor.currentFileIndex) {
            this.editor.currentFileIndex--;
          } else if (index == this.editor.currentFileIndex) {
            if (index > 0) {
              this.changeFile(
                this.editor.files[this.editor.currentFileIndex - 1]
              );
            } else if (this.editor.files.length > 0) {
              this.changeFile(this.editor.files[0]);
            }
          }
          if (this.editor.files.length == 0) {
            this.changeFile(null);
            this.editor.currentFileIndex = -1;
          }
          if (index > this.openIndex) {
            this.openIndex--;
            if (this.openIndex < 0) {
              this.openIndex = 0;
            }
          }

          DDeiEditorUtil.invokeCallbackFunc("EVENT_AFTER_CLOSE_FILE", "CLOSE_FILE", null, ddInstance, evt)
          ddInstance.bus.push(DDeiEnumBusCommandType.RefreshShape);
          ddInstance.bus.push(DDeiEditorEnumBusCommandType.RefreshEditorParts, {
            parts: ["bottommenu", "topmenu"],
          });
          this.editor.changeState(DDeiEditorState.DESIGNING);
          ddInstance?.bus?.executeAll();
        }
      }
      // }
    },
    /**
     * 在存在显示隐藏的情况下移动tab
     */
    moveItem(index: number = 0) {
      if (index != 0) {
        this.openIndex += index;
        if (this.openIndex > this.editor.files.length - this.maxOpenSize) {
          this.openIndex = this.editor.files.length - this.maxOpenSize;
        } else if (this.openIndex < 0) {
          this.openIndex = 0;
        }
      }
    },

    /**
     * 展开工具栏
     */
    expandToolBox() {

      this.editor.leftWidth = window.leftWidth;
      //重新设置画布大小
      this.editor.middleWidth -= window.leftWidth;
      delete window.leftWidth
      this.editor.changeState(DDeiEditorState.DESIGNING);
    },
    /**
     * 焦点进入当前区域
     */
    changeEditorFocus() {
      this.editor.changeState(DDeiEditorState.DESIGNING);
      this.editor.bus.push(DDeiEditorEnumBusCommandType.ClearTemplateUI);
      this.editor.bus.executeAll();
    },
  },
};
</script>

<style lang="less" scoped>

.icon{
  color:var(--icon);
}
.ddei-core-panel-openfilesview {
  flex: 0 0 30.5px;
  background: var(--panel-background);
  border-top: 1px solid var(--panel-border);
  border-bottom: 1px solid var(--panel-border);
  display: flex;
  user-select: none;
  align-items: center;

  &-expandbox {
    flex: 0 0 30px;
    display: flex;
    justify-content: center;
    align-items: center;

    &:hover {
      background: var(--panel-hover);
      cursor: pointer;
    }
    img {
      filter: brightness(60%);
      margin-top: 3px;
    }
  }
  .addfile {
      margin: 0px 10px;
      font-size: 24px;
  }

  &-movebox {
    flex: 0 0 25px;
    display: flex;
    justify-content: center;
    align-items: center;

    &:hover {
      background: var(--panel-hover);
      cursor: pointer;
    }

    img {
      filter: brightness(60%);
      margin-top: 4px;
    }
  }

  &-item {
    height: 100%;
    flex: 0 0 195px;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color:  var(--panel-background);
    border-right: 1px solid var(--panel-hover);//#B3B4B4;
  
    .icon {
      font-size: 16px;
      flex: 0 0 42px;
      text-align: center;
    }

    .close {
      font-size: 18px;
      flex: 0 0 24px;
      margin-left: -5px;
    }

    .textcontent {
      font-size: 15px;
      flex: 0 0 130px;
      width: 130px;
      display: flex;
      justify-content: center;
      align-items: center;
      .text {
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
        color: var(--panel-title);
        flex: 1;
        font-size: 16px;
        font-weight: 400;
      }
    }

    span .dirty {
      color: red;
      width: 10px;
      flex: 0 0 10px;
      font-size: 18px;
      text-align: right;
    }
    &:hover {
      background: var(--panel-hover);
    }

    &--selected {
      background: var(--panel-selected);
      .textcontent .text {
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
        flex: 1;
        color: var(--panel-title);
      }
    }

 
  }
}
</style>
