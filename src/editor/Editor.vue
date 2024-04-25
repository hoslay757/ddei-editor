<template>
  <div :id="id" class="ddei-editor" @contextmenu.prevent @mousedown="mouseDown($event)">
    <component :is="editor?.getLayout()" :editor="editor" :options="editor?.getLayoutOptions()">
    </component>
    <component :editor="editor" v-for="(item, index) in editor?.getDialogs()" :is="item.dialog" :options="item.options"
      v-bind="item.options"></component>
    <MenuDialog :editor="editor" v-show="!refreshMenu"></MenuDialog>

    <div :id="id + '_dialog_background_div'" class="dialog-background-div"></div>
    <div :id="id + '_ddei_cut_img_div'" class="ddei-cut-img-div"></div>
  </div>
</template>

<script lang="ts">

import {DDeiEditor} from "ddei-framework";
import { autoLoadCommand } from "ddei-framework";
import {DDeiUtil} from "ddei-framework";
import {DDeiEnumBusCommandType} from "ddei-framework";
import {DDeiFileState} from "ddei-framework";
import {DDeiEditorCommandFileDirty} from "ddei-framework";
import {DDeiEditorCommandAddHistroy} from "ddei-framework";
import MenuDialog from "./MenuDialog.vue";
import {DDeiEditorUtil} from "ddei-framework";
import DDeiCore from "@ddei/core";

import ICONS from "./icon";
import { markRaw } from "vue";

export default {
  name: "DDei-Editor",
  extends: null,
  mixins: [],
  props: {
    //外部配置文件的定义，当传入外部配置文件时，用外部配置文件覆盖内部配置
    options: {
      type: Object,
      default: null
    },
    id: {
      type: String,
      default: "ddei_editor"
    },

  },
  data() {
    return {
      editor: null,
      dragObj: null,
      changeIndex: -1,
      refreshMenu:false,
      initLeftWidth: 0,
      initRightWidth: 0
    };
  },
  //注册组件
  components: {
    MenuDialog,
  },
  computed: {},
  watch: {},
  created() {
    autoLoadCommand();
    window.onresize = this.resetSize;
    
    // if (DDeiEditor.ACTIVE_INSTANCE) {
    //   this.editor = DDeiEditor.ACTIVE_INSTANCE;
    // } else {
      //加载默认初始插件DDeiCore
    if (!this.options){
      this.options = markRaw({
        //配置扩展插件
        extensions: []});
    }
    if (!this.options.extensions){
      this.options.extensions = []
    }
    this.options.extensions.splice(0,0,DDeiCore)
    this.editor = DDeiEditor.newInstance(this.id, this.id, true, this.options);
      
    // }
    //载入局部配置
    if (this.options){

      this.editor.applyConfig(this.options.config);
      this.editor.extConfig = this.options.config;
      this.editor.ddInstance.applyConfig(this.editor.extConfig);
    }
    
    window.onbeforeunload = this.beforeUnload;
    DDeiEditorUtil.ICONS = ICONS;

  },
  mounted() {
    this.editor.editorViewer = this;
    //设置默认风格
    this.editor.bindEvent();
    this.editor.changeTheme('');
    DDeiEditorUtil.getControlIcons(this.editor);

    
    //初始化拦截器
    //以下为拦截器的配置
    this.editor.bus.interceptor[DDeiEnumBusCommandType.NodifyChange] = {
      after: [this.changeFileModifyDirty],
    };

    this.editor.bus.interceptor[DDeiEnumBusCommandType.ModelChangeValue] = {
      after: [this.changeFileModifyDirty],
    };
    if (DDeiEditor.HISTROY_LEVEL == "file") {
      this.editor.bus.interceptor[DDeiEnumBusCommandType.AddHistroy] = {
        execute: [this.addFileHistroy],
      };
    }
    this.editor.bus.interceptor[DDeiEnumBusCommandType.TextEditorChangeSelectPos] = {
      execute: [this.textEditorChangeSelectPos],
    };
    if (!this.editor.setCurrentMenu) {
      this.editor.setCurrentMenu = this.setCurrentMenu;
    }
  },
  methods: {

    mouseDown(event:Event){
      DDeiEditor.ACTIVE_INSTANCE = this.editor;
    },
    /**
    * 设置当前菜单
    * @returns 控件ID
    */
    setCurrentMenu(menus: object): void {
      this.editor.currentMenuData = menus;
      this.refreshMenu = false;
      this.$nextTick(() => {
        this.refreshMenu = true;
      });
    },


    beforeUnload(e) {
      let files = this.editor?.files

      let hasDirty = false;
      for (let i = 0; i < files?.length; i++) {
        if (files[i].state != DDeiFileState.NONE) {
          hasDirty = true;
          break;
        }
      }
      if (hasDirty) {
        var e = window.event || e;
        e.returnValue = ("确定离开当前页面吗（未保存数据将会丢失）？");
      }
    },


   
    changeFileModifyDirty() {
      let action: DDeiEditorCommandFileDirty =
        DDeiEditorCommandFileDirty.newInstance();
      return action.action(
        { state: DDeiFileState.MODIFY },
        this.editor.bus,
        null
      );
    },

    //记录文件的histroy
    addFileHistroy() {
      let action: DDeiEditorCommandAddHistroy =
        DDeiEditorCommandAddHistroy.newInstance();
      return action.action({}, this.editor.bus, null);
    },


    textEditorChangeSelectPos() {
      //触发文本焦点改变内部监听
      if (!this.editor.textEditorSelectedChange) {
        this.editor.textEditorSelectedChange = 1
      } else {
        this.editor.textEditorSelectedChange++
      }
      this.editor.bus.push(DDeiEnumBusCommandType.RefreshShape);
      this.editor.bus.executeAll();
    },

    resetSize() {
      let width = document.body.scrollWidth
      let height = document.body.scrollHeight
      if (!window.upSizeWidth || !window.upSizeHeight) {
        window.upSizeWidth = width;
        window.upSizeHeight = height;
      } else {
        let deltaWidth = width - window.upSizeWidth;
        let deltaHeight = height - window.upSizeHeight;
        if (this.editor.middleWidth + deltaWidth >= 305) {
          window.upSizeWidth = width;
          this.editor.middleWidth += deltaWidth;
          this.editor.maxWidth =
            this.editor.leftWidth +
            this.editor.rightWidth +
            this.editor.middleWidth;
        }
        if (this.editor.middleHeight + deltaHeight >= 305) {
          window.upSizeHeight = height;
          this.editor.middleHeight += deltaHeight;
          this.editor.maxHeight =
            this.editor.leftHeight +
            this.editor.rightHeight +
            this.editor.middleHeight;
        }
        this.editor.ddInstance.render.setSize(
          this.editor.middleWidth,
          this.editor.middleHeight,
          0,
          0
        );
        this.editor.ddInstance.bus.push(DDeiEnumBusCommandType.RefreshShape);
        this.editor.ddInstance.bus.executeAll();
      }
    },
  },
};
</script>

<style lang="less">
.ddei-editor {

  width: 100%;
  height: calc(100vh);
  overflow: auto;
  display: flex;
  flex-direction: column;
  background-color: var(--background);
  
  .icon {
    color: var(--icon);
  }

  img {
    -webkit-user-drag: none;
    user-drag: none;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
  }

  div {
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
  }

  *> {
    &::-webkit-scrollbar {
      width: 6px;
      height: 6px;
    }

    &::-webkit-scrollbar-thumb {
      background-color: var(--scroll-hover); //darken(@toolbox-header,5%);
      -webkit-box-shadow: inset1px1px0rgba(0, 0, 0, 0.1);
    }

    &:hover::-webkit-scrollbar-thumb {
      background-color: var(--scroll-hover); //darken(@toolbox-header, 10%);
      -webkit-box-shadow: inset1px1px0rgba(0, 0, 0, 0.1);
    }

    &::-webkit-scrollbar-thumb:hover {
      background-color: var(--scroll-hover); //darken(@toolbox-header, 20%);
      -webkit-box-shadow: inset1px1px0rgba(0, 0, 0, 0.1);
    }

    &::-webkit-scrollbar-track {
      -webkit-box-shadow: inset006pxrgba(0, 0, 0, 0);
      background-color: var(--scroll-background); //darken(@toolbox-header, 0%);
    }

    &::-webkit-scrollbar-track:hover {
      -webkit-box-shadow: inset006pxrgba(0, 0, 0, 0.4);
      background-color: var(--scroll-background); //darken(@toolbox-header, 1%);
    }
  }
}
.ddei-cut-img-div {
  width: 0.1px;
  height: 0.1px;
  display: flex;
}

.dialog-background-div {
  width: 100%;
  height: 100vh;
  opacity: 50%;
  z-index: 500;
  left: 0;
  top: 0;
  display: none;
  position: absolute;
}
</style>
../icon