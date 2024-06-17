<template>
  <div :id="editor?.id + '_' + dialogId" class="ddei-ext-dialog-quickchoosecontrol" v-if="forceRefresh">
    <div v-for="group in groups" v-show="group.display == true" class="ddei-ext-dialog-quickchoosecontrol-group">
      <div class="ddei-ext-dialog-quickchoosecontrol-group-itempanel" v-if="group.expand == true">
        <div class="ddei-ext-dialog-quickchoosecontrol-group-itempanel-item" :title="control.desc"
           v-for="control in group.controls">
          <img class="icon" :src="editor?.icons[control.id]" />
          <div class="text">{{ control.name }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import {DDeiEditor} from "ddei-framework";
import { DDeiEditorUtil } from "ddei-framework";
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
    //定义分组
    customGroups: {
      type: Array,
      default: null
    },
  },
  data() {
    return {
      dialogId: 'ddei-ext-dialog-quickchoosecontrol',
      //分组数据
      groups: [],
    };
  },
  computed: {},
  components: {  },
  watch: {},
  created() { },
  mounted() {
    this.refreshData();
  },
  methods: {
    refreshData(){
      //加载工具栏
      DDeiEditorUtil.readRecentlyToolGroups()
      let hisGroups = DDeiEditorUtil.recentlyToolGroups;
      if (hisGroups?.length > 0) {
        let groups = []
        hisGroups.forEach(hg => {
          let group = null;
          for (let i = 0; i < this.editor.groups.length; i++) {
            if (this.editor.groups[i].id == hg.id) {
              group = this.editor.groups[i]
              break;
            }
          }
          if (group) {
            group.expand = hg.expand
            groups.push(group)
          }
        })
        this.groups = groups;
      } else {
        this.groups = clone(this.editor.groups)
        DDeiEditorUtil.whiteRecentlyToolGroups(this.groups)
      }
      if (this.customGroups) {
        let newGroups = []
        this.customGroups?.forEach(cg => {
          for (let i = 0; i < this.groups.length; i++) {
            if (this.groups[i].id == cg) {
              newGroups.push(this.groups[i])
              break;
            }
          }

        });
        this.groups = newGroups
      }
    }
  }
};
</script>

<style lang="less" scoped>
.ddei-ext-dialog-quickchoosecontrol {
  border: 1px solid var(--panel-border); 
  box-shadow: 0px 2px 24px 0px hsl(0deg 0% 0% /0.25); 
  border-radius: 6px;
  display: none;
  overflow: auto;
  position: absolute;
  background-color: var(--panel-background);
  height: 240px;
  width:240px;
  z-index: 1999;
  user-select: none;
  color: var(--panel-title);

  &-group{
    &-itempanel {
        display: flex;
        flex-flow: row wrap;
        background: var(--toolbox-background);
        padding: 15px 15px 15px 15px;
    
        &-item {
          flex: 0 0 50px !important;
          height: 45px;
          margin: 5px 0px;
          display: flex;
          overflow: hidden;
          justify-content: center;
          align-items: center;
          flex-flow: column;
    
          &:hover {
            background: var(--toolbox-control-hover);
            outline: var(--toolbox-control-hover-outline);
            cursor: all-scroll;
          }
    
          .text {
            white-space: nowrap;
            text-align: center;
            font-size: 0.7vw;
            font-weight: 400;
            color: var(--toolbox-control-title);
          }
    
          .icon {
            width: 90%;
            height: 90%;
            object-fit: contain;
          }
        }
      }
  }
}
</style>
