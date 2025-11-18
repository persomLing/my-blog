<script setup>
import { ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import Layout from "./Layout.vue";
import { Card } from "ant-design-vue";

const router = useRouter();
const blogPosts = ref([]);
const currentCategory = ref(null);

// 过滤当前分类下的文章
const filteredPosts = computed(() => {
  if (!currentCategory.value) {
    return blogPosts.value;
  }
  return blogPosts.value.filter(
    (post) => post.category === currentCategory.value
  );
});

// 加载文章并生成分类
const loadContent = async () => {
  const { loadMarkdownFiles } = await import("../utils/markdownLoader.js");
  const articles = await loadMarkdownFiles();
  blogPosts.value = articles;
};

// 组件挂载时加载内容
onMounted(() => {
  loadContent();
});
</script>

<template>
  <h2 class="section-title">最新文章</h2>
  <div class="blog-posts">
    <Card
      v-for="post in filteredPosts"
      :key="post.id"
      :title="post.title"
      :bordered="false"
      hoverable
      @click="router.push({ name: 'post-detail', params: { id: post.id } })"
      class="blog-post-card"
      style="margin-bottom: '16px'"
    >
      <div style="height: 100px; overflow: hidden; text-overflow: ellipsis">
        {{ post.excerpt }}
      </div>
      <div style="margin-top: 8px; fontsize: 12px; color: #999">
        <span>{{ post.date }}</span> |
        <span style="margin-left: 8px">{{ post.category }}</span>
      </div>
    </Card>
  </div>
</template>

<style scoped lang="less">
.blog-posts {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 16px;
  margin-top: 16px;
  .blog-post-card {
    background-color: rgba(255, 255, 255, 0.589);
  }
}

/* 移动端样式 */
@media (max-width: 768px) {
  .blog-posts {
    grid-template-columns: 1fr;
  }
}
</style>

<style>
/* 全局样式重置 */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen",
    "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue",
    sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
</style>
