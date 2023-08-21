<template>
  <div>
    <div id="ddei_editor_toolbox"
         class="ddei_editor_toolbox">
      <button type="button" @click="createRectangle()" style="width:120px;height:30px;margin-top:10px">矩形</button>
      <button type="button" @click="createCircle()" style="width:120px;height:30px;margin-top:10px">圆型</button>
      <button type="button" @click="createDiamond()" style="width:120px;height:30px;margin-top:10px">菱形</button>
      <button type="button" @click="createImg(1)" style="width:120px;height:30px;margin-top:10px">矩形图片</button>
      <button type="button" @click="createImg(2)" style="width:120px;height:30px;margin-top:10px">圆形图片</button>
      <button type="button" @click="createImg(3)" style="width:120px;height:30px;margin-top:10px">菱形图片</button>
      <button type="button" @click="createContainer(1)" style="width:120px;height:30px;margin-top:10px">容器-不联动</button>
      <button type="button" @click="createContainer(2)" style="width:120px;height:30px;margin-top:10px">容器-联动子</button>
      <button type="button" @click="createContainer(3)" style="width:120px;height:30px;margin-top:10px">容器-联动父</button>
      <button type="button" @click="createContainer(4)" style="width:120px;height:30px;margin-top:10px">容器-双联动</button>
    </div>
  </div>
</template>

<script lang="ts">

export default {
  name: "DDei-Editor-Toolbox",
  extends: null,
  mixins: [],
  props: {},
  data() {
    return {};
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {
  },
};
</script>

<style scoped>
.ddei_editor_toolbox {
  text-align: center;
  background: green;
}
</style>
