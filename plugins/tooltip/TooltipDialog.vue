<template>
  <div :id="editor?.id + '_' + dialogId" v-if="forceRefresh" class='ddei-ext-dialog-tooltip fade-in'>
    <div class="ddei-ext-dialog-tooltip-row">
      <div class="ddei-ext-dialog-tooltip-row-title" v-if="model?.id">
        ID
      </div>
      <div class="ddei-ext-dialog-tooltip-row-data" v-if="model?.id">
        {{ model?.id }}
      </div>
    </div>
    <div class="ddei-ext-dialog-tooltip-row" v-if="model?.code">
      <div class="ddei-ext-dialog-tooltip-row-title">
        CODE
      </div>
      <div class="ddei-ext-dialog-tooltip-row-data">
        {{ model?.code }}
      </div>
    </div>
    <div class="ddei-ext-dialog-tooltip-row" v-if="model?.text">
      <div class="ddei-ext-dialog-tooltip-row-title">
        文本
      </div>
      <div class="ddei-ext-dialog-tooltip-row-data">
        {{ model?.text }}
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { DDeiEditor } from "ddei-framework";

export default {
  name: 'ddei-ext-dialog-tooltip',
  extends: null,
  props: {
    //外部传入的插件扩展参数
    options: {
      type: Object,
      default: null
    },
    editor: {
      type: DDeiEditor,
      default: null
    }
  },
  data() {
    return {
      dialogId: 'ddei-ext-dialog-tooltip',
      //当前控件
      model: null,
      forceRefresh: false,
    };
  },
  computed: {},
  components: {},
  watch: {

  },
  created() {

  },
  mounted() {
    this.editor.dialogs[this.dialogId].viewer = this
    this.refreshData()
  },
  methods: {

    forceRefreshView: function () {
      this.forceRefresh = false
      this.$nextTick(() => {
        this.forceRefresh = true;
        if (this.refreshData) {
          this.refreshData();
        }
      });
    },
    refreshData(){
      if (this.editor.tempPopData && this.editor.tempPopData['ddei-ext-dialog-tooltip']){
        this.model = this.editor.tempPopData['ddei-ext-dialog-tooltip'].model
      }
    }
  }
};
</script>

<style lang="less" scoped>
/**以下是快捷样式编辑的弹出框 */
.ddei-ext-dialog-tooltip {

  border: 1px solid var(--panel-border);//darken(var(--panel-header), 13%);
  box-shadow: 0px 2px 24px 0px hsl(0deg 0% 0% /0.25);//darken(var(--panel-header), 10%);
  border-radius: 6px;
  display: none;
  overflow: hidden;
  position: absolute;
  background-color: var(--panel-background);
  z-index: 2999;
  user-select: none;
  color: var(--panel-title);
  &-row{
    width:160px;
    min-height:30px;
    display: flex;
    align-items: center;
    justify-content: center;
    &-title {
      flex: 1;
      text-align: center;
    }

    &-data {
      flex: 1;
      text-align: center;
    }
  }
}


@keyframes fadeIn {
  from {
    opacity: 0;
  }

  to {
    opacity: 1;
  }
}

.fade-in {
  animation: fadeIn 0.5s ease-in-out forwards;
}

</style>
