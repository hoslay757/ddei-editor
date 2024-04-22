<template>
  <div :id="editor?.id+'_menu_dialog'" ref="menuDialog" class="ddei-editor-menu-dialog">
    <div v-show="isVisiable(menu)"
      :class="{ 'ddei-editor-menu-dialog-hr': menu.code == 'split', 'ddei-editor-menu-dialog-item': menu.code != 'split' }"
      v-for="menu in editor?.currentMenuData" @click="execMenuAction(menu, $event)">
      <div v-if="menu.code != 'split'" class="ddei-editor-menu-dialog-item-icon">
        <svg v-if="menu.icon" class="icon" aria-hidden="true">
          <use :xlink:href="menu.icon"></use>
        </svg>
      </div>
      <div v-if="menu.code != 'split'" class="ddei-editor-menu-dialog-item-content">
        {{ menu.label }}
      </div>
      <div v-if="menu.code != 'split'" class="ddei-editor-menu-dialog-item-desc">
        {{ menu.desc }}
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import {DDeiEditor} from "ddei-framework1";
import {DDeiEnumBusCommandType} from "ddei-framework1";
import {DDeiEnumOperateState} from "ddei-framework1";
export default {
  name: "DDei-Editor-Menu-Dialog",
  extends: null,
  mixins: [],
  props: {},
  data() {
    return {
      //当前编辑器
      editor: null,
    };
  },
  computed: {},
  components: {},
  watch: {},
  created() {
    //获取编辑器
    this.editor = DDeiEditor.ACTIVE_INSTANCE;
  },
  mounted() {

  },
  methods: {
    /**
     * 执行菜单的Action
     */
    execMenuAction(menu, evt: Event) {
      let stage = this.editor?.ddInstance?.stage;
      let menuAction = this.editor.menus[menu.name];
      if (menuAction && stage) {
        let menuShape = stage.render?.currentMenuShape;
        menuAction.action(menuShape, evt);
      }
      //关闭dialog
      this.$refs.menuDialog.style.display = "none";
      //刷新
      stage.render.operateState = DDeiEnumOperateState.NONE;
      this.editor.bus.push(DDeiEnumBusCommandType.RefreshShape, null, evt);
      this.editor.bus.executeAll();
    },

    /**
     * 判断菜单是否显示
     */
    isVisiable(menu) {
      try {
        let stage = this.editor?.ddInstance?.stage;
        let menuAction = this.editor.menus[menu.name];
        if (menuAction && stage) {
          let menuShape = stage.render?.currentMenuShape;
          return menuAction.isVisiable(menuShape);
        }
      } catch (e) {
        console.error(e);
      }
      return false;
    },
  },
};
</script>

<style lang="less" scoped>
/**以下为菜单的样式 */
.ddei-editor-menu-dialog {
  width: 200px;
  background-color: var(--panel-background);
  font-size: 13px;
  color: var(--panel-title);
  border: 0.3px solid var(--panel-border);
  display: none;
  position: absolute;
  font-weight: bolder;
  z-index: 999;
  border-radius: 4px;
  box-shadow: -3px 3px 3px hsl(0deg 0% 0% /0.25);

  &-item {
    height: 34px;
    width: 100%;
    display: flex;
    &:hover {
      background-color: var(--panel-hover);
      cursor: pointer;
    }
    &-icon {
      flex: 0 0 34px;
      display: flex;
      justify-content: center;
      align-items: center;
      .icon {
        width: 22px;
        height: 22px;
        margin: 0px 3px 0px 3px;
      }
    }

    &-content {
      flex: 1;
      display: flex;
      justify-content: start;
      align-items: center;
    }

    &-desc {
      flex: 0 0 34px;
    }

    &-hr {
      border: 0.5px solid var(--panel-border);
      width: 93%;
      margin: 1px auto;
    }
  }
}
</style>
