<template>
  <div class="ddei-editor-layout-standrad">
    <div class="top" ref="top">
      <component ref="topComponents" v-for="(item,index) in editor?.getPartPanels(options,'top')" :is="item.comp"
        v-bind="item.options" :options="item.options"></component>
    </div>
    <div class="body">
      <div class="left" ref="left" v-show="toolboxShow">
        <component ref="leftComponents" v-for="(item, index) in editor?.getPartPanels(options, 'left')" :is="item.comp"
          :options="item.options" v-bind="item.options"></component>
      </div>
      <div class="middle" ref="middle">
        <component ref="middleComponents" v-for="(item, index) in editor?.getPartPanels(options, 'middle')"
          :is="item.comp" :options="item.options" v-bind="item.options"></component>
      </div>
      <div class="right" ref="right" v-show="propertyViewShow">
        <component ref="rightComponents" v-for="(item, index) in editor?.getPartPanels(options, 'right')"
          :is="item.comp" :options="item.options" v-bind="item.options"></component>
      </div>
    </div>
    <div class="bottom" ref="bottom">
      <component ref="bottomComponents" v-for="(item, index) in editor?.getPartPanels(options, 'bottom')"
        :is="item.comp" :options="item.options" v-bind="item.options"></component>
    </div>
  </div>
</template>

<script lang="ts">
import {DDeiEditor} from "ddei-framework";
import {DDeiUtil} from "ddei-framework";
import {DDeiEnumBusCommandType} from "ddei-framework";
import {DDeiEditorState} from "ddei-framework";
import {DDeiEnumOperateType} from "ddei-framework";

export default {
  name: "ddei-core-layout-standard",
  extends: null,
  mixins: [],
  props: {
    options: {
      type: Object,
      default: null
    }
  },
  data() {
    return {
      editor: null,
      dragObj: null,
      changeIndex: -1,
      allowOpenMultFiles: true,
      allowQuickColor: true,
      initLeftWidth: 0,
      initRightWidth: 0,
      toolboxShow: true,
      propertyViewShow: true,
    };
  },
  //注册组件
  components: {
  },
  computed: {},
  watch: {},
  created() {
    this.editor = DDeiEditor.ACTIVE_INSTANCE;

    // 监听obj对象中prop属性的变化
    this.$watch("editor.leftWidth", function (newVal, oldVal) {
      this.$refs.left.style.flexBasis = newVal + "px";
    });
    this.$watch("editor.middleWidth", function (newVal, oldVal) {
      
      //重新设置画布大小
      this.editor.ddInstance.render.setSize(
        this.editor.middleWidth,
        this.editor.middleHeight,
        0,
        0
      );
      this.editor.ddInstance.bus.push(DDeiEnumBusCommandType.RefreshShape)
      this.editor.ddInstance.bus.executeAll()
      this.editor.changeState(DDeiEditorState.DESIGNING);
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

    // 开始监听目标元素的大小变化
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
  }
};
</script>

<style lang="less" scoped>
.ddei-editor-layout-standrad {
  width: 100%;
  height: calc(100vh);
  display: flex;
  flex-direction: column;
  min-width: 1700px;

  .top {
    // flex: 0 0 103px
  }

  .bottom {
    // flex: 0 0 50px;
    border: 1px solid var(--border);
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
      flex: 1;
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
