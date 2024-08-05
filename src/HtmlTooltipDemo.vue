<script lang="ts">
export default {
  name: "html-tooltip-div-demo",
  props: {
    model: {
      type: Object,
      default: null
    },
    editor:{
      type:Object,
      default:null
    }
  }
};
</script>
<template>
  <div ref="divElement" class="tooltip-demo">
    <div style="width:100%;display: flex;text-align:center;align-items: center;">
      <div style="flex:1">ID</div>
      <div style="flex:1">{{ model.id }}</div>
    </div>
    <div style="width:100%;display: flex;text-align:center;align-items: center;">
      <div style="flex:1">名称</div>
      <div style="flex:1">{{ model.name }}</div>
    </div>
  </div>
</template>

<style lang="less" scoped>
/**以下是快捷样式编辑的弹出框 */
.tooltip-demo {
  display: flex;
  flex-direction: column;
  text-align: center;
  align-items: center;
  background: white;
  color: black;
  width:200px;
  height:100px;
}
</style>