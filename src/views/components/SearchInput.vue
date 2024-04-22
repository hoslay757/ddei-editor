<script lang="ts" setup>
import { ref, type Ref, } from 'vue'

const emit = defineEmits(['change'])

const queryText: Ref<string | null | undefined> = ref('')

function doQuery() {
  emit('change', queryText)
}
</script>

<template>
  <div class="ddei_home_bar_content_search">
    <svg class="icon" aria-hidden="true" @click="doQuery">
      <use xlink:href="#icon-a-ziyuan416"></use>
    </svg>
    <input v-model="queryText" name="ddei_home_bar_content_search_input" @keydown.enter="doQuery"
      class="ddei_home_bar_content_search_input" placeholder="名称/编码/备注" autocomplete="off">
  </div>
</template>

<style lang="less" scoped>
.ddei_home_bar_content {
  width: 100%;
  padding-top: 8px;
}

.ddei_home_bar_content_search {
  margin-left: 20px;
  width: 260px;
  height: 32px;
  background: #F2F4F7;
  border-radius: 2px;
  justify-content: center;
  align-items: center;
  display: flex;
  padding: 2px 10px;
}

.ddei_home_bar_content_search input {
  flex: 1;
  background: transparent;
  border: none;
  outline: none;
  height: 24px;
}

.ddei_home_bar_content_search input::-webkit-input-placeholder {
  color: #B8B8B8;
}

.ddei_home_bar_content_search svg {
  flex: 0 0 24px;
  margin-right: 6px;
  width: 24px;
  height: 24px;
  cursor: pointer;
  filter: brightness(300%);
}
</style>