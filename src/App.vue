<template>
  <div>
    <DDeiEditor></DDeiEditor>
  </div>
</template>
<script lang="ts">
import DDeiEditor from "./components/editor/Editor.vue";

export default {
  name: "APP-DDEI-EDITOR",
  extends: null,
  mixins: [],
  props: {},
  //注册组件
  components: {
    DDeiEditor,
  },
  data() {
    return {
      layers: [],
    };
  },
  computed: {},
  watch: {},
  created() { },
  mounted() {
    
  },
  methods: {
    
  },
};
</script>
<style>
body {
  display: block;
}

#app {
  padding: 0;
  margin: 0;
  display: block;
  max-width: 100%;
}


</style>
