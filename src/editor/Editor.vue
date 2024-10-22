<template>
  <div :id="id" ref="editor_div" class="ddei-editor" @contextmenu.prevent @mousedown="mouseDown($event)">
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
import { loadControlByFrom, loadAndSortGroup } from "./grouputil";

import ICONS from "./icon";
import { markRaw } from "vue";

import '@/assets/ddei.css'
import '@/assets/fonts/iconfont/iconfont.css'
import '@/assets/fonts/iconfont/iconfont.js'

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
    let editor = DDeiEditor.newInstance(this.id, this.id, true, this.options);
    this.editor = editor
    // }
    //载入局部配置
    if (this.options){
      this.editor.applyConfig(this.options.config);
      this.editor.extConfig = this.options.config;
      this.editor.ddInstance.applyConfig(this.options.config);
    }
    //加载自定义控件以及分组
    if (this.options?.config?.controlDefines?.length > 0) {
      //加载控件定义
      this.options?.config?.controlDefines.forEach(control => {
        if (this.editor.controls.has(control.id)){
          let oldControl = this.editor.controls.get(control.id)
          //合并控件自身与from组件的define、menu
          //复写属性
          if (control.define) {
            for (let n in control.define) {
              if (control.define[n] || control.define[n] == 0) {
                oldControl.define[n] = control.define[n]
              }
            }
          }
          control = oldControl
        }
        this.editor.controls.set(control.id, control);
        loadControlByFrom(this.editor.controls, control)
      });
    }
    //加载自定义控件以及分组
    if (this.options?.config?.groupDefines?.length > 0) {
      loadAndSortGroup(this.options?.config?.groupDefines, this.editor.controls)
      this.options.config.groupDefines.forEach(group => {
        let finded = false;
        for (let i = 0; i < this.editor.groups.length; i++) {
          if (this.editor.groups[i].id == group.id) {
            this.editor.groups[i] = group
            finded = true
            break;
          }
        }
        if (!finded) {
          this.editor.groups.push(group)
        }
      });
      this.editor.groups.sort((a,b)=>{
        return a.orderNo - b.orderNo
      })
      this.options.config.groupDefines.forEach(group => {
        group.controls.forEach(control => {
          if (control.define) {
            delete control.define.font
            delete control.define.textStyle
            delete control.define.border
            delete control.define.fill
          }
          delete control.attrs
        });
      })
    }

    this.editor.controls?.forEach(control => {
      if (control.menus) {
        if (!editorInstance.menuMapping[control.id]) {
          editorInstance.menuMapping[control.id] = control.menus
        }
        let menus = editorInstance.menuMapping[control.id];
        for (let i = 0; i < menus.length; i++) {
          for (let j in editorInstance.menus) {
            if (editorInstance.menus[j].name == menus[i].name) {
              menus[i] = editorInstance.menus[j];
              break;
            }
          }
        }
      }
      if (control.define) {
        delete control.define.font
        delete control.define.textStyle
        delete control.define.border
        delete control.define.fill
      }
      delete control.attrs
    })
    DDeiEditorUtil.ICONS = ICONS;

  },
  mounted() {
    this.editor.editorViewer = this;
    this.editor.htmlElement = this.$refs.editor_div;
    //设置默认风格
    this.editor.bindEvent();
    this.editor.changeTheme('');
    
    //初始化大小
    if (this.options?.config?.width) {
      this.$refs.editor_div.style.width = this.options?.config?.width + "px";
    }
    if (this.options?.config?.height) {
      this.$refs.editor_div.style.height = this.options?.config?.height + "px";
    }
    
    //初始化控件
    if(this.options?.config?.initData){
      //调用转换器，将输入内容转换为设计器能够识别的格式
      let initData = this.options?.config?.initData
      let converters = this.editor.getEnabledConverters(initData, 1);
      //依次调用converters
      converters?.forEach(converter => {
        initData = converter.input(initData)
      });
      this.editor.addControls(initData.controls)
    }
    
    if (this.options?.config?.access){
      this.editor.setAccessInfo(this.options?.config?.access)
    } else if (this.options?.config?.readonly == true || this.options?.config?.readonly == false) {
      this.editor.setEditable(!this.options?.config?.readonly)
    }

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
    if(this.editor.needControlIcon){
      DDeiEditorUtil.getControlIcons(this.editor);
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

    
  },
};
</script>

<style lang="less">
.ddei-editor {
  position:relative;
  width: 100%;
  height:100%;
  // overflow: auto;
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