<template>
  <div class="ddei-core-panel-bottom-managelayers" v-if="allowOpenMultLayers" @click="showLayersDialog($event)">
    <svg class="icon" aria-hidden="true">
      <use xlink:href="#icon-a-ziyuan402"></use>
    </svg>
  </div>
</template>
<script lang="ts">
import {DDeiEditor} from "ddei-framework";
import {DDeiEditorUtil} from "ddei-framework";
import {DDeiEditorState} from "ddei-framework";

export default {
  name: "ddei-core-panel-bottom-managelayers",
  extends: null,
  mixins: [],
  props: {
    //外部传入的插件扩展参数
    options: {
      type: Object,
      default: null
    }
  },
  data() {
    return {
      editor: null,
      allowOpenMultLayers: true,
    };
  },
  computed: {},
  watch: {},
  created() { },
  mounted() {
    //获取编辑器
    this.editor = DDeiEditor.ACTIVE_INSTANCE;
    this.allowOpenMultLayers = DDeiEditorUtil.getConfigValue(
      "GLOBAL_ALLOW_OPEN_MULT_LAYERS",
      this.editor
    );
  },
  methods:{
    showLayersDialog(evt: Event) {
      let srcElement = evt.currentTarget;
      DDeiEditorUtil.showOrCloseDialog("ddei-core-dialog-managerlayers", {
        group: "bottom-dialog"
      }, { type: 3 }, srcElement)
      if (DDeiEditor.ACTIVE_INSTANCE.tempDialogData && DDeiEditor.ACTIVE_INSTANCE.tempDialogData["ddei-core-dialog-managerlayers"]) {
        this.editor.changeState(DDeiEditorState.PROPERTY_EDITING);
      } else {
        this.editor.changeState(DDeiEditorState.DESIGNING);
      }

    },
  }
};
</script>

<style lang="less" scoped>
.ddei-core-panel-bottom-managelayers {
    flex: 0 0 35px;
    display: flex;
    align-items: center;
    justify-content: center;
}
</style>
