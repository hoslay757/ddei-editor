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
    },
    model:{
      type: Object,
      default: null
    }
  }
};
</script>
<template>
  <div ref="divElement" class="html-demo">
    <div style="width:100%;display: flex;text-align:center;align-items: center;">
      <div style="flex:1">ID</div>
      <div style="flex:1">{{ model.id }}</div>
    </div>
    <div style="width:100%;display: flex;text-align:center;align-items: center;">
      <div style="flex:1">名称</div>
      <div style="flex:1">{{ name }}</div>
    </div>
  </div>
</template>
<style scoped>
.html-demo {
  position: absolute;
  pointer-events: none;
  user-select: none;
  display: none;
  border: 1px solid grey;
}
</style>