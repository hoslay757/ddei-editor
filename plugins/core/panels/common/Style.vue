<template>
  <div class="ddei-core-panel-quickstyle">
    <div class="ddei-core-panel-quickstyle-item" style="grid-column: 1/14;grid-row:1/4;">
      <div class="ddei-core-panel-quickstyle-item-box-template">
        <div class="ddei-core-panel-quickstyle-item-box-template-item">
          Abc
        </div>
        <div class="ddei-core-panel-quickstyle-item-box-template-item">
          Abc
        </div>
        <div class="ddei-core-panel-quickstyle-item-box-template-item">
          Abc
        </div>
        <div class="ddei-core-panel-quickstyle-item-box-template-item">
          Abc
        </div>
        <div class="ddei-core-panel-quickstyle-item-box-template-item">
          Abc
        </div>
        <div class="ddei-core-panel-quickstyle-item-box-template-item">
          Abc
        </div>
        <div class="ddei-core-panel-quickstyle-item-box-template-item">
          Abc
        </div>
        <div class="ddei-core-panel-quickstyle-item-box-template-item">
          Abc
        </div>
        <div class="ddei-core-panel-quickstyle-item-box-template-icon">
         
        </div>
      </div>
    </div>
    <div class="ddei-core-panel-quickstyle-item" style="grid-column: 14/16;">
      <div class="ddei-core-panel-quickstyle-item-box">
        
      </div>
    </div>
    <div class="ddei-core-panel-quickstyle-item" style="grid-column: 14/16;">
      <div class="ddei-core-panel-quickstyle-item-box">
       
      </div>
    </div>
    <div class="ddei-core-panel-quickstyle-item" style="grid-column: 14/16">
      <div class="ddei-core-panel-quickstyle-item-box">
       
      </div>
    </div>
    <div class="ddei-core-panel-quickstyle-item" style="grid-column:1/16;">
      <div class="ddei-core-panel-quickstyle-item-text">
        {{ editor.i18n('ddei.style') }}
      </div>
    </div>
  </div>
</template>
<script lang="ts">


export default {
  name: "ddei-core-panel-quickstyle",
  extends: null,
  mixins: [],
  props: {
    //外部传入的插件扩展参数
    options: {
      type: Object,
      default: null
    }
  },
  data() {
    return {};
  },
  computed: {},
  watch: {},
  created() { },
  mounted() {

  },
};
</script>

<style lang="less" scoped>
.ddei-core-panel-quickstyle {
  width: 430px;
  height: 90px;
  border-right: 1px solid rgb(224, 224, 224);
  grid-template-rows: 20px 20px 20px 20px;
  grid-template-columns: 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr;
  display: grid;
  padding-right: 10px;


  &-item {
    margin: auto;


    &-box {
      width: 60px;
      height: 20px;
      color: black;
      text-align: center;
      border-radius: 4px;
      font-size: 14px;
      margin-top: 2px;
      img {
        margin-top: 3px;
        filter: brightness(45%) drop-shadow(0.2px 0px 0.2px #000);
        float: left;
        margin-left: 2px;
      }
    
      div {
          float: left;
          margin-left: 3px;
      }

      &-selected {
        width: 25px;
        height: 25px;
        text-align: center;
        background-color: rgb(228, 228, 232);
        border-radius: 4px;
        img {
            margin-top: 4px;
            filter: brightness(45%) drop-shadow(0.2px 0px 0.2px #000);
        }
      }

      &:hover {
        background-color: rgb(233, 233, 238);
        border-radius: 4px;
      }

      &-template {
        width: 350px;
        height: 55px;
        margin-top: 4px;
        border-radius: 4px;
        padding-left: 5px;
        background: white;
        display: flex;

        &-item {
          height: 34px;
          margin: auto;
          flex: 0 0 34px;
          color: black;
          border-radius: 4px;
          border: 1px solid black;
          text-align: center;
          padding-top: 3px;

          &:hover {
            outline: 0.5px solid #017fff;
            box-sizing: border-box;
            outline-offset: 3px;
          }
        }

        &-icon {
          width: 20px;
          grid-template-rows: 17px 17px 17px;
          grid-template-columns: 1fr;
          margin: auto;
          display: grid;
          margin-top: -2px;
          margin-right: 5px;

          img {
            margin-top: 5px;
            margin-left: 8px;
            filter: brightness(80%) drop-shadow(0.1px 0px 0.1px #000);
          }
        }
      }
    }

    &-text {
      text-align: center;
      font-family: "Microsoft YaHei";
      font-size: 12px;
      color: rgb(120, 120, 120);
      margin-top: 8px;
    }
  }
  
}
</style>
