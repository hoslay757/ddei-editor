<template>
  <a-config-provider :locale="locale">
    <router-view v-slot="{ Component, route }">
      <component :is="Component" :key="route.path" />
    </router-view>
  </a-config-provider>
</template>

<script lang="ts">
import zhCN from 'ant-design-vue/es/locale/zh_CN';

export default {
  name: "APP-DDEI",
  extends: null,
  mixins: [],
  props: {},
  //注册组件
  components: {},
  data() {
    return {
      locale: zhCN,
      layers: [],
    };
  },
  computed: {},
  watch: {},
  created() {
    document.body.style.overscrollBehaviorX = "none"
  },
  mounted() { 
  },
  methods: {},
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
  touch-action: none;
}

.icon {
  width: 1em;
  height: 1em;
  vertical-align: -0.15em;
  fill: currentColor;
  overflow: hidden;
}
</style>
