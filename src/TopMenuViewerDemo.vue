<script lang="ts">
export default {
  name: "top-menu-custom-viewer-demo",
  props: {
    options: {
      type: Object,
      default: null
    },
    editor:{
      type:Object,
      default:null
    }
  },
  methods:{
    click(){
      console.log("自定义:"+this.editor)
    }
  }
};
</script>
<template>
    <div style="color:red" @click="click">
      自定义
    </div>
</template>