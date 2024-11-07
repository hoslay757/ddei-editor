<template>
  <div :id="editor?.id + '_' + dialogId" class="ddei-core-dialog-changeratio" v-if="forceRefresh">
    <div class="content">
      <div class="title">{{ editor.i18n('ddei.scale') }}</div>
      <div class="group">
        <div class="group_content">
          <div v-for="data in dataSource" v-show="data?.value >= iMin && data?.value <=iMax"
            :class="{ 'item': true, 'item_selected': ratioInputValue / 100 == data.value }" @click="ok(data.value)">
            {{ data.text}}
          </div>
          <div v-if="input" class="item" style="flex:1;border-top: 1px solid var(--panel-border)">
            {{ editor.i18n('ddei.precent')}}：<input type="number" :min="iMin*100" :max="iMax*100"
              @keydown="ratioInputChange($event)" v-model="ratioInputValue" @blur="ratioInputChange()"
              autocomplete="off" name="ddei_bottom_input" />%
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">

import DialogBase from "./dialog"

export default {
  name: "ddei-core-dialog-changeratio",
  extends: null,
  mixins: [DialogBase],
  props: {
    //外部传入的插件扩展参数
    options: {
      type: Object,
      default: null
    },
    input: {
      type: Boolean,
      default: true
    },
    min: {
      type: Number,
      default: 0.1
    },
    max: {
      type: Number,
      default: 10
    },
    dataSource: {
      type: Array,
      default: [
        { text: "400%", value: 4 },
        { text: "200%", value: 2 },
        { text: "150%", value: 1.5 },
        { text: "125%", value: 1.25 },
        { text: "100%", value: 1 },
        { text: "75%", value: 0.75 },
        { text: "50%", value: 0.5 },
        { text: "25%", value: 0.25 },
      ]
    }
  },
  data() {
    return {
      dialogId: 'ddei-core-dialog-changeratio',
      ratioInputValue: 100,
      iMin:0.1,
      iMax:10,
    };
  },
  computed: {},
  components: {},
  watch: {},
  created() { },
  mounted() {
    this.refreshData()
  },
  methods: {
    refreshData(){
      if (this.editor?.tempDialogData && this.editor?.tempDialogData[this.dialogId]) {
        if (this.editor.tempDialogData[this.dialogId].min || this.editor.tempDialogData[this.dialogId].min == 0) {
          this.iMin = this.editor.tempDialogData[this.dialogId].min;
        } else if (this.min || this.min == 0){
          this.iMin = this.min
        }
        if (this.editor.tempDialogData[this.dialogId].max || this.editor.tempDialogData[this.dialogId].max == 0) {
          this.iMax = this.editor.tempDialogData[this.dialogId].max;
        } else if (this.max || this.max == 0){
          this.iMax = this.max
        }
        if (this.editor.tempDialogData[this.dialogId].ratio > this.iMax){
          this.ratioInputValue = this.iMax * 100
        } else if (this.editor.tempDialogData[this.dialogId].ratio < this.iMin) {
          this.ratioInputValue = this.iMin * 100
        }else{
          this.ratioInputValue = this.editor.tempDialogData[this.dialogId].ratio * 100
        }
        
      }
    },

    ok(data) {
      if (!data) {
        data = 1
      }
      this.ratioInputValue = data * 100
      if (this.editor?.tempDialogData[this.dialogId]?.callback?.ok) {
        this.editor?.tempDialogData[this.dialogId]?.callback?.ok(data);
      }

    },

    ratioInputChange(evt) {
      if (!evt || evt.keyCode == 13){
        if (this.ratioInputValue > this.max * 100) {
          this.ratioInputValue = this.max * 100;
        }else if (this.ratioInputValue < this.min * 100) {
          this.ratioInputValue = this.min * 100;
        }
        if (this.editor?.tempDialogData[this.dialogId]?.callback?.ok) {
          this.editor?.tempDialogData[this.dialogId]?.callback?.ok(this.ratioInputValue / 100);
        }
      }
    },

  }
};
</script>

<style lang="less" scoped>
/**以下是设置缩放比例的弹出框 */
.ddei-core-dialog-changeratio {

  border: 1px solid var(--panel-border);
  box-shadow: 0px 2px 24px 0px hsl(0deg 0% 0% /0.25);
  border-radius: 6px;
  display: none;
  overflow: hidden;
  width: 180px;
  position: absolute;
  background-color: var(--panel-background);
  z-index: 999;

  .content {
    width: 180px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    .title {
      color: var(--panel-title);
      font-weight: bold;
      flex: 0 0 30px;
      width: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
      font-size: 16px;
      border-bottom: 1px solid var(--panel-border);
    }


    .group {
      color: var(--panel-title);
      flex: 1 1 40px;
      width: 100%;

      .group_content {
        width: 100%;
        display: flex;
        flex-direction: column;

        .item {
          flex: 0 0 30px;
          padding: 0 10px;
          display: flex;
          justify-content: start;
          align-items: center;
          cursor: pointer;

          >input {
            border: none;
            outline: none;
            background: var(--panel-background);
            color: var(--panel-title);
          }
        }

        .item_selected {
          font-weight: bold;
        }

        .item:hover {
          background-color: var(--panel-hover);
        }
      }
    }
  }
}
</style>
