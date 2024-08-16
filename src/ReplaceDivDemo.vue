<script lang="ts">
export default {
  name: "replace-div-demo",
  mixins: [],
  components: {
  },
  props: {
    type: {
      type: String,
      default: null
    },
    name: {
      type: String,
      default: null
    },
    matchField:{
      type: String,
      default: null
    },
    editor:{
      type:Object,
      default:null
    }
  },
  data() {
    return {
      attrDefine: null,
      value: null
    };
  },
  computed: {},
  watch: {

  },
  created() {

  },
  mounted() {
    let field = this.matchField;
    this.editor.renderViewerIns[this[field]] = this
    this.editor.renderViewerElements[this[field]] = this.$refs['divElement']
  },
  methods: {
    
  }
};
</script>
<template>
  <div ref="divElement"
    style="display: flex;flex-direction:column;text-align:center;align-items: center;background: white;color:black;display: none;">
    <div style="width:100%;display: flex;text-align:center;align-items: center;">
      <div style="flex:1">代码</div>
      <div style="flex:1">{{ type }}</div>
    </div>
    <div style="width:100%;display: flex;text-align:center;align-items: center;">
      <div style="flex:1">名称</div>
      <div style="flex:1">{{ name }}</div>
    </div>
  </div>
</template>