<template>
  <div :id="editor?.id + '_' + dialogId" class="ddei-core-dialog-choosecontrolgroup" v-if="forceRefresh">
    <div class="content">
      <div class="title">选择需要的图形</div>
      <div class="group">
        <div class="item" @mousemove="expandSubMenu('basic', $event)">
          <svg class="icon groupicon" aria-hidden="true">
            <use xlink:href="#icon-a-ziyuan503"></use>
          </svg>
          <div class="groupname">基本</div>
          <svg class="icon expand" aria-hidden="true">
            <use xlink:href="#icon-a-ziyuan465"></use>
          </svg>
        </div>
        <div class="item" @mousemove="expandSubMenu('uml', $event)">
          <svg class="icon groupicon" aria-hidden="true">
            <use xlink:href="#icon-a-ziyuan384"></use>
          </svg>
          <div class="groupname">UML</div>
          <svg class="icon expand" aria-hidden="true">
            <use xlink:href="#icon-a-ziyuan465"></use>
          </svg>
        </div>
      </div>
    </div>
    <div class="subcontent" v-show="subGroups?.length > 0" :id="editor?.id + '_ddei-core-dialog-choosecontrolgroup_subcontent'">
      <div class="group">
        <div class="item" v-for="group in subGroups" @click="chooseGroup(group.id)">
          <input type="checkbox" v-model="group.selected" style="pointer-events: none;" :name="group.id"
            autocomplete="off">
          <div class="groupname">{{ group.name }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import {DDeiEditor} from "ddei-framework";
import {DDeiUtil} from "ddei-framework";
import {DDeiEditorUtil} from "ddei-framework";
import DialogBase from "./dialog"

export default {
  name: "ddei-core-dialog-choosecontrolgroup",
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
      dialogId: 'ddei-core-dialog-choosecontrolgroup',
      subGroups: null,
      menuId: null,
      selectGroups: []
    };
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
      this.menuId = null
      if (this.editor?.tempDialogData && this.editor?.tempDialogData[this.dialogId]?.selectGroups) {
        this.selectGroups = this.editor?.tempDialogData[this.dialogId].selectGroups
      }
    },

    expandSubMenu(menuid, evt) {
      if (this.menuId != menuid) {
        let groups = []
        this.editor.groups.forEach(group => {
          if (group.subject == menuid) {
            let ginfo = { id: group.id, name: group.name }

            if (this.selectGroups.indexOf(group.id) != -1) {
              ginfo.selected = true;
            } else {
              ginfo.selected = false;
            }
            groups.push(ginfo)
          }
        })
        this.subGroups = groups
        this.menuId = menuid
        let dialogEle = document.getElementById(this.editor.id+"_ddei-core-dialog-choosecontrolgroup");
        let subContentEle = document.getElementById(this.editor.id + "_ddei-core-dialog-choosecontrolgroup_subcontent");
        subContentEle.style.display = "block";
        let srcElement = evt.currentTarget;
        let dialogDomPos = DDeiUtil.getDomAbsPosition(dialogEle)
        let domPos = DDeiUtil.getDomAbsPosition(srcElement)
        subContentEle.style.left = (domPos.left - dialogDomPos.left + srcElement.clientWidth) + "px";
        subContentEle.style.top = (domPos.top - dialogDomPos.top) + "px";
      }
    },

    chooseGroup(groupid) {
      let ginfo = null
      for (let i = 0; i < this.subGroups.length; i++) {
        if (this.subGroups[i].id == groupid) {
          ginfo = this.subGroups[i]
          break;
        }
      }
      if (ginfo) {
        ginfo.selected = !ginfo.selected


        if (ginfo.selected) {
          if (this.selectGroups.indexOf(ginfo.id) == -1) {
            this.selectGroups.push(ginfo.id)
            if (this.editor?.tempDialogData[this.dialogId]?.callback?.select) {
              this.editor?.tempDialogData[this.dialogId]?.callback?.select(ginfo.id, true);
            }
          }
        } else {
          if (this.selectGroups.indexOf(ginfo.id) != -1) {
            this.selectGroups.splice(this.selectGroups.indexOf(ginfo.id), 1)
            if (this.editor?.tempDialogData[this.dialogId]?.callback?.select) {
              this.editor?.tempDialogData[this.dialogId]?.callback?.select(ginfo.id, false);
            }
          }
        }

      }
    }
  }
};
</script>

<style lang="less" scoped>
.ddei-core-dialog-choosecontrolgroup {
  display: none;
  overflow: hidden;
  width: 420px;
  position: absolute;
  height: 400px;
  z-index: 999;

  .content {
    width: 210px;
    border: 1px solid var(--panel-border);
    background-color: var(--panel-background);
    box-shadow: 0px 2px 24px 0px hsl(0deg 0% 0% /0.25);
    border-radius: 6px;
    height: 400px;
    overflow-y: auto;
    overflow-x: hidden;
    user-select: none;

    .title {
      color: var(--panel-title);
      height: 36px;
      width: 100%;
      display: flex;
      justify-content: start;
      align-items: center;
      font-size: 16px;
      padding-left: 10px;
      border-bottom: 1px solid var(--panel-border);
    }

    .group {
      color: var(--panel-title);
      flex: 1;
      width: 100%;
      display: flex;
      flex-direction: column;
      justify-content: start;
      align-items: center;

      .item {
        flex: 0 0 36px;
        width: 210px;
        padding: 0 20px;
        display: flex;
        align-items: center;
        justify-content: center;

        .groupicon {
          width: 34px;
          font-size: 26px;
        }

        .groupname {
          white-space: nowrap;
          flex: 0 1 160px;
          margin: 0 10px;
          font-size: 16px;
        }

        .expand {
          font-size: 22px;
        }
      }

      .item:hover {
        background-color: var(--panel-hover);
      }
    }
  }

  .subcontent {
    display: none;
    position: absolute;
    width: 160px;
    border: 1px solid var(--panel-border);
    background-color: var(--panel-background);
    box-shadow: 0px 2px 24px 0px hsl(0deg 0% 0% /0.25);
    border-radius: 6px;
    max-height: 400px;
    overflow-y: auto;
    overflow-x: hidden;
    user-select: none;

    .title {
      color: var(--panel-title);
      height: 36px;
      width: 100%;
      display: flex;
      justify-content: start;
      align-items: center;
      font-size: 16px;
      padding-left: 10px;
    }

    .group {
      color: var(--panel-title);
      flex: 1;
      width: 100%;
      display: flex;
      flex-direction: column;
      justify-content: start;
      align-items: center;

      .item {
        flex: 0 0 36px;
        width: 160px;
        padding: 0 10px;
        display: flex;
        align-items: center;
        justify-content: center;

        >input {
          flex: 0 0 20px;
          width: 14px;
          height: 14px;
        }

        .groupname {
          white-space: nowrap;
          flex: 0 1 120px;
          margin-left: 10px;
          font-size: 16px;

        }


      }

      .item:hover {
        background-color: var(--panel-hover);
      }
    }
  }
}
</style>
