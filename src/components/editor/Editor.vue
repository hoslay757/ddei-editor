<template>
  <div>
    <div id="ddei_editor"
         class="ddei_editor">
      <div class="top">
        <TopMenu></TopMenu>
      </div>
      <div class="body">
        <div class="left">
          <Toolbox></Toolbox>
        </div>
        <div class="middle">
          <CanvasView></CanvasView>
        </div>
        <div class="right">
          <PropertyView></PropertyView>
        </div>
      </div>
      <div class="bottom">
        <BottomMenu></BottomMenu>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import TopMenu from './topmenu/TopMenu.vue';
import Toolbox from './toolbox/Toolbox.vue';
import BottomMenu from './bottommenu/BottomMenu.vue';
import PropertyView from './propertyview/PropertyView.vue';
import CanvasView from './canvasview/CanvasView.vue';

export default {
  name: "DDei-Editor",
  extends: null,
  mixins: [],
  props: {},
  data() {
    return {};
  },
  //注册组件
  components: {
    TopMenu,
    Toolbox,
    BottomMenu,
    PropertyView,
    CanvasView
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {
   
  },
};
</script>

<style scoped>
.ddei_editor {
  width: 100%;
  height: calc(100vh);
  display: flex;
  flex-direction: column;        
  background-color: aquamarine;
}

.ddei_editor .top {
  background: grey;
  flex: 0 0 175px!important;
}

.ddei_editor .body {
  display: flex; 
  flex: 1;
}

.ddei_editor .body .left {
  text-align: center;
  background: green;
  flex: 0 0 220px!important;
}

.ddei_editor .body .middle {
  background: blue;
  flex: 1;
}

.ddei_editor .body .right {
  flex: 0 0 275px!important;
}

.ddei_editor .bottom {
  flex: 0 0 60px!important;
}
</style>
