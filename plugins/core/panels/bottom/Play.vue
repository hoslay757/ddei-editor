<template>
  <div class="ddei-core-panel-bottom-play">
    <svg class="icon" aria-hidden="true">
      <use xlink:href="#icon-a-ziyuan379"></use>
    </svg>
  </div>
</template>
<script lang="ts">
import {DDeiEditor} from "ddei-framework1";

export default {
  name: "ddei-core-panel-bottom-play",
  extends: null,
  mixins: [],
  props: {
    //外部传入的插件扩展参数
    options: {
      type: Object,
      default: null
    }
  },
  data() {
    return {
      editor: null
    };
  },
  computed: {},
  watch: {},
  created() { },
  mounted() {
    //获取编辑器
    this.editor = DDeiEditor.ACTIVE_INSTANCE;
    
  },
  methods:{
    
  }
};
</script>

<style lang="less" scoped>
.ddei-core-panel-bottom-play {
    flex: 0 0 35px;
    display: flex;
    align-items: center;
    justify-content: center;
}
</style>
