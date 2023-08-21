<template>
  <div>
    <div id="ddei_editor_topmenu" class="ddei_editor_topmenu">
      <button type="button" style="width:120px;height:30px;margin-top:10px">新建</button>
      <button type="button" style="width:120px;height:30px;margin-top:10px">打开</button>
      <button type="button" style="width:120px;height:30px;margin-top:10px">保存</button>
      <we-button>按钮组件</we-button>
      <we-button style="margin-left: 12px" disabled>按钮组件</we-button>
    </div>
  </div>
</template>

<script lang="ts">


export default {
  name: "DDei-Editor-TopMenu",
  extends: null,
  mixins: [],
  props: {},
  data() {
    return {};
  },
  computed: {},
  watch: {},
  created() { },
  mounted() {

  },
};
</script>

<style scoped>
.ddei_editor_topmenu {
  background: grey;
  width: 100%;
  height: 175px;
}
</style>
