<template>
  <div :id="editor?.id + '_' + dialogId" class="ddei-core-dialog-selectboderweight" v-if="forceRefresh">
    <div class="content">
      <div class="group">
        <div class="title">{{ editor.i18n('ddei.lineWeight') }}</div>
        <div class="group_content">
          <div :class="{ 'item': true, 'item-selected': JSON.stringify(value) == JSON.stringify(data.value) }"
            v-for="data in dataSource" @click="select(data.value)" @dblclick="selectAndConfirm(data.value)">
            <svg class="div_input">
              <line x1=0 y1="50%" x2="100%" y2="50%" :stroke-width="data.value" :stroke-dasharray="dash">
              </line>
            </svg>
          </div>
        </div>
      </div>
      <div class="tail">
        <div class="button button-main" @click="ok">{{ editor.i18n('ddei.confirm') }}</div>
        <div class="button" @click="cancel">{{ editor.i18n('ddei.cancel') }}</div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import {DDeiEditor} from "ddei-framework";
import {DDeiEditorUtil} from "ddei-framework";
import DialogBase from "./dialog"

export default {
  name: "ddei-core-dialog-selectboderweight",
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
      dialogId: 'ddei-core-dialog-selectboderweight',
      value: [],
      //最近使用的颜色
      dataSource: null,
      dash: []
    }
  },
  computed: {},
  components: {},
  watch: {},
  created() { },
  mounted() {
    this.refreshData();
  },
  methods: {
    refreshData(){
      if (this.editor?.tempDialogData && this.editor?.tempDialogData[this.dialogId]?.value) {
        this.value = this.editor?.tempDialogData[this.dialogId].value
      }
      if (this.editor?.tempDialogData && this.editor?.tempDialogData[this.dialogId]?.dataSource) {
        this.dataSource = this.editor?.tempDialogData[this.dialogId].dataSource
      }
      if (this.editor?.tempDialogData && this.editor?.tempDialogData[this.dialogId]?.dash) {
        this.dash = this.editor?.tempDialogData[this.dialogId].dash
      }
    },

    select(value) {
      this.value = value
    },
    selectAndConfirm(value) {
      this.value = value
      this.ok()
    },

    ok() {
      if (this.value) {
        if (this.editor?.tempDialogData[this.dialogId]?.callback?.ok) {
          this.editor?.tempDialogData[this.dialogId]?.callback?.ok(this.value);
        }
      }
      DDeiEditorUtil.closeDialog(this.editor, 'ddei-core-dialog-selectboderweight');
    },

    cancel() {
      DDeiEditorUtil.closeDialog(this.editor, 'ddei-core-dialog-selectboderweight');
    },
  }
};
</script>

<style lang="less" scoped>
/**以下是选择颜色的弹出框 */
.ddei-core-dialog-selectboderweight {

  border: 1px solid var(--panel-border);
   box-shadow: 0px 2px 24px 0px hsl(0deg 0% 0% /0.25);
  border-radius: 6px;
  display: none;
  overflow: hidden;
  width: 290px;
  position: absolute;
  background-color: var(--panel-background);
  height: 250px;
  z-index: 999;
  user-select: none;

  .content {
    width: 100%;
    max-height: 250px;
    overflow-y: auto;

    .group {
      color: var(--panel-title);
      width: 100%;

      .title {
        color: var(--panel-title);
        flex: 0 0 30px;
        width: 100%;
        display: flex;
        justify-content: start;
        align-items: center;
        padding-left: 10px;
        font-size: 15px;
        border: none;
        margin-top: 5px;
        margin-bottom: 5px;
      }

      .group_content {
        width: 100%;
        padding: 0px 15px;
        display: grid;
        gap: 5px;
        grid-template-columns: 1fr 1fr;
      }

      .item {
        height: 24px;
        margin: 0px 2px;
        margin: auto;
        background: transparent;
        display: flex;
        justify-content: center;
        align-items: center;
        cursor: pointer;
        border: 0.5px solid var(--panel-border);

        .div_input {
          width: calc(100% - 10px);
          height: 100%;

          >* {
            stroke: var(--panel-title);
            fill: var(--panel-background);
          }
        }
      }

      .item:hover {
        outline: 1px solid var(--dot);
      }

      .item-selected {
        outline: 1px solid var(--dot);
      }
    }
  }

  .tail {
    margin-top: 5px;
    flex: 0 0 55px;
    display: flex;
    align-items: center;
    text-align: center;
    padding: 0 15px;
    justify-content: end;
  }

  .button {
    flex: 0 0 70px;
    height: 32px;
    white-space: nowrap;
    background: #FFFFFF;
    border: 1px solid var(--panel-border);
    border-radius: 6px;
    font-size: 16px;
    font-family: "Microsoft YaHei";
    font-weight: 400;
    color: #040404;
    margin-left: 13px;
    display: flex;
    align-items: center;
    justify-content: center;

  }

  .button:hover {
    color: white;
    background: #176EFF;
    cursor: pointer;
  }

  .button-main {
    color: white;
    background: #176EFF;

  }
}
</style>
