<template>
  <div class="ddei-core-panel-bottom-addpage" v-show="file?.extData?.owner == 1 || sslink?.can_edit == 1"
    @click="newSheet"
    v-if=" (!this.max || (this.editor?.files[this.editor?.currentFileIndex]?.sheets?.length < this.max))">
    <svg class="icon" aria-hidden="true">
      <use xlink:href="#icon-a-ziyuan376"></use>
    </svg>
  </div>
  <div class="ddei-core-panel-bottom-pages" ref="bottomSheets" @mouseup="drag && sheetDragDrop($event)">
    <div class="ddei-core-panel-bottom-pages-page" v-if="maxOpenSize == 0">
      <span></span>
    </div>
    <div @mousedown="drag && sheetDragStart(null, $event)" @click.left="changeSheet(index)"
      @click.right="(file?.extData?.owner == 1 || sslink?.can_edit == 1) && showMenu(sheet, $event)"
      @mousemove="drag && sheetDragOver($event)" @dblclick="startChangeSheetName(sheet, $event)"
      v-show="index >= openIndex && index < openIndex + maxOpenSize"
      :class="{ 'ddei-core-panel-bottom-pages-page': sheet.active == 0, 'ddei-core-panel-bottom-pages-page--selected': sheet.active == 1 }"
      :title="sheet.name" v-for="(sheet, index) in  editor?.files[editor?.currentFileIndex]?.sheets ">
      <span>{{ sheet.name }}</span>
    </div>

    <div class="ddei-core-panel-bottom-pages-movebox"
      v-show="editor?.files[editor?.currentFileIndex]?.sheets?.length > maxOpenSize" @click="moveItem(-1)">
      <svg class="icon" aria-hidden="true">
        <use xlink:href="#icon-a-ziyuan481"></use>
      </svg>
    </div>
    <div class="ddei-core-panel-bottom-pages-movebox"
      v-show="editor?.files[editor?.currentFileIndex]?.sheets?.length > maxOpenSize" @click="moveItem(1)">
      <svg class="icon" aria-hidden="true">
        <use xlink:href="#icon-a-ziyuan480"></use>
      </svg>
    </div>
  </div>
</template>
<script lang="ts">
import {DDeiEditor} from "ddei-framework1";
import {DDeiSheet} from "ddei-framework1";
import {DDeiEnumBusCommandType} from "ddei-framework1";
import {DDeiEditorEnumBusCommandType} from "ddei-framework1";
import {DDeiUtil} from "ddei-framework1";
import {DDeiEditorState} from "ddei-framework1";
import {DDeiEditorUtil} from "ddei-framework1";
import Cookies from "js-cookie";
import {DDeiStage} from "ddei-framework1";

export default {
  name: "ddei-core-panel-bottom-sheets",
  extends: null,
  mixins: [],
  props: {
    //外部传入的插件扩展参数
    options: {
      type: Object,
      default: null
    },
    max: {
      type: Number,
      default: 0
    },
    drag: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      editor:null,
      file: null,
      maxOpenSize:0,
      openIndex: 0,
      sslink: null,
      user: null,
    };
  },
  computed: {},
  watch: {},
  created() {
    
   },
  mounted() {
    // 创建 ResizeObserver 实例
    const resizeObserver = new ResizeObserver(entries => {
      // entries 是一个 ResizeObserverEntry 对象数组，包含目标元素的大小信息
      for (const entry of entries) {
        // 获取宽度和高度
        const { width, height } = entry.contentRect;
        if (width != 0 && height != 0) {
          //获取单个tab大小
          let pagesEles = document.getElementsByClassName("ddei-core-panel-bottom-pages")
          let pageEles = document.getElementsByClassName("ddei-core-panel-bottom-pages-page")
          let divWidth = 0;
          
          let pagesWidth = 1000;
          if (pageEles.length > 0) {
            divWidth = pageEles[0].clientWidth
          }
          if (!divWidth) {
            divWidth = 70
          }
          if (pagesEles.length > 0) {
            pagesWidth = pagesEles[0].clientWidth
          }
          let size = parseInt(pagesWidth / divWidth);
          if (size > this.maxOpenSize && this.openIndex > 0) {
            this.openIndex--;
          }

          this.maxOpenSize = size - 1;
        
        }
      }
    });
    // 开始监听目标元素的大小变化
    resizeObserver.observe(this.$refs.bottomSheets);

    //获取编辑器
    this.editor = DDeiEditor.ACTIVE_INSTANCE;
    let file = this.editor?.files[this.editor?.currentFileIndex];
    let sheet = file?.sheets[file?.currentSheetIndex];
    this.changeCurrentStage = true;
    this.editor.currentStage = sheet?.stage;
    let userCookie = Cookies.get("user");
    if (userCookie && file) {
      this.user = JSON.parse(userCookie)
      for (let i = 0; i < this.user?.sslinks?.length; i++) {
        if (this.user.sslinks[i].file_id == file.id) {
          this.sslink = this.user.sslinks[i]
          break;
        }
      }
    }
    this.file = file
  },
  methods:{

    /**
     * 在存在显示隐藏的情况下移动tab
     */
    moveItem(index: number = 0) {
      if (index != 0) {
        let file = this.editor?.files[this.editor?.currentFileIndex];
        let sheets = file?.sheets;
        this.openIndex += index;
        if (this.openIndex > sheets.length - this.maxOpenSize) {
          this.openIndex = sheets.length - this.maxOpenSize;
        } else if (this.openIndex < 0) {
          this.openIndex = 0;
        }
        this.editor.bus.push(DDeiEditorEnumBusCommandType.ClearTemplateUI);
        this.editor.bus.executeAll();
      }
    },

    /**
      * sheet开始拖拽移动
      */
    sheetDragStart(sheetEle, evt) {
      this.dragSheetEle = evt.currentTarget;
    },

    /**
     * 拖拽元素移动
     */
    sheetDragOver(e) {
      if (this.dragSheetEle){
        let parentDiv = this.dragSheetEle.parentElement;
        let sourceIndex = -1;
        let targetIndex = -1;
        let children = parentDiv.children;
        for (let i = 0; i < children.length - 2; i++) {
          children[i].style.borderLeft = "";
          children[i].style.borderRight = "";
          if (children[i] == this.dragSheetEle) {
            sourceIndex = i;
          } else if (e.target == children[i]) {
            targetIndex = i;
          }
        }
        if (sourceIndex != -1 && targetIndex != -1) {
          this.sourceSheetIndex = sourceIndex;
          if (targetIndex == children.length - 3) {
            let pos = DDeiUtil.getDomAbsPosition(children[targetIndex]);
            let halfPos = pos.left + children[targetIndex].offsetWidth / 2;
            if (
              halfPos <= e.clientX &&
              e.clientX <= pos.left + children[targetIndex].offsetWidth
            ) {
              this.changeSheetIndex = targetIndex;
              children[targetIndex].style.borderRight = "2px solid #017fff";
            } else {
              this.changeSheetIndex = targetIndex - 1;
              children[targetIndex].style.borderLeft = "2px solid #017fff";
            }
          } else {
            this.changeSheetIndex = targetIndex - 1;
            children[targetIndex].style.borderLeft = "2px solid #017fff";
          }
        }

        e.preventDefault();
      }
    },

    /**
     * 拖拽元素放开
     */
    sheetDragDrop(e) {
      if (
        (this.sourceSheetIndex || this.sourceSheetIndex == 0) &&
        (this.changeSheetIndex || this.changeSheetIndex == 0)
      ) {
        //修改sheet位置
        let file = this.editor.files[this.editor.currentFileIndex];
        let sheet = file.sheets[this.sourceSheetIndex];
        let currentSheet = file.sheets[file.currentSheetIndex];
        file.sheets[this.sourceSheetIndex] = null;
        file.sheets.splice(this.changeSheetIndex + 1, 0, sheet);
        for (let j = file.sheets.length; j >= 0; j--) {
          if (file.sheets[j] == null) {
            file.sheets.splice(j, 1);
          }
        }
        for (let j = file.sheets.length; j >= 0; j--) {
          if (currentSheet == file.sheets[j]) {
            file.currentSheetIndex = j;
          }
        }
        //刷新当前画布

        this.editor.editorViewer?.changeFileModifyDirty();
        this.editor.bus.push(DDeiEditorEnumBusCommandType.AddFileHistroy);
        this.editor.bus.push(DDeiEditorEnumBusCommandType.RefreshEditorParts, {
          parts: ["bottommenu"],
        });
        this.editor.bus.executeAll();
        this.editor.changeState(DDeiEditorState.DESIGNING);
      }
      this.dragSheetEle = null;
      this.sourceSheetIndex = null;
      this.changeSheetIndex = null;
    },




    /**
     * 开始修改页标题
     */
    startChangeSheetName(sheet, evt) {
      let ele = evt.target;
      let domPos = DDeiUtil.getDomAbsPosition(ele);
      let input = document.getElementById("change_sheet_name_input");
      if (!input) {
        input = document.createElement("input");
        input.setAttribute("id", "change_sheet_name_input");
        input.style.position = "absolute";
        document.body.appendChild(input);
        input.onblur = function () {
          //设置属性值
          if (input.value) {
            let editor = DDeiEditor.ACTIVE_INSTANCE;
            let file = editor?.files[editor?.currentFileIndex];
            let sheet = file?.sheets[file?.currentSheetIndex];
            if (input.value != sheet.name) {
              sheet.name = input.value;
              editor.editorViewer?.changeFileModifyDirty();
              editor.bus.push(DDeiEditorEnumBusCommandType.AddFileHistroy);
              editor.bus.push(DDeiEditorEnumBusCommandType.RefreshEditorParts, {
                parts: ["bottommenu"],
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
            let sheet = file?.sheets[file?.currentSheetIndex];
            if (input.value != sheet.name) {
              sheet.name = input.value;
              editor.editorViewer?.changeFileModifyDirty();
              editor.bus.push(DDeiEditorEnumBusCommandType.AddFileHistroy);
              editor.bus.push(DDeiEditorEnumBusCommandType.RefreshEditorParts, {
                parts: ["bottommenu"],
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
      input.style.height = ele.offsetHeight + "px";
      input.style.left = domPos.left + "px";
      input.style.top = domPos.top + "px";
      input.style.outline = "1px solid #017fff";
      input.style.border = "none";
      input.style.borderRadius = "1px";
      input.value = sheet.name;
      input.style.display = "block";
      input.selectionStart = 0; // 选中开始位置
      input.selectionEnd = input.value.length; // 获取输入框里的长度。
      input.focus();
      //修改编辑器状态为快捷编辑中
      this.editor.changeState(DDeiEditorState.PROPERTY_EDITING);
    },
    /**
       * 创建一个sheet
       */
    newSheet() {
      
      let file = this.editor?.files[this.editor?.currentFileIndex];
      let sheets = file?.sheets;
      if (this.max && sheets.length >= this.max){
        return;
      }
      let ddInstance = this.editor?.ddInstance;
      if (file && sheets && ddInstance) {
        let i = sheets.length + 1;

        let stage = DDeiStage.initByJSON(
          { id: "stage" },
          { currentDdInstance: ddInstance }
        );
        sheets.push(
          new DDeiSheet({
            name: "页面-" + i,
            desc: "页面-" + i,
            stage: stage,
          })
        );
        file.changeSheet(sheets.length - 1);
        //刷新页面
        ddInstance.stage = stage;
        this.editor.currentStage = stage;
        //加载场景渲染器
        stage.initRender();
        //设置视窗位置到中央
        if (!stage.wpv) {
          //缺省定位在画布中心点位置
          stage.wpv = {
            x: -(stage.width - ddInstance.render.container.clientWidth) / 2,
            y: -(stage.height - ddInstance.render.container.clientHeight) / 2,
            z: 0,
          };
        }

        this.editor.changeState(DDeiEditorState.DESIGNING);
        this.editor.editorViewer?.changeFileModifyDirty();
        ddInstance.bus?.push(DDeiEditorEnumBusCommandType.AddFileHistroy);
        ddInstance.bus?.push(DDeiEnumBusCommandType.RefreshShape);
        ddInstance.bus?.push(DDeiEditorEnumBusCommandType.ClearTemplateUI);
        ddInstance.bus.executeAll();

        DDeiEditorUtil.closeDialogs(null, true)
        DDeiEditorUtil.closeDialogs(null, false)

        //打开新文件
        let activeIndex = sheets.length - 1;
        this.openIndex = activeIndex + 1 - this.maxOpenSize;
        if (this.openIndex < 0) {
          this.openIndex = 0;
        }
      }
    },

    /**
       * 切换sheet
       */
    changeSheet(index) {
      let file = this.editor?.files[this.editor?.currentFileIndex];
      let sheets = file?.sheets;
      let ddInstance = this.editor?.ddInstance;
      if (
        file &&
        sheets &&
        ddInstance &&
        (index >= 0 || index < sheets.length)
      ) {
        this.tempSheetChange = true;
        file.changeSheet(index);
        let stage = sheets[index].stage;
        stage.ddInstance = ddInstance;
        //刷新页面
        ddInstance.stage = stage;
        this.editor.currentStage = stage;
        //加载场景渲染器
        stage.initRender();

        ddInstance.bus.push(DDeiEnumBusCommandType.RefreshShape);
        ddInstance.bus.push(DDeiEditorEnumBusCommandType.ClearTemplateUI);
        ddInstance.bus.executeAll();

        DDeiEditorUtil.closeDialogs(null, true)
        DDeiEditorUtil.closeDialogs(null, false)
        this.showPopPicker(stage)
        this.editor.changeState(DDeiEditorState.DESIGNING);

      }
    },


    showPopPicker(stage) {
      //显示弹出框
      if (stage.selectedModels?.size > 0) {
        let models = Array.from(stage.selectedModels.values())
        if (models?.length > 0) {
          let height = 100;
          //计算弹出框的显示位置，这里需要把模型的坐标转换为dom的坐标
          let modelPos = DDeiUtil.getModelsDomAbsPosition(models)
          let left = modelPos.left + (modelPos.width / 2)
          let top = modelPos.top + (modelPos.height / 2)
          if (modelPos.top - height <= modelPos.cTop) {
            if (modelPos.height > 400) {
              top = top + height + 20
            } else {
              top = top + modelPos.height / 2 + 20;
            }
          } else {
            top = top - height;
          }
          if (top < 0) {
            top = modelPos.cTop + modelPos.cHeight / 2
          }

          if (left < 0) {
            left = 0
          }
          DDeiEditorUtil.showDialog('ddei-core-dialog-quickpop', {
            group: "canvas-pop"
          }, { type: 99, left: left, top: top, hiddenMask: true }, null, true, true)
        }
      }
    },


    /**
     * 显示右键菜单
     */
    showMenu(sheet, evt) {
      DDeiUtil.showContextMenu(sheet, evt);
      evt.preventDefault();
      return false;
    },
  }
};
</script>

<style lang="less" scoped>
.ddei-core-panel-bottom-addpage {
  flex: 0 0 40px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-left: 10px;
}

.ddei-core-panel-bottom-pages {
  flex: 1;
  display: block;
  text-align: center;

  &-movebox {
    width: 25px;
    height: 27px;
    float: left;
    text-align: center;

    &:hover {
      background: rgb(235, 235, 239);
      cursor: pointer;
    }

    .icon {
      height: 27px;
    }
  }

  &-page {
    float: left;
    height: 27px;
    border-right: 1px solid var(--panel-border);
    padding: 0 10px;
    text-align: center;

    span {
      height: 27px;
      width: 80px;
      white-space: nowrap;
      text-overflow: ellipsis;
      overflow: hidden;
      display: inline-flex;
      align-items: center;
      background: var(--panel-background);
      &:hover {
        color: var(--dot);
        cursor: pointer;
        background: var(--background);
      }
    }

    &--selected {
      float: left;
      height: 27px;
      border-right: 1px solid var(--panel-border);
      padding: 0 10px;
      text-align: center;

      span {    
        height: 27px;
        width: 80px;
        background: var(--panel-selected);
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
        color: var(--dot);
        font-weight: bold;
        display: inline-flex;
        align-items: center;
      }
    }
  }
}
</style>
