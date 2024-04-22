<template>
  <div class="ddei_home_fileview">
    <div class="ddei_home_fileview_operations">
      <div v-if="false" class="ddei_home_fileview_operate ddei_home_fileview_operate_dir_add"
        @click="onCreateFolderClick">
        <div class="ddei_home_fileview_operate_icon">
          <svg class="icon" aria-hidden="true">
            <use xlink:href="#icon-add-folder-icon"></use>
          </svg>
        </div>
        <div class="ddei_home_fileview_operate_name">
          新建文件组
        </div>
        <div class="ddei_home_fileview_operate_plus">
          <svg class="icon" aria-hidden="true">
            <use xlink:href="#icon-a-ziyuan376"></use>
          </svg>
        </div>
      </div>
      <div class="ddei_home_fileview_operate ddei_home_fileview_operate_file_add" @click="showFileDialog(null, 1)">
        <div class="ddei_home_fileview_operate_icon">
          <svg class="icon" aria-hidden="true">
            <use xlink:href="#icon-add-file-icon"></use>
          </svg>
        </div>
        <div class="ddei_home_fileview_operate_name">
          新建文件
        </div>
        <div class="ddei_home_fileview_operate_plus">
          <svg class="icon" aria-hidden="true">
            <use xlink:href="#icon-a-ziyuan376"></use>
          </svg>
        </div>
      </div>
      <div v-if="false" class="ddei_home_fileview_operate ddei_home_fileview_operate_file_draft_add">
        <div class="ddei_home_fileview_operate_icon">
          <svg class="icon" aria-hidden="true">
            <use xlink:href="#icon-add-file1-icon"></use>
          </svg>
        </div>
        <div class="ddei_home_fileview_operate_name">
          新建草稿
        </div>
        <div class="ddei_home_fileview_operate_plus">
          <svg class="icon" aria-hidden="true">
            <use xlink:href="#icon-a-ziyuan376"></use>
          </svg>
        </div>
      </div>
    </div>
    <div class="ddei_home_fileview_divide"></div>
    <ASpin wrapper-class-name="ddei_home_fileview_files_spin" :spinning="loading">
      <div v-if="files?.length" class="ddei_home_fileview_files">
        <div v-for="(file) in files" :key="file.id" class="ddei_home_fileview_file">
          <div class="ddei_home_fileview_file_header">
            <div class="ddei_home_fileview_file_icon">
              <svg class="icon" aria-hidden="true">
                <use xlink:href="#icon-wenjian01"></use>
              </svg>
            </div>
            <div class="ddei_home_fileview_file_name" :title="file.name">{{ file.name }}</div>

            <div
              :class="{ 'ddei_home_fileview_file_version': true, 'ddei_home_fileview_file_version_published': file.publish == 1 }">
              v{{ file.version }}
            </div>
            <div class="ddei_home_fileview_file_update">
              {{ getFileLastTime(file) }}
            </div>
          </div>
          <div class="ddei_home_fileview_file_info" @click="gotoDesign(file)">
            <div class="ddei_home_fileview_file_thumbnail">
              <img v-if="file.thumb" :src="file.thumb" />
              <img v-if="!file.thumb" src="@/assets/images/thumbnail_default.png">
            </div>
          </div>
          <div class="ddei_home_fileview_file_buttons">
            <div class="ddei_home_fileview_file_button" @click="showFileDialog(file, 2)">
              <svg class="icon" aria-hidden="true">
                <use xlink:href="#icon-icon-edit-file"></use>
              </svg>
              <span>编辑</span>
            </div>
            <div class="ddei_home_fileview_file_button_split">
            </div>

            <div class="ddei_home_fileview_file_button_split">
            </div>
            <div class="ddei_home_fileview_file_button" @click="copyFile(file)">
              <svg class="icon" aria-hidden="true">
                <use xlink:href="#icon-icon-copy-file"></use>
              </svg>
              <span>复制</span>
            </div>
            <div class="ddei_home_fileview_file_button_split">
            </div>
            <div class="ddei_home_fileview_file_button" @click="deleteFile(file)">
              <svg class="icon" style="color:red" aria-hidden="true">
                <use xlink:href="#icon-a-ziyuan401"></use>
              </svg>
              <span>删除</span>
            </div>
          </div>
        </div>
      </div>
      <AEmpty v-else class="m-t-80"></AEmpty>
    </ASpin>
    <APagination v-model:current="page.num" :total="page.total" show-less-items class="m-h-auto m-t-10"
      @change="listFile" />
  </div>
  <AModal v-model:open="fileDialog.open" :title="(fileDialog.mod == 1 ? '创建' : '修改') + '文件'"
    :ok-button-props="{ loading: fileDialog.saving }" width="400px" @ok="submitFile()">
    <AForm ref="form" :model="fileDialog.formData" :rules="fileDialog.formRules" autocomplete="off" class="m-t-20">
      <AFormItem name="name">
        <AInput v-model:value="fileDialog.formData.name" placeholder="文件名" clearable></AInput>
      </AFormItem>
      <AFormItem name="code">
        <AInput v-model:value="fileDialog.formData.code" placeholder="编码" clearable></AInput>
      </AFormItem>
      <AFormItem name="folder_id">
        <ATreeSelect v-model:value="fileDialog.formData.folder_id" show-search style="width: 100%"
          :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }" placeholder="所属目录" allow-clear
          tree-default-expand-all :tree-data="folderSelectTreeData" :field-names="treeFieldNames"
          tree-node-filter-prop="label"></ATreeSelect>
      </AFormItem>
      <AFormItem name="desc">
        <ATextarea v-model:value="fileDialog.formData.desc" placeholder="备注" :rows="4" />
      </AFormItem>
    </AForm>
  </AModal>
</template>

<script type="ts">
import Cookies from 'js-cookie'
import { listfile, createfile, savefilebasic, removefile, copyfile } from "@/lib/api/file"
import ICONS from '@/components/editor/js/icon'
import { debounce } from 'lodash'
import { createVNode } from 'vue'
import { message, Modal } from 'ant-design-vue'

export default {
  name: 'DDei-Home-Filelist',
  emits: ['createFolder'],
  expose: ['listFile'],
  props: {

  },
  data () {
    return {
      loading: false,
      fileDialogShow: false,
      delFileDialogShow: false,
      fileDialog: {
        open: false,
        saving: false,
        mod: 1,
        formData: {},
        formRules: {
          name: [
            {
              validator: debounce(this.checkFileName)
            }
          ],
          code: [
            {
              validator: debounce(this.checkFileCode)
            }
          ],
          desc: [
            {
              validator: debounce(this.checkFileDesc)
            }
          ]
        }
      },
      icons: ICONS,
      cf: {},
      files: [

      ],
      folderSelectTreeData: [],
      menuTreeExpandedKeys: ['0'],
      treeFieldNames: { children: 'children', key: 'id', title: 'name', label: 'name', value: 'id' },
      queryText: "",
      page: { size: 10, num: 1, total: 0 }
    }
  },
  created () { },
  mounted () {
    this.listFile()
  },
  methods: {

    /**
     * 跳转到设计页
     */
    gotoDesign (file) {
      this.$router.push({
        path: '/design/' + file.id,

      })
    },

    deleteFile (file) {
      Modal.confirm({
        title: '是否删除文件',
        content: createVNode('div', {}, file.name),
        onOk: async () => {
          let fileData = await removefile({ id: file.id })
          if (fileData.status == 200) {
            //获取成功
            if (fileData.data?.code == 0) {
              message.success('删除成功')
              this.listFile(this.page.num)
            }
          }
        }
      })
    },

    copyFile (file) {
      Modal.confirm({
        title: '是否复制文件',
        content: file.name,
        onOk: async () => {
          let fileData = await copyfile({ id: file.id })
          if (fileData.status == 200) {
            //获取成功
            if (fileData.data?.code == 0) {
              message.success('复制成功')
              this.listFile(this.page.num)
            }
          }
        }
      })
    },

    /**
     * 加载文件
     */
    async listFile (pageNumber) {
      if (pageNumber) {
        this.page.num = pageNumber
      } else if (pageNumber > this.page.count) {
        this.page.num = this.page.count
      } else if (pageNumber < 1) {
        this.page.num = 1
      }
      let curFolder = this.$parent.$refs["dirTree"]?.getCurrentFolder()
      let fid = curFolder?.id ? curFolder.id : "0"
      this.loading = true
      let fileData
      let listData
      try {
        fileData = await listfile({ folder_id: fid, pageSize: this.page.size, pageNum: this.page.num, text: this.queryText })
        listData = fileData.data.data.data
        this.page.total = fileData.data.data.count
      } catch (e) {
        listData = []
        this.page.total = 0
      }
      this.files = listData
      this.loading = false
    },

    checkFileName (rule, value, cb) {
      if (!value) {
        cb('请输入文件名')
        return
      }
      let uPattern = /^[\u4e00-\u9fa5a-zA-Z0-9_-]{1,15}$/
      if (!uPattern.test(value)) {
        cb("文件名为1至15位中文、字母、数字下划线组合")
        return
      }
      cb()
    },

    checkFileCode (rule, value, cb) {
      if (!value) {
        cb()
        return
      }
      let uPattern = /^[a-zA-Z0-9_.-]{0,20}$/
      if (!uPattern.test(value)) {
        cb("编码为0至20位字母、数字、_.组合")
        return
      }
      cb()
    },

    checkFileDesc (rule, value, cb) {
      if (!value) {
        cb()
        return
      }
      if (value.length > 50) {
        cb("描述请稍微简短一点, 不要超过50个字")
        return
      }
      cb()
    },

    /**
     * 创建/更新文件
     */
    submitFile () {
      this.$refs.form.validate().then(async () => {
        let fileData = null
        this.fileDialog.saving = true
        if (this.fileDialog.mod == 1) {
          fileData = await createfile(this.fileDialog.formData)
        } else if (this.fileDialog.mod == 2) {
          fileData = await savefilebasic(this.fileDialog.formData)
        }
        if (fileData?.status == 200) {
          //获取成功
          if (fileData.data?.code == 0) {
            message.success('保存成功')
            //刷新列表
            this.listFile(this.page.num)
            this.fileDialog.open = false
          }
        }
        this.fileDialog.saving = false
      }).catch(e => {
        console.error(e)
        this.fileDialog.saving = false
      })
    },

    /**
    * 弹出新文件的弹出框
    */
    showFileDialog (file, mod) {
      this.folderSelectTreeData = this.$parent.$refs["dirTree"]?.getFolderTreeData()
      this.fileDialog.open = true
      this.fileDialog.mod = mod
      let formData = Object.assign({}, file)

      this.curFile = file
      let curFolder = this.$parent.$refs["dirTree"]?.getCurrentFolder()
      let fid = curFolder?.id || "0"
      formData.folder_id = fid
      this.fileDialog.formData = formData
    },
    /**
     * 获取文件最后更新时间
     */
    getFileLastTime (file) {
      if (file?.last_update_time) {
        let date = file.last_update_time

        if (date && date.length > 10 && date.indexOf("-") != -1) {
          let d = date.substring(date.indexOf("-") + 1, date.indexOf("T"))
          // if (date.indexOf("T") != -1 && date.indexOf(":", date.indexOf(":") + 1) != -1) {
          //   d += " " + date.substring(date.indexOf("T") + 1, date.indexOf(":", date.indexOf(":") + 1))
          // }
          return d
        }
      }
      return ""
    },
    onCreateFolderClick () {
      this.$emit('create-folder')
    }
  }
}
</script>

<style lang='less' scoped>
.ddei_home_fileview {
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 24px 32px;
  height: calc(100vh - 55px);
}

.ddei_home_fileview_files_spin {
  flex: 1;
  height: calc(100% - 105px);
}

.ddei_home_fileview_files {

  margin-top: -20px;
  margin-left: -20px;
  height: 100%;
}

.ddei_home_fileview_file {
  width: 295px;
  height: 280px;
  border-radius: 4px;
  display: flex;
  flex-direction: column;
  background: #FAFAFA;
  color: #212121;
  margin-left: 20px;
  margin-top: 20px;
  float: left;
}

.ddei_home_fileview_file_header {
  display: flex;
  align-items: center;
  border-radius: 4px 4px 0 0;
  border: 1px solid #CED4DD;
  background: #ffffff;
  flex: 0 0 48px;
  padding: 0 20px;
}

.ddei_home_fileview_file_info {
  flex: 0 0 184px;
  display: grid;
  gap: 2px;
  padding: 20px;
  border: 1px solid #CED4DD;
  border-top: 0;
  border-bottom: 0;
  cursor: pointer;
  overflow: hidden;
}

.ddei_home_fileview_file_thumbnail {
  width: 100%;
  height: 100%;
  overflow: hidden;
  text-align: center;

  img {
    max-width: 100%;
    /* 设置图片的最大宽度为父元素宽度的100% */
    max-height: 100%;
    /* 同上，最大高度也为100% */

    width: auto;
    /* 宽度设为auto，使图片按比例缩放 */

    height: auto;
    /* 高度同上，按比例缩放 */

    min-width: 160px;
    /* 如果图片小于父元素，最小宽度应设置为100px，以保持等比缩放效果 */

    min-height: 100px;
    /* 同上，最小高度也应为100px */
  }
}

.ddei_home_fileview_file_add {
  flex: 1;
  color: #3662ec;
  border: 1px dashed #3662ec;
  border-radius: 6px;
  font-size: 60px;
  text-align: center;
  display: flex;
  justify-content: center;
  align-items: center;
}

.ddei_home_fileview_file_add:hover {
  cursor: pointer;
  filter: brightness(120%);
  border: 2px dashed #3662ec;
}

.ddei_home_fileview_file_code {
  color: #d55e43;
  font-size: 12px;
  grid-column: 2/5;
}

.ddei_home_fileview_file_update {
  color: #898989;
  font-size: 12px;
  grid-column: 5/7;
  text-align: right;
}

.ddei_home_fileview_file_name {
  flex: 1;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  margin-right: 8px;
  font-size: 16px;
}

.ddei_home_fileview_file_version {
  color: orange;
  text-align: right;
  margin-right: 8px;
}

.ddei_home_fileview_file_version_published {
  color: green;
}

.ddei_home_fileview_file_desc {
  grid-column: 1/7;
  grid-row: 3/5;
  font-size: 12px;
  color: grey;
  overflow: hidden;
  background: #2c2c2c;
  border-radius: 5px;
  padding: 2px;
}

.ddei_home_fileview_file_icon .icon {
  width: 21px;
  height: 21px;
  margin-right: 6px;
}

.ddei_home_fileview_file_buttons {
  display: flex;
  align-items: center;

  border-radius: 0 0 4px 4px;
  border: 1px solid #CED4DD;
  background: #ffffff;
  flex: 0 0 48px;
  cursor: pointer;
}

.ddei_home_fileview_file_button_split {
  flex: 0 0 1px;
  height: 22px;
  background-color: #5c5c5c;
}

.ddei_home_fileview_file_button {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;

}

.ddei_home_fileview_file_button .icon {
  width: 24px;
  height: 24px;
  margin-right: 4px;
  margin-left: 4px;
}

.ddei_home_fileview_file_button span {
  font-size: 16px;
  margin-right: 10px;
}

.ddei_home_fileview_file_button img:hover {
  filter: brightness(40%);
  cursor: pointer;
}

.ddei_home_fileview_operations {
  display: flex;
}

.ddei_home_fileview_divide {
  display: block;
  margin-top: 20px;
  margin-bottom: 20px;
  margin-right: 20px;
  border-bottom: 1px solid #CED4DD;
}

.ddei_home_fileview_operate {
  width: 285px;
  height: 64px;
  margin-right: 40px;
  display: flex;
  align-items: center;
  padding: 0 20px;
  box-sizing: border-box;
  cursor: pointer;
  border-radius: 4px;
  background-repeat: no-repeat;
  background-size: contain;

  &_dir_add {
    background-image: url(@/assets/images/icon-dir-add-bg.png)
  }

  &_file_add {
    background-image: url(@/assets/images/icon-file-add-bg.png)
  }

  &_file_draft_add {
    background-image: url(@/assets/images/icon-file-draft-add-bg.png)
  }

  &_icon {
    width: 48px;
    height: 48px;

    .icon {
      width: 48px;
      height: 48px;
    }
  }

  &_name {
    font-size: 16px;
    color: #FFFFFF;
    line-height: 64px;
    flex: 1;
  }

  &_plus {
    .icon {
      color: #FFFFFF;
      font-size: 26px;
      font-weight: bold;
      filter: brightness(100%);
    }
  }
}
</style>