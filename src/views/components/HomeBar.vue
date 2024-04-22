<template>
  <div class="ddei_home_bar_content">
    <div class="ddei_home_bar_content_search">
      <input v-model="queryText" @keydown.enter="doQuery" autocomplete="off" name="ddei_home_bar_content_search_input"
        class="ddei_home_bar_content_search_input" placeholder="名称/编码/备注">

    </div>
  </div>
</template>

<script >
export default {
  name: 'DDei-Home-Bar',
  props: {

  },
  data () {
    return {
      queryText: ""
    }
  },
  created () {

  },
  mounted () {

  },
  methods: {
    doQuery () {
      this.$parent.$refs["fileList"].queryText = this.queryText;
      this.$parent.$refs["fileList"].listFile(1)
    }
  },

}
</script>

<style scoped>
.ddei_home_bar_content {
  width: 100%;
  padding-top: 8px;
}

.ddei_home_bar_content_search {
  width: 200px;
  height: 32px;
  margin-right: 27px;
  float: right;
  justify-content: center;
  align-items: center;
  display: flex;
  background: grey;
  border-color: black;
  border-radius: 2px;
  padding: 2px;
}

.ddei_home_bar_content_search input {
  flex: 1;
  color: #fff;
  background: transparent;
  border: none;
  outline: none;
}

.ddei_home_bar_content_search input::-webkit-input-placeholder {
  color: rgb(210, 210, 210);
}

.ddei_home_bar_content_search img {
  height: 18px;
  flex: 0 0 18px;
  margin: 0px 2px;
  filter: brightness(200%);
}
</style>