<template>
  <div class="ddei-core-panel-fontandtext">
    <div class="header"></div>
    <div class="content">
      <div class="buttons">
        <div class="b1">
          <component :is="editor?.panels['ddei-core-btn-fontfamily']"></component>
        </div>
        <div class="b2">
          <component :is="editor?.panels['ddei-core-btn-fontsize']"></component>
        </div>
        <div>
          <component :is="editor?.panels['ddei-core-btn-addfontsize']" :addValue="1" attrCode="font.size"
            img="icon-a-ziyuan456" extcls="magtop-2"></component>
        </div>
        <div>
          <component :is="editor?.panels['ddei-core-btn-addfontsize']" :addValue="-1" attrCode="font.size"
            img="icon-a-ziyuan455" extcls="magtop-1"></component>
        </div>

        <div>
          <component :is="editor?.panels['ddei-core-btn-editbox']" selectedValue="1" :supportQuickEdit="false"
            attrCode="textStyle.align" img="icon-a-ziyuan440" extcls="magtop-1" :unSelectValue="2"></component>
        </div>
        <div>
          <component :is="editor?.panels['ddei-core-btn-editbox']" selectedValue="2" :supportQuickEdit="false"
            attrCode="textStyle.align" img="icon-a-ziyuan437" extcls="magtop-1" :unSelectValue="2"></component>
        </div>
        <div>
          <component :is="editor?.panels['ddei-core-btn-editbox']" selectedValue="3" :supportQuickEdit="false"
            attrCode="textStyle.align" img="icon-a-ziyuan439" extcls="magtop-1" :unSelectValue="2"></component>
        </div>



      </div>
      <div class="buttons">
        <div class="mg14">
          <component :is="editor?.panels['ddei-core-btn-editbox']" selectedValue="1" attrCode="textStyle.bold"
            img="icon-a-ziyuan461"></component>
        </div>
        <div class="mg16">
          <component :is="editor?.panels['ddei-core-btn-editbox']" selectedValue="1" attrCode="textStyle.italic"
            img="icon-a-ziyuan459"></component>
        </div>
        <div class="mg16">
          <component :is="editor?.panels['ddei-core-btn-editbox']" selectedValue="1" attrCode="textStyle.underline"
            img="icon-icon-text-underline" extcls="ext-underline"></component>
        </div>
        <div class="mg165">
          <component :is="editor?.panels['ddei-core-btn-editbox']" electedValue="1" attrCode="textStyle.deleteline"
            img="icon-a-ziyuan457">
          </component>

        </div>

        <div class="mg17">
          <component :is="editor?.panels['ddei-core-btn-editbox']" selectedValue="1" :onlyQuickEdit="true"
            attrCode="textStyle.subtype" img="icon-a-ziyuan394" extcls="magtop-1">
          </component>

        </div>
        <div class="mg17">
          <component :is="editor?.panels['ddei-core-btn-editbox']" selectedValue="2" :onlyQuickEdit="true"
            attrCode="textStyle.subtype" img="icon-a-ziyuan393" extcls="magtop-1">
          </component>

        </div>
        <div class="b4">
          <component :is="editor?.panels['ddei-core-btn-editbox']" selectedValue="3" :onlyQuickEdit="true"
            attrCode="textStyle.subtype" img="icon-a-ziyuan392" extcls="magtop-1">
          </component>
        </div>
        <div class="b5">
          <component :is="editor?.panels['ddei-core-btn-color']" attrCode="textStyle.bgcolor"
            img="icon-a-ziyuan452">
          </component>
        </div>
        <div class="b6">
          <component :is="editor?.panels['ddei-core-btn-color']" attrCode="font.color" img="icon-a-ziyuan463">
          </component>
        </div>


        <div>
          <component :is="editor?.panels['ddei-core-btn-editbox']" selectedValue="1" :supportQuickEdit="false"
            attrCode="textStyle.valign" img="icon-a-ziyuan440" extcls="rotate-90" :unSelectValue="2">
          </component>

        </div>
        <div>
          <component :is="editor?.panels['ddei-core-btn-editbox']" selectedValue="2" :supportQuickEdit="false"
            attrCode="textStyle.valign" img="icon-a-ziyuan437" extcls="rotate-90" :unSelectValue="2">
          </component>

        </div>
        <div>
          <component :is="editor?.panels['ddei-core-btn-editbox']" selectedValue="3" :supportQuickEdit="false"
            attrCode="textStyle.valign" img="icon-a-ziyuan439" extcls="rotate-90" :unSelectValue="2">
          </component>

        </div>

      </div>
    </div>
    <div class="tail">
      文本编辑
    </div>
  </div>
</template>
<script lang="ts">
import {DDeiEditor} from "ddei-framework";

export default {
  name: "ddei-core-panel-fontandtext",
  extends: null,
  mixins: [],
  props: {
    //外部传入的插件扩展参数
    options: {
      type: Object,
      default: null
    }
    , editor: {
      type: DDeiEditor,
      default: null,
    }
  },
  data() {
  },
  computed: {},
  components: {
  },
  watch: {},
  created() { },
  mounted() {
  },
};
</script>

<style lang="less" scoped>
.ddei-core-panel-fontandtext {
  height: 103px;
  display: grid;
  grid-template-rows: 20px 57px 26px;
  grid-template-columns: 1fr;
  text-align: center;

  .content {
    display: flex;
    flex-direction: column;
    padding-left: 16px;
    border-right: 1px solid var(--panel-border);//darken(var(--panel-header), 13%);

    .buttons {
      flex: 1;

      >div {
        float: left;
        margin-right: 10px;

      }



      .mg16 {
        margin-right: 3px;
      }

      .mg165 {
        margin-right: 5px;
      }

      .mg14 {
        margin-right: 3px;
        margin-left: -3px;
      }

      .mg17 {
        margin-right: 8px;
      }

      .b1 {
        width: 152px;
        margin-right: 0px;
      }

      .b2 {
        width: 64px;
      }

      .b4 {
        margin-right: 33px;
      }

      .b5 {
        margin-top: 1px;
        margin-right: 17px;
      }

      .b6 {
        margin-top: 1px;
        margin-right: 15px;
      }
    }
  }

  .tail {
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 14px;
    font-weight: 400;
    color: var(--panel-title); // fade(var(--panel-title), 40%);
    border-right: 1px solid var(--panel-border);//darken(var(--panel-header), 13%);
  }
}
</style>
