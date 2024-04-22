<template>
  <div class="ddei_home_dir_tree_wrapper">
    <!-- 固定目录 -->
    <div class="ddei_home_dir_tree">
      <div v-for="folder in menus" class="ddei_home_dir_tree_node" :class="{ 'is-active': folder.id === curMenu?.id }"
        @click="setCurrentMenu(folder)">
        <svg v-if="folder.icon" class="icon ddei_home_dir_tree_node_icon" aria-hidden="true">
          <use :xlink:href="folder.icon"></use>
        </svg>
        <div class="ddei_home_dir_tree_node_title">{{ folder.name }}</div>
      </div>
    </div>

    <!-- 知识库目录 -->
    <ATree v-model:selectedKeys="menuTreeSelectedKeys" v-model:expandedKeys="menuTreeExpandedKeys"
      class="ddei_home_dir_tree" block-node :tree-data="folderTreeData" :field-names="treeFieldNames"
      @select="setCurrentFolder">
      <template #title="folder">
        <div class="ddei_home_dir_tree_node">
          <svg v-if="folder.icon" class="icon ddei_home_dir_tree_node_icon" aria-hidden="true">
            <use :xlink:href="folder.icon"></use>
          </svg>
          <div v-else class="ddei_home_dir_tree_node_icon__point"></div>
          <div class="ddei_home_dir_tree_node_title">{{ folder.name }}</div>
          <div class="ddei_home_dir_tree_node_buttons">
            <svg aria-hidden="true" class="icon ddei_home_dir_tree_node_button" title="新建子目录"
              @click.stop="showFolderDialog(folder, 1)">
              <use xlink:href="#icon-a-ziyuan374"></use>
            </svg>
            <svg v-if="folder.id !== '0'" aria-hidden="true" class="icon ddei_home_dir_tree_node_button" title="修改"
              @click.stop="showFolderDialog(folder, 2)">
              <use xlink:href="#icon-a-ziyuan484"></use>
            </svg>
            <svg v-if="folder.id !== '0'" aria-hidden="true" class="icon ddei_home_dir_tree_node_button" title="删除"
              @click.stop="deleteFolder(folder)">
              <use xlink:href="#icon-a-ziyuan401"></use>
            </svg>

          </div>
        </div>
      </template>
    </ATree>
  </div>

  <AModal v-model:open="folderDialog.open" :title="(folderDialog.mod == 1 ? '创建' : '修改') + '目录'"
    :ok-button-props="{ loading: folderDialog.saving }" width="400px" @ok="sumbitFolder()">
    <AForm ref="form" :model="folderDialog.formData" :rules="folderDialog.formRules" autocomplete="off" class="m-t-20">
      <AFormItem name="name">
        <AInput v-model:value="folderDialog.formData.name" placeholder="目录名" clearable></AInput>
      </AFormItem>
      <AFormItem name="parent_id">
        <ATreeSelect v-model:value="folderDialog.formData.parent_id" show-search style="width: 100%"
          :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }" placeholder="父目录" allow-clear tree-default-expand-all
          :tree-data="folderSelectTreeData" :field-names="treeFieldNames" tree-node-filter-prop="label"></ATreeSelect>
      </AFormItem>
    </AForm>
  </AModal>
</template>

<script type="ts">
import { createVNode } from 'vue'
import { loadfolder, createfolder, removefolder, renamefolder } from "@/lib/api/folder"
import { debounce, cloneDeep } from 'lodash'
import { message, Modal } from 'ant-design-vue'
// 引入图标
// import IconFolderBlack from '@/components/editor/icons/icon-folder-black.png'
// import IconTrash from '@/components/editor/icons/icon-trash.png'
// import IconDocumentBlack from '@/components/editor/icons/icon-document-black.png'

export default {
  name: 'DDei-Home-Dir-Tree',
  expose: ['createFolder', 'getCurrentFolder', 'setCurrentFolder', 'getFolderTreeData'],
  props: {

  },
  data () {
    // let rootFolder = { name: "知识库", id: "0", icon: IconDocumentBlack, isShow: true, allowDelete: false, allowModify: false }
    let rootFolder = { name: "我的文件", id: "0", icon: '#icon-a-ziyuan489', isShow: true, allowDelete: false, allowModify: false }
    return {
      menus: [
        // {
        //   id: 'Main',
        //   name: '主页',
        //   icon: IconHomeBlack,
        //   visible: true
        // },
        {
          id: 'All',
          name: '全部',
          icon: '#icon-a-ziyuan384',
          visible: true
        },
        // {
        //   id: 'MyFile',
        //   name: '我的文件',
        //   icon: IconFolderBlack,
        //   visible: true
        // },
        // todo 需要回收站图标
        // {
        //   id: 'RecycleBin',
        //   name: '回收站',
        //   icon: IconTrash,
        //   visible: true
        // }
      ],
      rootFolder: rootFolder,
      folders: [rootFolder],
      folderTreeData: [rootFolder],
      menuTreeSelectedKeys: [],
      menuTreeExpandedKeys: ['0'],
      treeFieldNames: { children: 'children', key: 'id', title: 'name', label: 'name', value: 'id' },
      curMenu: undefined,
      curFolder: undefined,
      folderDialogShow: false,
      delFolderDialogShow: false,
      folderDialog: {
        open: false,
        saving: false,
        mod: 1,
        formData: {},
        formRules: {
          name: [
            {
              validator: debounce(this.checkDirName)
            }
          ]
        }
      },
      cf: {}
    }
  },
  computed: {
    folderSelectTreeData () {
      // 不允许选择本目录和下级目录作为父目录
      let curFolderId = this.folderDialog.formData.id
      if (curFolderId) {
        let tree = cloneDeep(this.folderTreeData)
        let queue = [].concat(tree)
        while (queue.length) {
          let item = queue.shift()
          if (item.children) {
            item.children = item.children.filter(item => item.id !== curFolderId)
            queue = queue.concat(item.children)
          }
        }
        return tree
      }
      return this.folderTreeData
    }
  },
  created () { },
  mounted () {

  },
  methods: {
    getCurrentFolder () {
      return this.curFolder
    },

    /**
     * 设置当前目录
     */
    setCurrentFolder ([folderId] = []) {
      this.menuTreeSelectedKeys = [folderId]
      this.curFolder = this.folders.find(item => item.id === folderId)
      this.curMenu = undefined
      this.$parent.forceRefreshFileList()
    },

    setCurrentMenu (menu) {
      this.menuTreeSelectedKeys = []
      this.curFolder = undefined
      this.curMenu = menu
      this.$parent.forceRefreshFileList()
    },

    getFolderTreeData () {
      return this.folderTreeData
    },

    /**
     * 弹出新文件夹的弹出框
     */
    showFolderDialog (folder, mod) {
      this.folderDialog.open = true
      this.folderDialog.mod = mod
      let formData
      if (mod == 1) {
        formData = {
          // 要么是根目录，要不是下级目录
          parent_id: folder?.id || '0'
        }
      } else if (mod == 2) {
        formData = {
          parent_id: folder.parent_id,
          id: folder.id,
          name: folder.name
        }
      }
      this.curFolder = folder
      this.folderDialog.formData = formData
    },

    deleteFolder (folder) {
      if (folder.children?.length) {
        // 不允许删除有下级目录的目录
        message.warning('当前目录存在下级目录，不能直接删除！')
        return
      }
      Modal.confirm({
        title: '是否删除目录',
        content: createVNode('div', { style: 'color:red;' }, folder.name),
        okType: 'danger',
        onOk: async () => {
          let folderData = await removefolder({ id: folder.id })
          if (folderData.status == 200) {
            //获取成功
            if (folderData.data?.code == 0) {
              message.success('删除成功')
              this.loadFolder()
            }
          }
        }
      })
    },

    checkDirName (rule, value, cb) {
      if (!value) {
        cb('请输入目录名')
        return
      }
      let uPattern = /^[\u4e00-\u9fa5a-zA-Z0-9_-]{1,15}$/
      if (!uPattern.test(value)) {
        cb("目录名为1至15位中文、字母、数字下划线组合")
        return
      }
      cb()
    },

    /**
     * 创建/更新目录
     */
    sumbitFolder () {
      this.$refs.form.validate().then(async () => {
        let folderData = null
        this.folderDialog.saving = true
        if (this.folderDialog.mod == 1) {
          folderData = await createfolder(this.folderDialog.formData)
        } else if (this.folderDialog.mod == 2) {
          folderData = await renamefolder(this.folderDialog.formData)
        }
        if (folderData?.status == 200) {
          //获取成功
          if (folderData.data?.code == 0) {
            message.success('保存成功')
            this.folderDialog.open = false
            // 加载数据，设置默认展开
            this.loadFolder()
          }
        }
        this.folderDialog.saving = false
      }).catch(e => {
        console.error(e)
        this.folderDialog.saving = false
      })
    },

    /**
     * 加载目录
     */
    async loadFolder () {
      let folderData = await loadfolder()
      if (folderData.status == 200) {
        //获取成功
        if (folderData.data?.code == 0) {
          let folders = folderData.data.data || []
          this.folders = [this.rootFolder].concat(folders)
          folders = this.folderToTree(folders)
          this.folders[0].children = folders
          this.folderTreeData = [this.folders[0]]
        }
      }

    },

    /**
     * 将folderList转换为树结构，并返回
     */
    folderToTree (folders) {
      // 生成map
      let tree = []
      let cache = {}
      folders.forEach(item => {
        cache[item.id] = item
      })
      folders.forEach(folder => {
        folder.parent_id = folder.parent_id || '0'
        let parent = cache[folder.parent_id]
        if (parent) {
          parent.children = parent.children || []
          parent.children.push(folder)
        } else {
          tree.push(folder)
        }
      })
      return tree
    },
    createFolder () {
      this.showFolderDialog(this.curFolder || this.folders[0], 1)
    }
  },
  mounted () {
    //加载用户根目录
    this.loadFolder()
  }
}
</script>

<style lang='less' scoped>
.ddei_home_dir_tree_wrapper {
  height: calc(100vh - 55px);
  overflow-x: hidden;
  overflow-y: auto;
  background-color: #F9FAFB;
  border: 1px solid #E0E3E9;
  border-top: 0px;
  border-radius: 0 0 4px 4px;
  padding: 20px 10px;
}

.ddei_home_dir_tree {
  flex: 1;
  font-size: 14px;
  cursor: pointer;

:deep(&.ant-tree) {
    background-color: transparent;
    margin-left: -10px;

    .ant-tree-treenode {

      .ant-tree-switcher,
      .ant-tree-node-content-wrapper {
        line-height: 40px;
      }

      .ant-tree-node-content-wrapper {
        padding: 0px;
        overflow: hidden;
      }

      .ant-tree-node-content-wrapper {
        width: 100%;

        &.ant-tree-node-selected {
          background: #E4E7EC;
        }
      }

      .ddei_home_dir_tree_node {
        padding: 0 6px;
        margin-bottom: 0;
      }
    }
  }
}

.ddei_home_dir_tree_node {
  width: 100%;
  padding: 0 14px 0 20px;
  text-align: left;
  display: flex;
  align-items: center;
  height: 40px;
  line-height: 40px;
  border-radius: 4px;
  margin-bottom: 4px;

  &:hover {
    background: #E4E7EC;

    .ddei_home_dir_tree_node_buttons {
      display: flex;

    }
  }

  &.is-active {
    background: #E4E7EC;
  }
}

.ddei_home_dir_tree_node_content {}

.ddei_home_dir_tree_node_icon {
  width: 24px;
  margin-right: 6px;
  flex-shrink: 0;
}

.ddei_home_dir_tree_node_icon__point {
  width: 16px;
  margin-right: 6px;
  flex-shrink: 0;
  text-align: center;

  &::after {
    display: inline-block;
    content: ' ';
    vertical-align: middle;
    width: 4px;
    height: 4px;
    background: #176EFF;
    border-radius: 50%;
  }
}

.ddei_home_dir_tree_node_title {
  flex: 1;
  overflow: hidden;
  white-space: nowrap;
  color: black;
  font-size: 16px !important;
  text-overflow: ellipsis;
}

.ddei_home_dir_tree_node_buttons {
  display: none;
  align-items: center;
  height: 20px;
  width: auto;
}

.ddei_home_dir_tree_node_button {
  display: block;
  width: 18px;
  height: 18px;

  +.ddei_home_dir_tree_node_button {
    margin-left: 6px;
  }
}

.ddei_home_dir_tree_node_button:hover {
  filter: brightness(40%);
}
</style>