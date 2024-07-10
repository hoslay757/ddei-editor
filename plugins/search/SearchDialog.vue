<template>
  <div :id="editor?.id + '_' + dialogId" class="ddei-ext-dialog-search" v-if="forceRefresh">
    <SearchPanel :editor="editor" :options="options"></SearchPanel>
  </div>
</template>

<script lang="ts">
import {DDeiEditor} from "ddei-framework";
import {DDeiEnumBusCommandType} from "ddei-framework";
import DialogBase from "./dialog"
import SearchPanel from "./SearchPanel.vue"

export default {
  name: "ddei-ext-dialog-search",
  extends: null,
  mixins: [DialogBase],
  props: {
    options: {
      type: Object,
      default: null
    },
  },
  data() {
    return {
      dialogId: 'ddei-ext-dialog-search',
    };
  },
  computed: {},
  components: { SearchPanel },
  watch: {},
  created() { },
  mounted() {

  },
  methods: {
  }
};
</script>

<style lang="less" scoped>
.ddei-ext-dialog-search {
  box-shadow: 0px 2px 24px 0px hwb(0 0% 100% / 0.25);
  border-radius: 6px;
  display: none;
  overflow: hidden;
  position: absolute;
  padding-top:3px;
  background-color: var(--panel-background);
  z-index: 999;
}
</style>
