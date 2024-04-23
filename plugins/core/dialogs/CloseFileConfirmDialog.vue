<template>
  <div :id="dialogId" class="ddei-core-dialog-closefile" v-if="forceRefresh">
    <div class="content">
      <div class="header">
        <svg class="icon warn" aria-hidden="true">
          <use xlink:href="#icon-a-ziyuan411"></use>
        </svg>
        <span>是否保存文件？</span>
        <div style="flex:1"></div>
        <svg class="icon close" aria-hidden="true" @click="cancel">
          <use xlink:href="#icon-a-ziyuan422"></use>
        </svg>
      </div>
      <div class="msg">

      </div>
      <div class="tail">
        <div class="button button-main" @click="ok">保存</div>
        <div class="button" @click="abort">不保存</div>
        <div class="button" @click="cancel">取消</div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import {DDeiEditor} from "ddei-framework1";
import {DDeiEditorUtil} from "ddei-framework1";
import DialogBase from "./dialog"

export default {
  name: "ddei-core-dialog-closefile",
  extends: null,
  mixins: [DialogBase],
  props: {
    //外部传入的插件扩展参数
    options: {
      type: Object,
      default: null
    }
  },
  data() {
    return {
      dialogId: 'ddei-core-dialog-closefile',
    };
  },
  computed: {},
  components: {},
  watch: {},
  created() { },
  mounted() {
  },
  methods: {
    ok() {
      if (this.editor?.tempDialogData[this.dialogId]?.callback?.ok) {
        this.editor?.tempDialogData[this.dialogId]?.callback?.ok();
      }
      DDeiEditorUtil.closeDialog('ddei-core-dialog-closefile');
    },
    cancel() {
      if (this.editor?.tempDialogData[this.dialogId]?.callback?.cancel) {
        this.editor.tempDialogData[this.dialogId].callback.cancel();
      }
      DDeiEditorUtil.closeDialog('ddei-core-dialog-closefile');
    },
    abort() {
      if (this.editor?.tempDialogData[this.dialogId]?.callback?.abort) {
        this.editor.tempDialogData[this.dialogId].callback.abort();
      }
      DDeiEditorUtil.closeDialog('ddei-core-dialog-closefile');
    },
  }
};
</script>

<style lang="less" scoped>
/**以下为询问框的样式 */
.ddei-core-dialog-closefile {
  width: 420px;
  height: 165px;
  background: var(--panel-background);
  border: 1px solid var(--panel-border);
   box-shadow: 0px 2px 24px 0px hsl(0deg 0% 0% /0.25);
  border-radius: 12px;
  display: none;
  position: absolute;
  overflow: hidden;
  z-index: 999;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);

  .content {
    width: 420px;
    height: 165px;
    display: flex;
    flex-direction: column;
    padding: 0 24px;

    .header {
      flex: 0 0 55px;
      display: flex;
      align-items: center;
      font-size: 18px;
      font-weight: 400;
      color: var(--panel-title);

      >span {
        margin: 0 2px;
      }


      .close {
        font-size: 22px;
      }

      .warn {
        font-size: 20px !important;
        color: #F05B13;
      }
    }

    .msg {
      flex: 0 0 55px;
      display: flex;
      justify-content: center;
      align-items: center;
      font-size: 16px;
      font-weight: 400;
      color: var(--panel-title);
    }

    .tail {
      flex: 0 0 55px;
      display: flex;
      align-items: center;
      text-align: center;
      justify-content: end;
    }

    .button {
      flex: 0 0 70px;
      height: 32px;
      background: var(--panel-header);
      border: 1px solid var(--panel-border);
      border-radius: 6px;
      font-size: 16px;
      font-weight: 400;
      color: var(--panel-title);
      margin-left: 13px;
      display: flex;
      align-items: center;
      justify-content: center;

    }

    .button:hover {
      color: white;
      background: var(--dot);
      cursor: pointer;
    }

    .button-main {
      color: white;
      background: var(--dot);

    }
  }
}
</style>
