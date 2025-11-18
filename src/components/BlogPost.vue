<template>
  <div class="blog-post">
    <div class="post-header">
      <h2 class="post-title">
        <a :href="`#/post/${post.id}`" @click.prevent="handleClick">{{
          post.title
        }}</a>
      </h2>
      <div class="post-meta">
        <span class="post-date">{{ post.date }}</span>
        <span class="post-author">作者：{{ post.author }}</span>
        <span class="post-category">{{ post.category }}</span>
      </div>
    </div>
    <div class="post-excerpt" v-html="post.excerpt"></div>
    <div class="post-actions">
      <a
        :href="`#/post/${post.id}`"
        @click.prevent="handleClick"
        class="read-more"
        >阅读更多</a
      >
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  post: {
    type: Object,
    required: true,
  },
});

const emit = defineEmits(["click"]);

const handleClick = () => {
  emit("click", props.post);
};
</script>

<style scoped>
.blog-post {
  background-color: rgba(255, 255, 255, 0.8);
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  padding: 32px;
  margin-bottom: 32px;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  border-left: 4px solid #409eff;
}

.blog-post:hover {
  transform: translateY(-5px);
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.15);
}

.post-header {
  margin-bottom: 16px;
}

.post-title {
  font-size: 24px;
  margin-bottom: 8px;
}

.post-title a {
  color: #333;
  text-decoration: none;
  transition: color 0.3s ease;
}

.post-title a:hover {
  color: #409eff;
}

.post-meta {
  font-size: 14px;
  color: #999;
}

.post-meta span {
  margin-right: 20px;
}

.post-excerpt {
  font-size: 16px;
  line-height: 1.8;
  color: #666;
  margin-bottom: 20px;
}

.post-actions {
  text-align: right;
}

.read-more {
  display: inline-block;
  padding: 8px 16px;
  background-color: #409eff;
  color: white;
  text-decoration: none;
  border-radius: 4px;
  font-size: 14px;
  transition: background-color 0.3s ease;
}

.read-more:hover {
  background-color: #66b1ff;
}
</style>
