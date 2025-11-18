<script setup>
import { ref, onMounted, watch, nextTick } from "vue";
import { useRoute, useRouter } from "vue-router";
import Layout from "./Layout.vue";
import { Viewer } from "@bytemd/vue-next";
import gfm from "@bytemd/plugin-gfm";
import "bytemd/dist/index.css";
import "highlight.js/styles/github.css";
import highlight from "@bytemd/plugin-highlight";
import codeCopyPlugin from "../utils/codeCopyPlugin.js";

const route = useRoute();
const router = useRouter();
const post = ref(null);
const loading = ref(true);
const mdContent = ref("");

// 配置 ByteMD 插件
const plugins = [gfm(), highlight(), codeCopyPlugin()];

// 动态加载 markdownLoader.js
const loadPost = async (id) => {
  loading.value = true;
  try {
    const { loadMarkdownFiles } = await import("../utils/markdownLoader.js");
    const articles = await loadMarkdownFiles();
    const foundPost = articles.find((article) => article.id === id);
    post.value = foundPost;
    if (foundPost) {
      mdContent.value = foundPost.content;
    }
  } catch (error) {
    console.error("Error loading post:", error);
  } finally {
    loading.value = false;
  }
};

// 监听路由变化，添加 immediate: true 选项
watch(
  () => route.params.id,
  (newId) => {
    if (newId) {
      loadPost(newId);
    }
  },
  { immediate: true } // 初始化时立即执行一次
);

// 移除组件挂载时的重复调用
// onMounted(() => {
//   const { id } = route.params;
//   if (id) {
//     loadPost(id);
//   }
// });

const goBack = () => {
  router.push("/");
};
</script>

<template>
  <div v-if="loading" class="loading">加载中...</div>
  <div v-else-if="post" class="post-detail-page">
    <div class="post-header">
      <h1 class="post-title">{{ post.title }}</h1>
      <div class="post-meta">
        <span class="post-date">{{ post.date }}</span>
        <span class="post-category">分类：{{ post.category }}</span>
      </div>
    </div>

    <div class="post-content">
      <Viewer :value="mdContent" :plugins="plugins" />
    </div>

    <div class="post-actions">
      <a-button @click="goBack" class="back-btn">← 返回首页</a-button>
    </div>
  </div>
  <div v-else class="not-found">未找到该文章</div>
</template>

<style scoped lang="less">
.post-detail-page {
  position: relative;
  height: calc(100% - 24px);
}

.post-header {
  z-index: 1;
  background-color: rgba(255, 255, 255, 0.8);
  padding: 20px;
  border-radius: 8px 8px 0 0;
}

.post-title {
  font-size: 28px;
  margin-bottom: 16px;
  color: #333;
}

.post-meta {
  font-size: 14px;
  color: #666;
  margin-bottom: 20px;

  .post-date {
    margin-right: 20px;
  }
}

.post-content {
  // z-index: 1;
  background-color: rgba(255, 255, 255, 0.8);
  padding: 0px 24px 24px;
  font-size: 16px;
  color: #333;
  overflow: auto;

  :global(.btn-copy) {
    position: absolute;
    right: 0px;
    display: flex;
    align-items: center;
    width: auto;
    font-size: 12px;
    padding: 4px 8px;
    color: #6b6b6b;
    cursor: pointer;
  }
  :global(.btn-copy:hover) {
    border-color: #666;
  }
  :global(.btn-copy:active) {
    border: 1px solid #000;
  }
  :global(.btn-copy::focus) {
    border: 1px solid #000;
    outline: none;
  }
}

.post-actions {
  z-index: 1;
  background-color: rgba(255, 255, 255, 0.8);
  padding: 20px;
  text-align: right;
  border-radius: 0 0 8px 8px;
}

.loading {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 400px;
  font-size: 18px;
  color: #666;
}

.not-found {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 400px;
  font-size: 18px;
  color: #666;
}
</style>
