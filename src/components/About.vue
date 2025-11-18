<script setup>
import { useRouter } from "vue-router";
import Layout from "./Layout.vue";

const router = useRouter();

const goBack = () => {
  router.push("/");
};
</script>

<template>
  <div class="about-page">
    <h1 class="page-title">关于我</h1>
    <div class="page-content">
      <p>闲来无事，便来看看。</p>
      <img
        src="@/assets/b1.jpg"
        alt="关于我"
        style="width: 300px; margin: 16px 0"
      />
    </div>
    <div class="page-actions">
      <a-button @click="goBack">← 返回首页</a-button>
    </div>
  </div>
</template>

<style scoped>
.about-page {
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
