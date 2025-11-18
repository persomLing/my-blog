<script setup>
import { useRouter } from "vue-router";
import Layout from "./Layout.vue";

const router = useRouter();

const goBack = () => {
  router.push("/");
};
</script>

<template>
  <div class="contact-page">
    <h1 class="page-title">联系我</h1>
    <div class="page-content">
      <p>如果您有任何问题或建议，欢迎通过以下方式联系我：</p>
      <ul style="margin-top: 16px">
        <li><strong>邮箱：</strong>your-email@example.com</li>
        <li><strong>GitHub：</strong>github.com/your-username</li>
        <li><strong>微信：</strong>your-wechat-id</li>
      </ul>
    </div>
    <div class="page-actions">
      <a-button @click="goBack">← 返回首页</a-button>
    </div>
  </div>
</template>

<style scoped>
.contact-page {
  width: 100%;
  min-height: 100%;
}

.page-title {
  font-size: 32px;
  margin-bottom: 24px;
  color: #333;
}

.page-content {
  margin-bottom: 32px;
  font-size: 16px;
  line-height: 1.6;
}

.page-actions {
  margin-top: 32px;
}
</style>
