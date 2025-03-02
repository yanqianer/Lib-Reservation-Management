<template>
  <div>
    <h1 class="text-2xl font-bold mb-4">博客管理</h1>

    <!-- 新增博客按钮 -->
    <button @click="openEditor" class="bg-blue-500 text-white px-4 py-2 rounded mb-4" v-if="!isEditing">
      新增博客
    </button>

    <!-- 博客列表 -->
    <div v-if="!isEditing">
      <div v-for="blog in Blogs" :key="blog.id" class="border p-4 mb-4 rounded-lg shadow-sm">
        <h2 class="text-xl font-semibold">{{ blog.title }}</h2>
        <!-- <p class="text-gray-600">{{ blog.description }}</p> -->
        <div class="mt-2">
          <button @click="editBlog(blog)" class="bg-yellow-500 text-white px-3 py-1 rounded mr-2">
            编辑
          </button>
          <button @click="deleteBlog(blog.id)" class="bg-red-500 text-white px-3 py-1 rounded">
            删除
          </button>
        </div>
      </div>
    </div>

    <!-- Markdown 编辑器 -->
    <div v-if="isEditing">
      <div class="mb-4 flex">
        <input v-model="currentBlog.title" placeholder="请输入博客标题" class="border p-2 w-1/2 rounded" />
        <!-- <p class=" text-center flex items-center justify-center w-24 bg-blue-500 text-white rounded ml-3"> 封面上传:</p> -->

        <div class="flex items-center">
          <label
            class="cursor-pointer bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md font-medium flex items-center ml-3">
            <input type="file" accept="image/*" class="hidden" @change="(event: any) => {
              frontCover = event.target.files[0];


              if (frontCover) {
                fileName = frontCover.name;
              }
            }" />
            <span>上传封面</span>
          </label>
          <span class="ml-3 text-gray-600 text-sm" v-if="fileName">{{ fileName }}</span>
        </div>


      </div>
      <v-md-editor v-model="currentBlog.content" height="500px" :disabled-menus="[]"
        @upload-image="handleUploadImage"></v-md-editor>
      <div class="mt-4">
        <button @click="saveBlog" class="bg-green-500 text-white px-4 py-2 rounded">
          保存
        </button>
        <button @click="cancelEdit" class="bg-gray-500 text-white px-4 py-2 rounded ml-2">
          取消
        </button>
      </div>
    </div>
    <div v-if="isEditing">
      预览
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import axios from 'axios'
import VMdEditor from '@kangc/v-md-editor'
import '@kangc/v-md-editor/lib/style/base-editor.css'
import '@kangc/v-md-editor/lib/theme/style/github.css'
import { get, type AdminControllerFindAllResult } from '@/orval-test/client'
import type { ArticleDto, CreateArticleDto } from '@/orval-test/client.schemas'

const controller = get()
const Blogs = ref<ArticleDto[]>([])
const getBlog = async () => {
  const result = await controller.articleControllerFindAll()
  Blogs.value = result.data!
}
const VITE_API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:3000'
const fileName = ref<string>('');
// const frontCover =ref<File>({} as File)
const frontCover = ref<any>()

// 当前编辑的博客
const currentBlog = ref<ArticleDto>({} as ArticleDto)


// 是否处于编辑模式
const isEditing = ref(false)

// 打开编辑器
const openEditor = () => {
  frontCover.value={}
  isEditing.value = true
  fileName.value=''
}

// 编辑博客
const editBlog = (blog: ArticleDto) => {
  currentBlog.value = { ...blog }
  isEditing.value = true
  fileName.value=''
}

// 取消编辑
const cancelEdit = () => {
  currentBlog.value = {} as ArticleDto
  isEditing.value = false
  frontCover.value={}
  fileName.value=''
}

// 保存博客
const saveBlog = async () => {

  if (!currentBlog.value.title || !currentBlog.value.content) {
    alert('标题和内容不能为空')
    return
  }


  // 如果是新增博客
  if (!currentBlog.value.id) {
    console.log(Object.keys(frontCover.value).length)
    if (!frontCover.value) {
      alert('请上传封面')
    }
    else {
      try {
        currentBlog.value.image = await frontCoverUpload(frontCover.value)
        if (currentBlog.value.image.length == 0) {
          return
        }
        Blogs.value.push({ ...currentBlog.value })
        const result = await controller.articleControllerCreate({
          title: currentBlog.value.title,
          content: currentBlog.value.content,
          image: currentBlog.value.image
        })
        if (result.code == 200) {
          alert('保存成功')
        }
        else {
          alert(result.msg)
        }
      }
      catch (error: any) {
        alert(error)

      }
    }
  } else {
    // 更新博客
    // console.log(!frontCover.value)
    // console.log(frontCover.value)
    if (frontCover.value) {
      currentBlog.value.image = await frontCoverUpload(frontCover.value)
    }
    const index = Blogs.value.findIndex((b) => b.id === currentBlog.value.id)
    Blogs.value[index] = { ...currentBlog.value }
    try {
      const result = await controller.articleControllerUpdate(currentBlog.value.id.toString(), {
        title: currentBlog.value.title,
        content: currentBlog.value.content,
        image: currentBlog.value.image
      })
      if (result.code == 200) {
        alert('更新成功')
      }
      else {
        alert(result.msg)
      }
    } catch (error: any) {
      alert(error)
    }
  }

  isEditing.value = false
  currentBlog.value = {} as ArticleDto
  frontCover.value=null
  fileName.value=''
}

// 删除博客
const deleteBlog = async (id: number) => {
  try {
    const result = await controller.articleControllerRemove(id.toString())
    Blogs.value = Blogs.value.filter((b) => b.id !== id)
    if (result.code == 200) {
      alert('删除成功')
    }
  } catch (error) {
    alert(error)
  }
}

// 图片上传
const handleUploadImage = async (event: any, insertImage: any, files: any) => {
  try {
    const result = await controller.uploadControllerUploadImage({
      file: files[0]
    })
    insertImage({
      url: result.data?.imageUrl ? `${VITE_API_BASE_URL}${result.data.imageUrl}` : '',
      desc: `${result.data?.imageUrl.split('/')[2]}`
    })
  }
  catch (error) {
    alert('图片上传失败' + error)
  }
}
const frontCoverUpload = async (file: any) => {
  try {
    const result = await controller.uploadControllerUploadImage({
      file: file
    })
    return  result.data?.imageUrl ? `${VITE_API_BASE_URL}${result.data.imageUrl}` : ''
  }
  catch (error) {
    alert('图片上传失败' + error)
  }
  return ''
}
onMounted(() => {
  getBlog()

})
</script>