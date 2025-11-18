<script setup>
import {
  ref,
  reactive,
  onMounted,
  onUnmounted,
  h,
  provide,
  watch,
  computed,
} from "vue";
import { useRouter, useRoute } from "vue-router";
import { Layout, Menu, Button, Card } from "ant-design-vue";
import {
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  HomeOutlined,
  UserOutlined,
  FolderOutlined,
  FileTextOutlined,
  MailOutlined,
  MenuOutlined,
} from "@ant-design/icons-vue";

// 导入Header组件
import HeaderComponent from "./Header.vue";

const { Header, Sider, Content, Footer } = Layout;

const props = defineProps({
  title: {
    type: String,
    default: "",
  },
});

const collapsed = ref(false);
const blogPosts = ref([]);
const currentCategory = ref(null);
const openKeys = ref([]);
const selectedKey = ref([]);

const router = useRouter();
const route = useRoute();

// 监听路由变化更新菜单选中状态
watch(
  () => route.fullPath,
  (newPath) => {
    if (newPath === "/") {
      selectedKey.value = ["home"];
    } else if (newPath === "/about") {
      selectedKey.value = ["about"];
    } else if (newPath === "/contact") {
      selectedKey.value = ["contact"];
    } else if (newPath.startsWith("/post/")) {
      const id = route.params.id;
      selectedKey.value = [id];
    }
  },
  { immediate: true }
);

// 生成动态分类列表
const generatedCategories = ref([]);

// 生成导航菜单结构
const generateMenuItems = (categories) => {
  return categories.map((category) => {
    if (category.children && category.children.length > 0) {
      // 分类目录
      return {
        key: category.name,
        label: category.name,
        icon: h(FolderOutlined),
        children: generateMenuItems(category.children),
      };
    } else {
      // 文章
      return {
        key: category.article.id,
        label: category.name,
        icon: h(FileTextOutlined),
        article: category.article,
      };
    }
  });
};

// 主菜单结构
const mainMenuItems = reactive([
  {
    key: "home",
    label: "首页",
    icon: h(HomeOutlined),
  },
  {
    key: "about",
    label: "关于我",
    icon: h(UserOutlined),
  },
  {
    key: "categories",
    label: "分类",
    icon: h(FolderOutlined),
    children: [], // 动态生成的分类结构
  },
  {
    key: "contact",
    label: "联系",
    icon: h(MailOutlined),
  },
]);

// 处理菜单点击
const handleMenuClick = ({ key, keyPath, item }) => {
  if (item?.props?.article) {
    // 点击的是文章
    router.push({ name: "post-detail", params: { id: item.props.article.id } });
    selectedKey.value = [key];
  } else {
    // 点击的是目录或其他菜单项
    selectedKey.value = [key];
    switch (key) {
      case "home":
        router.push("/");
        break;
      case "about":
        router.push("/about");
        break;
      case "contact":
        router.push("/contact");
        break;
      default:
        router.push(`/post/${key}`);
        break;
    }
  }
};

// 处理目录展开/收起
const handleMenuOpenChange = (keys) => {
  openKeys.value = keys;
};

// 加载文章并生成分类
const loadContent = async () => {
  const { loadMarkdownFiles, generateCategories } = await import(
    "../utils/markdownLoader.js"
  );
  const articles = await loadMarkdownFiles();
  blogPosts.value = articles;

  // 将生成的分类插入到菜单的第三个位置（索引 2）
  const categories = generateCategories(articles);
  generatedCategories.value = categories;

  // 转换为Ant Design Vue的菜单结构
  const menuItems = generateMenuItems(categories);
  mainMenuItems[2].children = menuItems;
};

// 组件挂载时加载内容
onMounted(() => {
  loadContent();
});

onUnmounted(() => {});

// 提供blogPosts给子组件
provide("blogPosts", blogPosts);
</script>

<template>
  <Layout class="layout-main" style="min-height: 100vh">
    <Sider
      v-model:collapsed="collapsed"
      :trigger="null"
      collapsible
      class="site-sider"
    >
      <div class="logo">
        <img src="@/assets/logo.jpg" alt="" />
        <span v-if="!collapsed">星期wu~</span>
      </div>

      <!-- 使用Ant Design Vue的Menu组件 -->
      <Menu
        mode="inline"
        v-model:openKeys="openKeys"
        v-model:selectedKeys="selectedKey"
        :items="mainMenuItems"
        @click="handleMenuClick"
        @openChange="handleMenuOpenChange"
      />

      <!-- 侧边栏底部的收起/展开按钮 -->
      <div class="sider-toggle-btn" @click="collapsed = !collapsed">
        <MenuUnfoldOutlined v-if="collapsed" />
        <MenuFoldOutlined v-else />
      </div>
    </Sider>

    <Layout class="layout-content">
      <!-- 使用Header组件并传递blogPosts -->
      <HeaderComponent :blog-posts="blogPosts" />
      <Content class="site-content-wrapper">
        <div class="site-content">
          <slot></slot>
        </div>
      </Content>
    </Layout>
  </Layout>
</template>

<style scoped lang="less">
.layout-main {
  // background-image: url("@/assets/b1.jpg");
  background-size: cover;
}

.logo {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 64px;
  box-sizing: border-box;
  overflow: hidden;
  img {
    width: 48px;
    height: 48px;
    border-radius: 50%;
  }

  span {
    font-size: 24px;
    font-weight: bold;
    margin-left: 12px;
    white-space: nowrap;
    // 颜色渐变
    background: linear-gradient(90deg, #ec5fff, #feb47b);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }
}

.layout-content {
  background: transparent;
}

.site-sider {
  background: #cacaca56;
  position: relative;
  :global(.ant-menu) {
    background: #cacaca56;
  }
  :global(.ant-menu-item-selected) {
    background-color: #e6f4ff73 !important;
    color: rgb(66, 107, 182) !important;
  }
  :global(
      .ant-menu-light .ant-menu-submenu-selected > .ant-menu-submenu-title
    ) {
    color: rgb(66, 107, 182) !important;
  }
}

.site-header {
  color: #fff;
  background: #cacaca56;
  font-size: 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
}

.sider-toggle-btn {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  text-align: center;
  padding: 10px 0;
  cursor: pointer;
  background: #cacaca56;
  color: rgb(10, 10, 10);
}

.site-content-wrapper {
  overflow: visible;
  padding: 24px;
}

.site-content {
  position: relative;
  overflow: hidden;
  overflow-y: auto;
  padding: 24px;
  height: calc(100vh - 112px);
  background-color: rgba(239, 241, 224, 0.253);
  box-shadow: 0 2px 12px #9e9e9e67;
  border-radius: 12px;
  // max-width: 1400px;
  margin: 0 auto;
  width: 100%;
}
</style>
