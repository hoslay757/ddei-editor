<template>
  <div class="ddei-core-panel-bottom-managelayers" v-if="allowOpenMultLayers" @click="showLayersDialog($event)">
    <svg class="icon" aria-hidden="true">
      <use xlink:href="#icon-layers"></use>
    </svg>
  </div>
</template>
<script lang="ts">
import {DDeiEditor} from "ddei-framework";
import {DDeiEditorUtil} from "ddei-framework";
import { DDeiEditorState, DDeiEnumOperateType, DDeiUtil } from "ddei-framework";

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
    , editor: {
      type: DDeiEditor,
      default: null,
    }
  },
  data() {
    return {
      allowOpenMultLayers: true
    };
  },
  computed: {},
  watch: {},
  created() { },
  mounted() {

    this.allowOpenMultLayers = DDeiEditorUtil.getConfigValue(
      "GLOBAL_ALLOW_OPEN_MULT_LAYERS",
      this.editor
    );
  },
  methods:{
    showLayersDialog(evt: Event) {
      let srcElement = evt.currentTarget;
      DDeiEditorUtil.showOrCloseDialog(this.editor, "ddei-core-dialog-managerlayers", {
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
    flex: 0 0 30px;
    display: flex;
    align-items: center;
    justify-content: center;
    .icon{
      font-size: 20px;
    }
    &:hover{
      background-color: var(--panel-hover);
        cursor: pointer;
    }
}
</style>
