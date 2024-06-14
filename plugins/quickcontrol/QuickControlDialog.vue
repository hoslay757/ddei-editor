<template>
  <div :id="editor?.id + '_' + dialogId" class="ddei-ext-dialog-quickcontrol" v-if="forceRefresh">
    <QuickControlPanel :editor="editor" :options="options"></QuickControlPanel>
  </div>
</template>

<script lang="ts">
import {DDeiEditor} from "ddei-framework";
import {DDeiEnumBusCommandType} from "ddei-framework";
import DialogBase from "./dialog"
import QuickControlPanel from "./QuickControlPanel.vue"

export default {
  name: "ddei-ext-dialog-quickcontrol",
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
      dialogId: 'ddei-ext-dialog-quickcontrol',
    };
  },
  computed: {},
  components: { QuickControlPanel },
  watch: {},
  created() { },
  mounted() {

  },
  methods: {
  }
};
</script>

<style lang="less" scoped>
.ddei-ext-dialog-quickcontrol {
  
  display: none;
  overflow: hidden;
  position: absolute;
  background: transparent;
  pointer-events: none;
  z-index: 999;
}
</style>
