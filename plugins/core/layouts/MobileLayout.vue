<template>
  <div class="ddei-editor-layout-mobile" ref="layoutRoot">
    <div class="before" ref="before">
      <component ref="beforeComponents" :editor="editor" v-for="(item,index) in beforeComponents" :is="item.comp"
        v-bind="item.options" :options="item.options"></component>
    </div>
    <div class="middle" ref="middle">
      <component ref="middleComponents" :editor="editor" v-for="(item, index) in middleComponents" :is="item.comp"
        :options="item.options" v-bind="item.options"></component>
      <component ref="otherComponents" :editor="editor" v-for="(item, index) in otherComponents" :is="item.comp"
        :options="item.options" v-bind="item.options"></component>
    </div>
    <div class="after" ref="after">
      <component ref="afterComponents" :editor="editor" v-for="(item, index) in afterComponents" :is="item.comp"
        :options="item.options" v-bind="item.options"></component>
    </div>
  </div>
</template>

<script lang="ts">
import {DDeiEditor} from "ddei-framework";
import {DDeiUtil} from "ddei-framework";
import {DDeiEnumBusCommandType} from "ddei-framework";
import { DDeiModelArrtibuteValue } from "ddei-framework";
import {DDeiEnumOperateType} from "ddei-framework";
import { markRaw } from "vue";
export default {
  name: "ddei-core-layout-mobile",
  extends: null,
  mixins: [],
  props: {
    options: {
      type: Object,
      default: null
    },
    editor:{
      type:DDeiEditor,
      default:null,
    }
  },
  data() {
    return {
      otherComponents: [],
      beforeComponents: [],
      afterComponents: [],
      middleComponents: [],
    };
  },
  //注册组件
  components: {
  },
  computed: {},
  watch: {},
  created() {
    this.otherComponents = markRaw(this.editor.getPartPanels(this.options, 'other'));
    this.beforeComponents = markRaw(this.editor.getPartPanels(this.options, 'before'));
    this.afterComponents = markRaw(this.editor.getPartPanels(this.options, 'after'));
    this.middleComponents = markRaw(this.editor.getPartPanels(this.options, 'middle'));
  },
  mounted() {
    this.editor.layoutViewer = this;
    
    
    // 获取要监听的 div 元素
    let middleCanvas = document.getElementById(this.editor.id+"_canvas");
    // 创建 ResizeObserver 实例
    const resizeObserver = new ResizeObserver(entries => {
      // entries 是一个 ResizeObserverEntry 对象数组，包含目标元素的大小信息
      for (const entry of entries) {
        // 获取宽度和高度
        const { width, height } = entry.contentRect;
        if (width != 0 && height != 0) {
          
          //横向
          if (DDeiUtil.isLandscape()){
            this.$refs['layoutRoot'].setAttribute("class","ddei-editor-layout-mobile ddei-editor-layout-mobile-row");
          }
          //纵向
          else{
            this.$refs['layoutRoot'].setAttribute("class", "ddei-editor-layout-mobile ddei-editor-layout-mobile-column")
          }
          
          this.editor.ddInstance.render.setSize(
            width,
            height,
            0,
            0
          );
          
          
          this.editor.ddInstance.bus.push(DDeiEnumBusCommandType.RefreshShape);
          this.editor.ddInstance.bus.executeAll();
        }

      }
    });

    //开始监听目标元素的大小变化
    resizeObserver.observe(middleCanvas);
    
    this.editor.beforeHeight = this.$refs.before.offsetHeight;
    this.editor.afterHeight = this.$refs.after.offsetHeight;
    this.editor.middleWidth = this.$refs.middle.offsetWidth;
    this.editor.middleHeight = this.$refs.middle.offsetHeight;

    let ddInstance = this.editor.ddInstance;
    if (ddInstance) {
      let modeName = DDeiUtil.getConfigValue("MODE_NAME", ddInstance);
      let accessCreate = DDeiUtil.isAccess(
        DDeiEnumOperateType.CREATE, null, null, modeName,
        ddInstance
      );
      this.toolboxShow = accessCreate
      let accessEdit = DDeiUtil.isAccess(
        DDeiEnumOperateType.EDIT, null, null, modeName,
        ddInstance
      );
      this.propertyViewShow = accessEdit
  
    }
  },
  methods: {
    
    //强制刷新下层组件
    forceRefreshParts(parts){
      let arr = [this.$refs.beforeComponents, this.$refs.middleComponents, this.$refs.otherComponents, this.$refs.afterComponents]
      arr.forEach(comps=>{
        if (comps){
          if(Array.isArray(comps)){
            comps.forEach(comp=>{
              if (comp && comp.forceRefreshParts){
                comp.forceRefreshParts(parts);
              }
            })
          } else if (comps.forceRefreshParts) {
            comps.forceRefreshParts(parts);
          }
        }
      })
    }
  }
};
</script>

<style lang="less" scoped>
.ddei-editor-layout-mobile {
  width: 100%;
  height: 100vh;
  display: flex;
  


  &-column{
    flex-direction: column;
    .after {
        >* {
          height: 240px;
          width:100%;
          border-top: 0.5px solid var(--border);
        }
      }
  }

  &-row{
    flex-direction: row;

    .after {
      >* {
          height:100vh;
          width: 240px;
          border-left: 0.5px solid var(--border);
        }
    }
    
  }

  .middle {
    flex: 1 1 auto;
    display: flex;
  }

  .before {
    flex:0 1 auto;
  }

  .after {
    flex: 0 1 auto;
  }
}
</style>
<style lang="less">
.ddei-editor-layout-mobile {
  >img {
    -webkit-user-drag: none;
    user-drag: none;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
  }

  >div {
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
  }
}
</style>
