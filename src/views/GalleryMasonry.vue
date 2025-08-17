'''<script setup lang="ts">
import { ref, onMounted, nextTick } from 'vue';

// 使用 import.meta.glob 取得所有圖片
const imageModules = import.meta.glob('../assets/photos/*', { eager: true });

// 建立一個 ref 來存放圖片的路徑
const images = ref<string[]>([]);
const galleryRef = ref<HTMLElement>();

onMounted(async () => {
  // 將圖片模組轉換為可用的 URL 路徑陣列
  images.value = Object.values(imageModules).map((module: any) => module.default);
  
  // 等待DOM更新後初始化瀑布流
  await nextTick();
  initMasonry();
});

const initMasonry = () => {
  if (!galleryRef.value) return;
  
  const items = galleryRef.value.querySelectorAll('.photo-item');
  const gap = 24; // 1.5rem = 24px
  const columnWidth = 300;
  const containerWidth = galleryRef.value.offsetWidth;
  const columns = Math.floor(containerWidth / (columnWidth + gap));
  
  // 初始化每列的高度
  const columnHeights = new Array(columns).fill(0);
  
  items.forEach((item: Element, index: number) => {
    const htmlItem = item as HTMLElement;
    
    // 找到最短的列
    const shortestColumnIndex = columnHeights.indexOf(Math.min(...columnHeights));
    
    // 計算位置
    const x = shortestColumnIndex * (columnWidth + gap);
    const y = columnHeights[shortestColumnIndex];
    
    // 設置位置
    htmlItem.style.position = 'absolute';
    htmlItem.style.left = `${x}px`;
    htmlItem.style.top = `${y}px`;
    htmlItem.style.width = `${columnWidth}px`;
    
    // 更新該列的高度
    columnHeights[shortestColumnIndex] += htmlItem.offsetHeight + gap;
  });
  
  // 設置容器高度
  const maxHeight = Math.max(...columnHeights);
  galleryRef.value.style.height = `${maxHeight}px`;
};

// 監聽窗口大小變化
const handleResize = () => {
  setTimeout(initMasonry, 100);
};

onMounted(() => {
  window.addEventListener('resize', handleResize);
});
</script>

<template>
  <div class="gallery">
    <h2>写真</h2>
    <div class="photo-grid masonry" ref="galleryRef">
      <div v-for="(image, index) in images" :key="index" class="photo-item">
        <img :src="image" :alt="`Photo ${index + 1}`" @load="initMasonry" />
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

.photo-grid.masonry {
  position: relative;
  width: 100%;
}

.photo-item {
  display: block;
  margin-bottom: 1.5rem;
  break-inside: avoid;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.photo-item img {
  width: 100%;
  height: auto; /* 保持原始比例 */
  border-radius: 8px;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  display: block;
}

.photo-item:hover {
  transform: translateY(-5px);
}

.photo-item img:hover {
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
}

/* 響應式設計 */
@media (max-width: 768px) {
  .gallery {
    padding: 1rem;
  }
  
  .photo-grid.masonry {
    column-count: 1;
  }
}

@media (min-width: 769px) and (max-width: 1024px) {
  .photo-grid.masonry {
    column-count: 2;
  }
}

@media (min-width: 1025px) {
  .photo-grid.masonry {
    column-count: 3;
  }
}
</style>
'''