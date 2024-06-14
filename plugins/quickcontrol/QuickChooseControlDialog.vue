<template>
  <div :id="editor?.id + '_' + dialogId" class="ddei-ext-dialog-quickchoosecontrol" v-if="forceRefresh">
    
  </div>
</template>

<script lang="ts">
import {DDeiEditor} from "ddei-framework";
import {DDeiEnumBusCommandType} from "ddei-framework";
import DialogBase from "./dialog"

export default {
  name: "ddei-ext-dialog-quickchoosecontrol",
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
      dialogId: 'ddei-ext-dialog-quickchoosecontrol',
    };
  },
  computed: {},
  components: {  },
  watch: {},
  created() { },
  mounted() {

  },
  methods: {
  }
};
</script>

<style lang="less" scoped>
.ddei-ext-dialog-quickchoosecontrol {
  border: 1px solid var(--panel-border); //darken(var(--panel-header), 13%);
  box-shadow: 0px 2px 24px 0px hsl(0deg 0% 0% /0.25); //darken(var(--panel-header), 10%);
  border-radius: 6px;
  display: none;
  overflow: hidden;
  position: absolute;
  background-color: var(--panel-background);
  height: 240px;
  opacity: 0.6;
  width:240px;
  z-index: 1999;
  user-select: none;
  color: var(--panel-title);
}
</style>
