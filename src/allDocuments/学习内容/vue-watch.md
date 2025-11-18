Vue 的 `watch` 函数是组件响应式系统中的一个强大工具，用于监听响应式数据的变化并执行相应的回调函数（副作用）。下面这个表格能帮你快速抓住 `watch` 的核心要点。

| 特性维度 | 说明 |
| :--- | :--- |
| **核心作用** | 监听响应式数据的变化，执行副作用（如异步请求、复杂逻辑） |
| **监听对象** | Ref、Reactive 对象、计算属性、函数返回值、或多个源的数组 |
| **回调参数** | `(newValue, oldValue)`  |
| **主要选项** | `immediate`（立即执行）, `deep`（深度监听） |
| **返回值** | 一个用于停止监听的函数 |
| **缓存机制** | 无缓存，每次变化都执行 |

### 💡 基本用法与场景

`watch` 的基本用法是传入要监听的源和一个回调函数。

```javascript
import { ref, watch } from 'vue'

const count = ref(0)

// 基本用法
watch(count, (newValue, oldValue) => {
  console.log(`count 从 ${oldValue} 变成了 ${newValue}`)
})
```

它的典型应用场景包括：
*   **异步操作**：如搜索框输入时，根据关键词动态请求数据。
*   **复杂数据处理**：在数据变化时执行非纯计算（如涉及DOM操作）或开销较大的逻辑。
*   **表单验证**：实时验证用户输入。

### ⚙️ 监听不同类型的源

根据监听源的类型，写法上有所不同。

```javascript
import { ref, reactive, watch, computed } from 'vue'

// 1. 监听 ref (基本类型)
const count = ref(0)
watch(count, (newVal, oldVal) => { /* ... */ })

// 2. 监听 reactive 对象
const user = reactive({ name: 'Alice', age: 25 })
// 注意：默认深度监听，但 newVal 和 oldVal 指向同一对象
watch(user, (newVal) => { console.log('用户信息变化了:', newVal) }) 

// 3. 更推荐：监听 reactive 对象的特定属性，使用 getter 函数
watch(() => user.name, (newName, oldName) => { 
  console.log(`用户名从 ${oldName} 变为 ${newName}`) 
})

// 4. 监听多个源
const firstName = ref('')
const lastName = ref('')
watch([firstName, lastName], ([newFirst, newLast], [oldFirst, oldLast]) => {
  console.log(`姓名变化: ${oldFirst} ${oldLast} -> ${newFirst} ${newLast}`)
})

// 5. 监听计算属性
const doubleCount = computed(() => count.value * 2)
watch(doubleCount, (newVal) => { console.log(`双倍计数: ${newVal}`) })
```

### 🔧 配置选项

通过选项对象，可以更精确地控制监听行为。

```javascript
// 1. immediate: 在监听开始后立即执行一次回调
watch(count, (newVal) => {
  console.log(`初始值或变化后的值: ${newVal}`)
}, { immediate: true })

// 2. deep: 深度监听嵌套对象内部值的变化（对非 reactive 的引用类型如 ref({}) 有用）
const config = ref({ theme: { mode: 'dark' } })
watch(config, (newVal) => { 
  console.log('配置深度变化:', newVal) 
}, { deep: true }) // 注意性能开销

// 注意：reactive() 创建的对象默认是深度监听的，无需设置 deep: true。
```

### ⚠️ 最佳实践与常见陷阱

1.  **善用停止监听**：`watch` 会返回一个停止函数，在组件卸载或不再需要监听时调用它，有助于避免内存泄漏。
    ```javascript
    const stopWatch = watch(count, (newVal) => { /* ... */ })
    // 当不再需要时
    stopWatch()
    ```

2.  **警惕深度监听的性能开销**：`deep: true` 会递归遍历对象的所有属性，为每一层建立依赖，对复杂对象或大型列表可能造成性能压力。尽量通过 getter 函数监听特定属性。

3.  **避免无限循环**：在 `watch` 回调中直接修改正在监听的数据，可能导致无限循环。确保有终止条件。
    ```javascript
    // 错误示例：可能导致无限循环
    watch(count, (newVal) => {
      if (newVal < 10) {
        count.value++ // 在回调中修改自己监听的数据
      }
    })
    ```

4.  **处理异步回调的清理**：如果 `watch` 回调中包含异步操作（如定时器、订阅），应在停止监听或组件卸载前清理这些操作。
    ```javascript
    import { onUnmounted } from 'vue'

    const timer = ref(null)
    watch(someData, (newVal) => {
      if (timer.value) clearTimeout(timer.value)
      timer.value = setTimeout(() => { /* 异步操作 */ }, 500)
    })

    onUnmounted(() => {
      if (timer.value) clearTimeout(timer.value)
    })
    ```

### ⚖️ `watch` vs `computed` vs `watchEffect`

理解它们的区别有助于正确选择工具。

| 特性 | `watch` | `computed` | `watchEffect` |
| :--- | :--- | :--- | :--- |
| **目的** | 副作用（数据→操作） | 衍生数据（数据→数据） | 副作用（自动依赖追踪） |
| **缓存** | 无 | **有**（依赖不变则用缓存） | 无 |
| **立即执行** | 需配置 `immediate: true` | 是（首次访问即计算） | **是**（立即运行一次） |
| **获取旧值** | **可以** (`oldValue`) | 不适用 | **不可以** |

**简单选择指南**：
*   需要根据一些数据计算出一个新的**数据**并在模板中使用 → 优先用 `computed`。
*   需要在数据变化后执行**操作**（如请求、DOM操作），且需要知道变化前后的值 → 用 `watch`。
*   只需要在依赖变化后执行操作，不关心旧值，且希望立即执行 → 考虑用 `watchEffect`。