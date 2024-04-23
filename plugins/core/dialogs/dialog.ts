import {DDeiEditor} from "ddei-framework";
const DialogBase = {
  data: function () {
    return {
      editor:null,
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
    //获取编辑器
    this.editor = DDeiEditor.ACTIVE_INSTANCE;
    this.editor.dialogs[this.dialogId].viewer = this
  }
};

export default DialogBase