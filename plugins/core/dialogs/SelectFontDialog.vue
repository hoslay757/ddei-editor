<template>
  <div :id="editor?.id + '_' + dialogId" class="ddei-core-dialog-selectfont" v-if="forceRefresh">
    <div class="content">
      <div class="group">
        <div class="group_content">
          <div
            :class="{ 'item': true, 'item_selected': item.value == value, 'item_deleted': item.deleted, 'item_disabled': item.disabled, 'item_underline': item.underline, 'item_bold': item.bold }"
            v-for="item in dataSource" @dblclick="!item.disabled && ok(item.value)"
            @click="!item.disabled && select(item.value)" :title="item.desc">
            <div class="text" v-if="item.text" :style="{ 'font-family': item.fontFamily }">{{ item.text }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import {DDeiEditor} from "ddei-framework";
import {DDeiEditorUtil} from "ddei-framework";
import DialogBase from "./dialog"

export default {
  name: "ddei-core-dialog-selectfont",
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
      dialogId: 'ddei-core-dialog-selectfont',
      dataSource: null,
      value: null,
    };
  },
  computed: {},
  components: {},
  watch: {},
  created() {

  },
  mounted() {
    this.refreshData();
  },
  methods: {

    refreshData(){
      if (this.editor?.tempDialogData && this.editor?.tempDialogData[this.dialogId]?.dataSource) {
        this.dataSource = this.editor?.tempDialogData[this.dialogId].dataSource
      }
      if (this.editor?.tempDialogData && this.editor?.tempDialogData[this.dialogId]?.value) {
        this.value = this.editor?.tempDialogData[this.dialogId].value
      }
    },
    ok(data) {
      this.value = data
      if (this.editor?.tempDialogData[this.dialogId]?.callback?.ok) {
        this.editor?.tempDialogData[this.dialogId]?.callback?.ok(data);
      }
      DDeiEditorUtil.closeDialog(this.editor, "ddei-core-dialog-selectfont")
    },

    select(data) {
      this.value = data
      if (this.editor?.tempDialogData[this.dialogId]?.callback?.ok) {
        this.editor?.tempDialogData[this.dialogId]?.callback?.ok(data);
      }

    },
  }
};
</script>

<style lang="less" scoped>
/**以下是选择字体的弹出框 */
.ddei-core-dialog-selectfont {

  border: 1px solid var(--panel-border);
   box-shadow: 0px 2px 24px 0px hsl(0deg 0% 0% /0.25);
  border-radius: 6px;
  display: none;
  overflow: hidden;
  width: 170px;
  position: absolute;
  background-color: var(--panel-background);
  height: 310px;
  z-index: 999;
  user-select: none;

  .content {
    width: 100%;
    max-height: 310px;
    overflow-y: auto;

    .group {
      color: var(--panel-title);
      flex: 1 1 40px;
      width: 100%;

      .group_content {
        font-size: 14px;
        width: 100%;
        grid-template-columns: 1fr 1fr;
        grid-template-rows: 30px 30px 30px 30px 30px;
        display: grid;

        .item {
          outline: none;
          font-size: 15px;
          margin: auto;
          background: transparent;
          border-radius: 4px;
          width: 80px;
          height: 30px;
          display: flex;
          justify-content: start;
          align-items: center;
          cursor: pointer;

          .text {
            text-align: center;
            white-space: nowrap;
            display: table-cell;
            width: 100%;
            vertical-align: middle;
          }
        }

        .itembox_deleted {
          text-decoration: line-through;
        }

        .itembox_disabled {
          color: var(--panel-title-disabled);
          text-decoration: line-through;
        }

        .itembox_disabled:hover {
          cursor: not-allowed !important;
        }

        .itembox_underline {
          text-decoration: underline;
        }

        .item_selected {
          font-weight: bold;
          background-color: var(--panel-selected);

        }

        .item:hover {
          background-color: var(--panel-hover);
        }


      }
    }
  }
}
</style>
