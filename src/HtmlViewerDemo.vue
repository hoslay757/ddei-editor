<script lang="ts">
import { DDeiEnumBusCommandType } from 'ddei-framework'
export default {
  name: "html-viewer-div-demo",
  props: {
    model: {
      type: Object,
      default: null
    },
    editor:{
      type:Object,
      default:null
    }
  },
  mounted() {
    this.editor.renderViewerIns[this.model.id] = this
    this.editor.renderViewerElements[this.model.id] = this.$refs['divElement']
    this.editor.bus.push(DDeiEnumBusCommandType.RefreshShape);
    this.editor.bus.executeAll();
  }
};
</script>
<template>
  <div ref="divElement"
    style="display: flex;position:absolute;flex-direction:column;text-align:center;align-items: center;border:1px solid grey;background: white;color:black;display: none;">
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