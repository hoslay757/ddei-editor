import {DDeiEditor} from "ddei-framework";
const DialogBase = {
  props:{
    editor: {
      type: DDeiEditor,
      default: null
    }
  },
  data: function () {
    return {
      forceRefresh: false,
    }
  },
  methods: {
    forceRefreshView: function () {
      this.forceRefresh = false
      this.$nextTick(() => {
        this.forceRefresh = true;
        if (this.refreshData){
          this.refreshData();
        }
      });
    }
  },
  mounted () {
    this.editor.dialogs[this.dialogId].viewer = this
  }
};

export default DialogBase