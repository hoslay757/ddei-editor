<template>
  <div id="ddei_editor_bottommenu"
        class="ddei_editor_bottommenu">
    <button type="button" v-for="(item, i) in layers" @click="changeLayer(i)" style="width:120px;height:30px;margin-top:10px">{{ item.id }}</button>
    <button type="button" @click="createLayer()" style="width:120px;height:30px;margin-top:10px">图层+</button>
    <button type="button" @click="removeLayer()" style="width:120px;height:30px;margin-top:10px">图层-</button>
    <button type="button" @click="displayLayer()" style="width:120px;height:30px;margin-top:10px">显示图层</button>
    <button type="button" @click="hiddenLayer()" style="width:120px;height:30px;margin-top:10px">隐藏图层</button>
    <button type="button" style="width:120px;height:30px;margin-top:10px">放大</button>
    <button type="button" style="width:120px;height:30px;margin-top:10px">缩小</button>
  </div>
</template>

<script lang="ts">
export default {
  name: "DDei-Editor-BottomMenu",
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
.ddei_editor_bottommenu {
  height:60px;
  width:100%;
  background: #d87093;
}
</style>
