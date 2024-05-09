<template>
  <div class="ddei-editor-layout-standrad" ref="layoutRoot">
    <div class="top" ref="top" v-show="topComponents?.length > 0">
      <component ref="topComponents" :editor="editor" v-for="(item,index) in topComponents" :is="item.comp"
        v-bind="item.options" :options="item.options"></component>
    </div>
    <div class="body">
      <div class="left" ref="left" v-show="toolboxShow && leftComponents?.length > 0">
        <component ref="leftComponents" :editor="editor" v-for="(item, index) in leftComponents" :is="item.comp"
          :options="item.options" v-bind="item.options"></component>
      </div>
      <div class="middle" ref="middle" v-show="middleComponents?.length > 0">
        <component ref="middleComponents" :editor="editor" v-for="(item, index) in middleComponents" :is="item.comp"
          :options="item.options" v-bind="item.options"></component>
      </div>
      <div class="right" ref="right" v-show="propertyViewShow && rightComponents?.length > 0">
        <component ref="rightComponents" :editor="editor" v-for="(item, index) in rightComponents" :is="item.comp"
          :options="item.options" v-bind="item.options"></component>
      </div>
    </div>
    <div class="bottom" ref="bottom" v-show="bottomComponents?.length > 0">
      <component ref="bottomComponents" :editor="editor" v-for="(item, index) in bottomComponents" :is="item.comp"
        :options="item.options" v-bind="item.options"></component>
    </div>
  </div>
</template>

<script lang="ts">
import {DDeiEditor} from "ddei-framework";
import {DDeiUtil} from "ddei-framework";
import {DDeiEnumBusCommandType} from "ddei-framework";
import {DDeiEditorState} from "ddei-framework";
import {DDeiEnumOperateType} from "ddei-framework";
import { markRaw } from "vue";
export default {
  name: "ddei-core-layout-standard",
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
      dragObj: null,
      changeIndex: -1,
      allowOpenMultFiles: true,
      allowQuickColor: true,
      initLeftWidth: 0,
      initRightWidth: 0,
      toolboxShow: true,
      propertyViewShow: true,
      leftComponents: [],
      rightComponents: [],
      topComponents: [],
      bottomComponents: [],
      middleComponents: [],
    };
  },
  //注册组件
  components: {
  },
  computed: {},
  watch: {},
  created() {

    // 监听obj对象中prop属性的变化
    this.$watch("editor.leftWidth", function (newVal, oldVal) {
      this.$refs.left.style.flexBasis = newVal + "px";
    });
 
    this.$watch("editor.rightWidth", function (newVal, oldVal) {
      this.$refs.right.style.flexBasis = newVal + "px";
    });
    this.$watch("editor.topHeight", function (newVal, oldVal) {
      this.$refs.top.style.flexBasis = newVal + "px";
    });
    this.$watch("editor.bottomHeight", function (newVal, oldVal) {
      this.$refs.bottom.style.flexBasis = newVal + "px";
    });
    this.leftComponents = markRaw(this.editor.getPartPanels(this.options, 'left'));
    this.rightComponents = markRaw(this.editor.getPartPanels(this.options, 'right'));
    this.topComponents = markRaw(this.editor.getPartPanels(this.options, 'top'));
    this.bottomComponents = markRaw(this.editor.getPartPanels(this.options, 'bottom'));
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

    this.editor.leftWidth = this.$refs.left.offsetWidth;
    this.editor.rightWidth = this.$refs.right.offsetWidth;
    this.editor.topHeight = this.$refs.top.offsetHeight;
    this.editor.bottomHeight = this.$refs.bottom.offsetHeight;
    this.editor.middleWidth = this.$refs.middle.offsetWidth;
    this.editor.middleHeight = this.$refs.middle.offsetHeight;
    this.initLeftWidth = this.$refs.left.offsetWidth
    this.initRightWidth = this.$refs.right.offsetWidth
    this.editor.maxWidth = this.editor.leftWidth + this.editor.rightWidth + this.editor.middleWidth;

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
      let arr = [this.$refs.topComponents, this.$refs.leftComponents, this.$refs.middleComponents, this.$refs.rightComponents, this.$refs.bottomComponents]
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
    },

    // resetSize() {
    //   let layoutRoot = this.$refs.layoutRoot;
    //   let width = layoutRoot.scrollWidth
    //   let height = layoutRoot.scrollHeight
    //   if (!window.upSizeWidth || !window.upSizeHeight) {
    //     window.upSizeWidth = width;
    //     window.upSizeHeight = height;
    //   } else {
    //     let deltaWidth = width - window.upSizeWidth;
    //     let deltaHeight = height - window.upSizeHeight;
    //     if (this.editor.middleWidth + deltaWidth >= 305) {
    //       window.upSizeWidth = width;
    //       this.editor.middleWidth += deltaWidth;
    //       this.editor.maxWidth =
    //         this.editor.leftWidth +
    //         this.editor.rightWidth +
    //         this.editor.middleWidth;
    //     }
    //     if (this.editor.middleHeight + deltaHeight >= 305) {
    //       window.upSizeHeight = height;
    //       this.editor.middleHeight += deltaHeight;
    //       this.editor.maxHeight =
    //         this.editor.leftHeight +
    //         this.editor.rightHeight +
    //         this.editor.middleHeight;
    //     }
    //     this.editor.ddInstance.render.setSize(
    //       this.editor.middleWidth,
    //       this.editor.middleHeight,
    //       0,
    //       0
    //     );
    //     this.editor.ddInstance.bus.push(DDeiEnumBusCommandType.RefreshShape);
    //     this.editor.ddInstance.bus.executeAll();
    //   }
    // },
  }
};
</script>

<style lang="less" scoped>
.ddei-editor-layout-standrad {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;

  .top {
    border: 0.5px solid var(--border);
    border-bottom: none;
  }

  .bottom {
    border: 0.5px solid var(--border);
    border-top: none;
  }

  .body {
    display: flex;
    overflow:hidden;
    flex: 1 1 calc(100vh - 153px);

    .left {
      flex: 0 1 292px;
      border: 1px solid var(--border);
      overflow: hidden;
    }

    .middle {
      flex: 1 1 auto;
      display: flex;
      flex-direction: column;
    }

    .right {
      flex: 0 1 292px;
      border: 1px solid var(--border);
      overflow: hidden;
    }
  }
}
</style>
<style lang="less">
.ddei-editor-layout-standrad {
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
