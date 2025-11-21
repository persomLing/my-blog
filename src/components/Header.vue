<script setup>
import {
  ref,
  reactive,
  onMounted,
  onUnmounted,
  watch,
  computed,
  provide,
} from "vue";
import { useRouter } from "vue-router";
import { MenuOutlined } from "@ant-design/icons-vue";

const router = useRouter();

// 接收父组件传递的移动端菜单相关属性
const props = defineProps({
  blogPosts: {
    type: Array,
    default: () => [],
  },
  isMobile: {
    type: Boolean,
    default: false,
  },
  mobileMenuVisible: {
    type: Boolean,
    default: false,
  },
});

// 定义emit事件
const emit = defineEmits(["update:mobileMenuVisible"]);

// 电影名场面句子
const movieSentences = ref([
  {
    sentence: "你走，我不送你；你来，无论多大风多大雨，我要去接你。",
    movie: "梁实秋《送行》",
  },
  {
    sentence:
      "人生就是一列开往坟墓的列车，路途上会有很多站，很难有人可以自始至终陪着走完。",
    movie: "《千与千寻》",
  },
  {
    sentence: "君埋泉下泥销骨，我寄人间雪满头。",
    movie: "白居易《梦微之》",
  },
  {
    sentence: "世间所有的相遇都是久别重逢。",
    movie: "《一代宗师》",
  },
  {
    sentence: "痛苦的时候要是不能在一起，那还叫伙伴吗！",
    movie: "《海贼王》",
  },
  {
    sentence: "何夜无月？何处无竹柏？但少闲人如吾两人者耳。",
    movie: "苏轼《记承天寺夜游》",
  },
  {
    sentence: "人之所以孤独，是因为不敢迈出第一步。",
    movie: "《绿皮书》",
  },
  {
    sentence:
      "我踏出这一步的时候，我以为有一天我还会回来，想不到那次是最后一面。",
    movie: "《一代宗师》",
  },
  {
    sentence: "死亡不是生命的终点，遗忘才是。",
    movie: "《寻梦环游记》",
  },
  {
    sentence: "人生若无悔，那该多无趣啊。",
    movie: "《一代宗师》",
  },
  {
    sentence: "海内存知己，天涯若比邻。",
    movie: "王勃《送杜少府之任蜀州》",
  },
  {
    sentence: "希望是美好的，也许是人间至善，而美好的事物永不消逝。",
    movie: "《肖申克的救赎》",
  },
  {
    sentence: "一个人因为遭遇失败，才会拥有从那里再站起来的强悍。",
    movie: "《火影忍者》",
  },
  {
    sentence: "我寄愁心与明月，随君直到夜郎西。",
    movie: "李白《闻王昌龄左迁龙标遥有此寄》",
  },
  {
    sentence: "如果你不出去走走，你就会以为这就是全世界。",
    movie: "《天堂电影院》",
  },
  {
    sentence: "有些事情总是值得尝试，永不轻言放弃。",
    movie: "《放牛班的春天》",
  },
  {
    sentence: "桃花潭水深千尺，不及汪伦送我情。",
    movie: "李白《赠汪伦》",
  },
  {
    sentence: "太多选择，太复杂的判断，精神会崩溃的。",
    movie: "《海上钢琴师》",
  },
  {
    sentence: "人，得自个儿成全自个儿。",
    movie: "《霸王别姬》",
  },
  {
    sentence:
      "一直以来，我都认为只能是事情改变人，人改变不了事情，但是他们，改变了一些事情。",
    movie: "《无间道》",
  },
  {
    sentence:
      "我们这一生最遗憾的事情之一，就是把我们最糟糕的一面留给了最亲近的人。",
    movie: "《这个杀手不太冷》",
  },
  {
    sentence: "在别人的苦难面前，我怎么能转过身去。",
    movie: "《摩托日记》",
  },
  {
    sentence: "一个始终不被善待的人，最能识别善良，也最能珍惜善良。",
    movie: "《芳华》",
  },
  {
    sentence: "我到底要用怎么样的速度生活，才能与你再次相遇。",
    movie: "《秒速五厘米》",
  },
  {
    sentence: "放弃的话，比赛就到此结束了。",
    movie: "《灌篮高手》",
  },
  {
    sentence: "我情愿在你的记忆里淡忘，也不愿你为我受伤。",
    movie: "《名侦探柯南》",
  },
  {
    sentence: "一个人觉得寂寞，是因为害怕踏出最初的一步。",
    movie: "《夏目友人帐》",
  },
  {
    sentence:
      "如果把童年再放映一遍，我们一定会先大笑，然后放声痛哭，最后挂着泪，微笑着睡去。",
    movie: "《龙猫》",
  },
  {
    sentence: "良马足因无主踠，旧交心为绝弦哀。",
    movie: "崔珏《哭李商隐》",
  },
  {
    sentence: "人生不能像做菜，把所有的料都准备好了才下锅。",
    movie: "《饮食男女》",
  },
]);

// 搜索相关
const searchKeyword = ref("");
const showDropdown = ref(false);
const searchContainerRef = ref(null);
const currentSentenceIndex = ref(0);
const blogPosts = ref([]);

// 点击外部隐藏下拉框
const handleClickOutside = (e) => {
  if (
    searchContainerRef.value &&
    !searchContainerRef.value.contains(e.target)
  ) {
    showDropdown.value = false;
  }
};

onMounted(() => {
  document.addEventListener("mousedown", handleClickOutside);

  // 文字滚动定时器，每隔6秒切换一次
  const timer = setInterval(() => {
    currentSentenceIndex.value =
      (currentSentenceIndex.value + 1) % movieSentences.value.length;
  }, 6000);

  // 保存定时器引用以便在组件卸载时清除
  window.movieSentenceTimer = timer;
});

onUnmounted(() => {
  document.removeEventListener("mousedown", handleClickOutside);
  // 清除定时器
  if (window.movieSentenceTimer) {
    clearInterval(window.movieSentenceTimer);
  }
});

const filteredPosts = computed(() => {
  if (!searchKeyword.value || !props.blogPosts.length) return [];
  const keyword = searchKeyword.value.toLowerCase();

  return props.blogPosts.filter(
    (post) =>
      post.title.toLowerCase().includes(keyword) ||
      (post.content && post.content.toLowerCase().includes(keyword))
  );
});

const handleSearchItemClick = (post) => {
  router.push({ name: "post-detail", params: { id: post.id } });
  searchKeyword.value = "";
  showDropdown.value = false;
};

// 处理输入框失去焦点事件
const handleBlur = () => {
  setTimeout(() => {
    showDropdown.value = false;
  }, 200);
};
</script>

<template>
  <header class="site-header">
    <!-- 移动端菜单按钮 -->
    <div
      v-if="isMobile"
      class="mobile-menu-btn"
      @click="$emit('update:mobileMenuVisible', !mobileMenuVisible)"
    >
      <MenuOutlined />
    </div>

    <div class="movie-sentence">
      <span class="sentence">{{
        movieSentences[currentSentenceIndex].sentence
      }}</span>
      <span class="movie-name">{{
        movieSentences[currentSentenceIndex].movie
      }}</span>
    </div>

    <div v-if="isMobile" class="flex-space"></div>

    <div ref="searchContainerRef" class="search-container">
      <input
        type="text"
        class="search-input"
        placeholder="搜索..."
        v-model="searchKeyword"
        @input="showDropdown = true"
        @focus="showDropdown = true"
        @blur="handleBlur"
      />
      <div class="search-icon">🔍</div>
      <div
        v-if="showDropdown && filteredPosts.length"
        class="search-dropdown"
        @mousedown.stop
      >
        <div
          v-for="post in filteredPosts"
          :key="post.id"
          class="dropdown-item"
          @click="handleSearchItemClick(post)"
        >
          {{ post.title }}
        </div>
      </div>
    </div>
  </header>
</template>

<style scoped lang="less">
.site-header {
  position: relative;
  color: #fff;
  background: #cacaca56;
  font-size: 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
  height: 64px;

  @media (max-width: 768px) {
    font-size: 18px;
    padding: 0 12px;
    justify-content: flex-start;
  }
}

// 移动端菜单按钮
.mobile-menu-btn {
  font-size: 24px;
  color: rgba(0, 0, 0, 0.8);
  cursor: pointer;
  margin-right: 12px;
  z-index: 100;

  @media (min-width: 768px) {
    display: none;
  }
}

// 弹性空间，用于在移动端将搜索框推到右侧
.flex-space {
  flex: 1;

  @media (min-width: 768px) {
    display: none;
  }
}

// 电影句子滚动样式
.movie-sentence {
  flex: 1;
  text-align: center;
  color: rgba(0, 0, 0, 0.8);
  font-size: 18px;
  font-weight: 500;
  line-height: 64px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  animation: float-small 4s ease-in-out infinite;

  @media (max-width: 768px) {
    display: none;
  }

  .sentence {
    font-style: italic;
    margin-right: 10px;
  }

  .movie-name {
    font-size: 14px;
    color: rgba(0, 0, 0, 0.6);
  }
}

// 小动作浮动动画
@keyframes float-small {
  0%,
  100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-3px);
  }
}

.search-container {
  position: absolute;
  right: 20px;
  top: 50%;
  transform: translateY(-50%);
  display: inline-block;
  width: auto;
  max-width: calc(100% - 120px);

  @media (max-width: 768px) {
    position: relative;
    right: auto;
    top: auto;
    transform: none;
    max-width: calc(100% - 12px);
    width: 100%;
  }
}

.search-input {
  width: 120px;
  height: 40px;
  padding: 0 40px 0 15px;
  border: 2px solid transparent;
  border-radius: 30px;
  font-size: 16px;
  background: linear-gradient(
        rgba(255, 255, 255, 0.2),
        rgba(255, 255, 255, 0.2)
      )
      padding-box,
    linear-gradient(90deg, #ec5fff, #feb47b) border-box;
  color: #333;
  transition: all 0.3s ease;
  outline: none;

  @media (max-width: 768px) {
    width: calc(100% - 48px);
    height: 36px;
    font-size: 14px;
    margin-left: 48px;
  }
}
.search-input::placeholder {
  color: rgba(0, 0, 0, 0.6);
}
.search-input:hover {
  width: 200px;
  animation: shake 0.5s ease-in-out;

  @media (max-width: 768px) {
    width: calc(100% - 48px);
    margin-left: 48px;
  }
}

.search-icon {
  position: absolute;
  right: 15px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 20px;
  color: rgba(255, 255, 255, 0.8);
  pointer-events: none;

  @media (max-width: 768px) {
    font-size: 18px;
  }
}

.search-dropdown {
  position: absolute;
  top: calc(100% + 5px);
  right: 0px;
  width: 200px;
  max-height: 250px;
  overflow-y: auto;
  background: rgba(242, 198, 248, 0.2);
  backdrop-filter: blur(10px);
  border: 1px solid #d5bbd8;
  border-radius: 20px;
  box-shadow: 0 4px 20px rgba(240, 203, 245, 0.5);
  z-index: 10000;
  pointer-events: auto;
  padding: 8px;
  left: auto;

  @media (max-width: 768px) {
    width: 180px;
    right: 0;
    left: auto;
  }
}

.dropdown-item {
  text-align: center;
  color: rgba(0, 0, 0, 0.8);
  font-size: 15px;
  cursor: pointer;
  transition: all 0.3s ease;
  border-radius: 12px;
  margin-bottom: 4px;

  @media (max-width: 768px) {
    font-size: 14px;
    margin-bottom: 3px;
  }
}

.dropdown-item:last-child {
  margin-bottom: 0;
}

.dropdown-item:hover {
  background: rgba(229, 206, 231, 0.4);
  transform: translateX(4px);
  box-shadow: 0 2px 10px rgba(231, 194, 236, 0.7);
}

@keyframes shake {
  0%,
  100% {
    transform: translateX(0);
  }
  20%,
  60% {
    transform: translateX(-3px);
  }
  40%,
  80% {
    transform: translateX(3px);
  }
}
</style>
