'''<script setup lang="ts">
import { ref, onMounted, nextTick, onUnmounted } from 'vue';

// 使用 import.meta.glob 取得所有圖片
const imageModules = import.meta.glob('../assets/photos/*', { eager: true });

// 建立一個 ref 來存放圖片的路徑
const images = ref<string[]>([]);
const galleryRef = ref<HTMLElement>();
const isLoading = ref(true);

onMounted(async () => {
  // 將圖片模組轉換為可用的 URL 路徑陣列
  images.value = Object.values(imageModules).map((module: any) => module.default);
  
  // 等待DOM更新後初始化瀑布流
  await nextTick();
  setTimeout(() => {
    initMasonry();
    isLoading.value = false;
  }, 100);
  
  // 監聽窗口大小變化
  window.addEventListener('resize', handleResize);
});

onUnmounted(() => {
  window.removeEventListener('resize', handleResize);
});

const initMasonry = () => {
  if (!galleryRef.value) return;
  
  const container = galleryRef.value;
  const items = container.querySelectorAll('.photo-item');
  const gap = 24; // 1.5rem = 24px
  const containerWidth = container.offsetWidth;
  
  // 計算列數和列寬
  const minColumnWidth = 300;
  const columns = Math.max(1, Math.floor((containerWidth + gap) / (minColumnWidth + gap)));
  const columnWidth = (containerWidth - (columns - 1) * gap) / columns;
  
  // 初始化每列的高度
  const columnHeights = new Array(columns).fill(0);
  
  items.forEach((item: Element) => {
    const htmlItem = item as HTMLElement;
    const img = htmlItem.querySelector('img') as HTMLImageElement;
    
    if (!img || !img.complete) return;
    
    // 找到最短的列
    const shortestColumnIndex = columnHeights.indexOf(Math.min(...columnHeights));
    
    // 計算圖片高度（保持比例）
    const imgRatio = img.naturalHeight / img.naturalWidth;
    const itemHeight = columnWidth * imgRatio;
    
    // 計算位置
    const x = shortestColumnIndex * (columnWidth + gap);
    const y = columnHeights[shortestColumnIndex];
    
    // 設置位置和尺寸
    htmlItem.style.position = 'absolute';
    htmlItem.style.left = `${x}px`;
    htmlItem.style.top = `${y}px`;
    htmlItem.style.width = `${columnWidth}px`;
    htmlItem.style.transition = 'all 0.3s ease';
    
    // 更新該列的高度
    columnHeights[shortestColumnIndex] += itemHeight + gap;
  });
  
  // 設置容器高度
  const maxHeight = Math.max(...columnHeights);
  container.style.height = `${maxHeight}px`;
};

const handleImageLoad = () => {
  initMasonry();
};

const handleResize = () => {
  setTimeout(initMasonry, 100);
};
</script>

<template>
  <div class="gallery">
    <h2>写真</h2>
    
    <!-- 載入指示器 -->
    <div v-if="isLoading" class="loading">
      <div class="spinner"></div>
      <p>載入照片中...</p>
    </div>
    
    <div 
      v-show="!isLoading"
      class="photo-grid masonry" 
      ref="galleryRef"
    >
      <div 
        v-for="(image, index) in images" 
        :key="index" 
        class="photo-item"
      >
        <img 
          :src="image" 
          :alt="`Photo ${index + 1}`" 
          @load="handleImageLoad"
          loading="lazy"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
.gallery {
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

.loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem 2rem;
  color: #6C7B6A;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #e0e0e0;
  border-top: 4px solid #6C7B6A;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 1rem;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.photo-grid.masonry {
  position: relative;
  width: 100%;
  min-height: 400px;
}

.photo-item {
  display: block;
  cursor: pointer;
  overflow: hidden;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.photo-item:hover {
  transform: translateY(-8px) scale(1.02);
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.15);
  z-index: 10;
}

.photo-item img {
  width: 100%;
  height: auto;
  display: block;
  transition: transform 0.3s ease;
}

.photo-item:hover img {
  transform: scale(1.05);
}

/* 響應式設計 */
@media (max-width: 768px) {
  .gallery {
    padding: 1rem;
  }
}

/* 載入動畫 */
.photo-item {
  opacity: 0;
  animation: fadeInUp 0.6s ease forwards;
}

.photo-item:nth-child(1) { animation-delay: 0.1s; }
.photo-item:nth-child(2) { animation-delay: 0.2s; }
.photo-item:nth-child(3) { animation-delay: 0.3s; }
.photo-item:nth-child(4) { animation-delay: 0.4s; }
.photo-item:nth-child(5) { animation-delay: 0.5s; }
.photo-item:nth-child(6) { animation-delay: 0.6s; }

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
'''