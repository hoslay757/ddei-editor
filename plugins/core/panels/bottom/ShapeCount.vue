<template>
  <div class="ddei-core-panel-bottom-shapecount">
    {{title}} {{ editor?.files[editor?.currentFileIndex]?.modelNumber }}
  </div>
</template>
<script lang="ts">
import {DDeiEditor} from "ddei-framework";

export default {
  name: "ddei-core-panel-bottom-shapecount",
  extends: null,
  mixins: [],
  props: {
    //外部传入的插件扩展参数
    options: {
      type: Object,
      default: null
    },
    title: {
      type: String,
      default: "形状数: "
    }
    , editor: {
      type: DDeiEditor,
      default: null,
    }
  },
  data() {
    return {}
  },
  computed: {},
  watch: {},
  created() { },
  mounted() {
  },
};
</script>

<style lang="less" scoped>
.ddei-core-panel-bottom-shapecount {
    flex: 0 0 100px;
    display: block;
    text-align: center;
}
</style>
