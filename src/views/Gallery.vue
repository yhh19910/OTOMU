<script setup lang="ts">
import { ref, onMounted, computed, nextTick } from 'vue';

// 定義照片和相簿的類型
interface Photo {
  id: string;
  src: string;
  title: string;
  description: string;
  album: string;
  tags: string[];
  date: string;
}

interface Album {
  id: string;
  name: string;
  cover: string;
  description: string;
  photoCount: number;
}

// 響應式數據
const photos = ref<Photo[]>([]);
const albums = ref<Album[]>([]);
const currentView = ref<'albums' | 'photos'>('albums');
const selectedAlbum = ref<string>('all');
const selectedPhoto = ref<Photo | null>(null);
const isLightboxOpen = ref(false);
const currentPhotoIndex = ref(0);
const searchQuery = ref('');
const selectedTags = ref<string[]>([]);
const galleryRef = ref<HTMLElement>();

// 計算屬性
const filteredPhotos = computed(() => {
  let filtered = photos.value;
  
  // 按相簿篩選
  if (selectedAlbum.value !== 'all') {
    filtered = filtered.filter(photo => photo.album === selectedAlbum.value);
  }
  
  // 按搜索關鍵字篩選
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    filtered = filtered.filter(photo => 
      photo.title.toLowerCase().includes(query) ||
      photo.description.toLowerCase().includes(query) ||
      photo.tags.some(tag => tag.toLowerCase().includes(query))
    );
  }
  
  // 按標籤篩選
  if (selectedTags.value.length > 0) {
    filtered = filtered.filter(photo =>
      selectedTags.value.every(tag => photo.tags.includes(tag))
    );
  }
  
  return filtered;
});

const allTags = computed(() => {
  const tags = new Set<string>();
  photos.value.forEach(photo => {
    photo.tags.forEach(tag => tags.add(tag));
  });
  return Array.from(tags).sort();
});

// 初始化數據
onMounted(async () => {
  await initializePhotos();
  await nextTick();
  if (currentView.value === 'photos') {
    initMasonry();
  }
});

const initializePhotos = async () => {
  // 暫時直接使用備用方案，確保網站能正常運行
  await initializeFallbackPhotos();
};

// 載入相簿照片
const initializeFallbackPhotos = async () => {
  try {
    const generatedAlbums: Album[] = [];
    const generatedPhotos: Photo[] = [];
    
    // 手動掃描每個相簿文件夾（必須使用字面量路徑）
    const albumConfigs = [
      { id: 'tokyo', name: '東京' },
      { id: 'fukuoka', name: '福岡' },
      { id: 'street', name: '街拍' },
      { id: 'anime', name: '動漫' }
    ];
    
    // 東京相簿
    try {
      const tokyoModules = import.meta.glob('../assets/album/東京/*', { eager: true });
      const tokyoUrls = Object.entries(tokyoModules).map(([path, module]: [string, any]) => ({
        path,
        url: module.default
      }));
      
      if (tokyoUrls.length > 0) {
        generatedAlbums.push({
          id: 'tokyo',
          name: '東京',
          cover: tokyoUrls[0].url,
          description: '東京攝影作品集',
          photoCount: tokyoUrls.length
        });
        
        tokyoUrls.forEach((item, index) => {
          const filename = item.path.split('/').pop()?.split('.')[0] || '';
          generatedPhotos.push({
            id: `tokyo-${index}`,
            src: item.url,
            title: `東京 ${index + 1}`,
            description: `東京攝影 - ${filename}`,
            album: 'tokyo',
            tags: ['東京', '攝影', '旅行'],
            date: new Date().toISOString().split('T')[0]
          });
        });
        
        console.log(`📁 載入相簿: 東京 (${tokyoUrls.length} 張照片)`);
      }
    } catch (error) {
      console.warn('⚠️ 東京文件夾不存在或無照片');
    }
    
    // 福岡相簿
    try {
      const fukuokaModules = import.meta.glob('../assets/album/福岡/*', { eager: true });
      const fukuokaUrls = Object.entries(fukuokaModules).map(([path, module]: [string, any]) => ({
        path,
        url: module.default
      }));
      
      if (fukuokaUrls.length > 0) {
        generatedAlbums.push({
          id: 'fukuoka',
          name: '福岡',
          cover: fukuokaUrls[0].url,
          description: '福岡攝影作品集',
          photoCount: fukuokaUrls.length
        });
        
        fukuokaUrls.forEach((item, index) => {
          const filename = item.path.split('/').pop()?.split('.')[0] || '';
          generatedPhotos.push({
            id: `fukuoka-${index}`,
            src: item.url,
            title: `福岡 ${index + 1}`,
            description: `福岡攝影 - ${filename}`,
            album: 'fukuoka',
            tags: ['福岡', '攝影', '旅行'],
            date: new Date().toISOString().split('T')[0]
          });
        });
        
        console.log(`📁 載入相簿: 福岡 (${fukuokaUrls.length} 張照片)`);
      }
    } catch (error) {
      console.warn('⚠️ 福岡文件夾不存在或無照片');
    }
    
    // 街拍相簿
    try {
      const streetModules = import.meta.glob('../assets/album/街拍/*', { eager: true });
      const streetUrls = Object.entries(streetModules).map(([path, module]: [string, any]) => ({
        path,
        url: module.default
      }));
      
      if (streetUrls.length > 0) {
        generatedAlbums.push({
          id: 'street',
          name: '街拍',
          cover: streetUrls[0].url,
          description: '街拍攝影作品集',
          photoCount: streetUrls.length
        });
        
        streetUrls.forEach((item, index) => {
          const filename = item.path.split('/').pop()?.split('.')[0] || '';
          generatedPhotos.push({
            id: `street-${index}`,
            src: item.url,
            title: `街拍 ${index + 1}`,
            description: `街拍攝影 - ${filename}`,
            album: 'street',
            tags: ['街拍', '攝影', '城市'],
            date: new Date().toISOString().split('T')[0]
          });
        });
        
        console.log(`📁 載入相簿: 街拍 (${streetUrls.length} 張照片)`);
      }
    } catch (error) {
      console.warn('⚠️ 街拍文件夾不存在或無照片');
    }

    try {
      const newAlbumModules = import.meta.glob('../assets/album/動漫/*', { eager: true });
      const newAlbumUrls = Object.entries(newAlbumModules).map(([path, module]: [string, any]) => ({
        path,
        url: module.default
      }));
      
      if (newAlbumUrls.length > 0) {
        generatedAlbums.push({
          id: 'anime',
          name: '動漫',
          cover: newAlbumUrls[0].url,
          description: '動漫',
          photoCount: newAlbumUrls.length
        });
        
        newAlbumUrls.forEach((item, index) => {
          const filename = item.path.split('/').pop()?.split('.')[0] || '';
          generatedPhotos.push({
            id: `newalbum-${index}`,
            src: item.url,
            title: `動漫 ${index + 1}`,
            description: `動漫照片 - ${filename}`,
            album: 'anime',
            tags: ['動漫', 'twitter'],
            date: new Date().toISOString().split('T')[0]
          });
        });
        
        console.log(`📁 載入相簿: 動漫 (${newAlbumUrls.length} 張照片)`);
      }
    } catch (error) {
      console.warn('⚠️ 動漫文件夾不存在或無照片');
    }
    
    // 🔧 要添加第四本相簿時，在這裡添加類似的代碼塊：
    /*
    try {
      const newAlbumModules = import.meta.glob('../assets/album/新相簿/*', { eager: true });
      const newAlbumUrls = Object.entries(newAlbumModules).map(([path, module]: [string, any]) => ({
        path,
        url: module.default
      }));
      
      if (newAlbumUrls.length > 0) {
        generatedAlbums.push({
          id: 'newalbum',
          name: '新相簿',
          cover: newAlbumUrls[0].url,
          description: '新相簿攝影作品集',
          photoCount: newAlbumUrls.length
        });
        
        newAlbumUrls.forEach((item, index) => {
          const filename = item.path.split('/').pop()?.split('.')[0] || '';
          generatedPhotos.push({
            id: `newalbum-${index}`,
            src: item.url,
            title: `新相簿 ${index + 1}`,
            description: `新相簿攝影 - ${filename}`,
            album: 'newalbum',
            tags: ['新相簿', '攝影'],
            date: new Date().toISOString().split('T')[0]
          });
        });
        
        console.log(`📁 載入相簿: 新相簿 (${newAlbumUrls.length} 張照片)`);
      }
    } catch (error) {
      console.warn('⚠️ 新相簿文件夾不存在或無照片');
    }
    */
    
    // 如果沒有找到任何相簿，使用 photos 文件夾作為備用
    if (generatedAlbums.length === 0) {
      console.log('🔄 未找到 album 文件夾，使用 photos 文件夾作為備用');
      const imageModules = import.meta.glob('../assets/photos/*', { eager: true });
      const imageUrls = Object.values(imageModules).map((module: any) => module.default);
      
      if (imageUrls.length > 0) {
        generatedAlbums.push({
          id: 'photos',
          name: '攝影作品',
          cover: imageUrls[0],
          description: '攝影作品集',
          photoCount: imageUrls.length
        });
        
        generatedPhotos.push(...imageUrls.map((url, index) => ({
          id: `photo-${index}`,
          src: url,
          title: `照片 ${index + 1}`,
          description: `攝影作品`,
          album: 'photos',
          tags: ['攝影'],
          date: new Date().toISOString().split('T')[0]
        })));
      }
    }
    
    albums.value = generatedAlbums;
    photos.value = generatedPhotos;
    
    console.log(`✅ 成功載入 ${albums.value.length} 個相簿，共 ${photos.value.length} 張照片`);
    
  } catch (error) {
    console.error('❌ 載入相簿失敗:', error);
  }
};

// 瀑布流布局函數
const initMasonry = () => {
  if (!galleryRef.value) return;
  
  const container = galleryRef.value;
  const items = container.querySelectorAll('.photo-item');
  const gap = 20;
  const containerWidth = container.offsetWidth;
  const columns = Math.max(1, Math.floor((containerWidth + gap) / (320 + gap)));
  const columnWidth = (containerWidth - (columns - 1) * gap) / columns;
  const columnHeights = new Array(columns).fill(0);
  
  items.forEach((item: Element) => {
    const htmlItem = item as HTMLElement;
    const img = htmlItem.querySelector('img') as HTMLImageElement;
    
    if (!img || !img.complete) return;
    
    const shortestColumnIndex = columnHeights.indexOf(Math.min(...columnHeights));
    const imgRatio = img.naturalHeight / img.naturalWidth;
    const itemHeight = columnWidth * imgRatio + 80; // 加上標題和標籤的高度
    
    const x = shortestColumnIndex * (columnWidth + gap);
    const y = columnHeights[shortestColumnIndex];
    
    htmlItem.style.position = 'absolute';
    htmlItem.style.left = `${x}px`;
    htmlItem.style.top = `${y}px`;
    htmlItem.style.width = `${columnWidth}px`;
    htmlItem.style.transition = 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)';
    
    columnHeights[shortestColumnIndex] += itemHeight + gap;
  });
  
  const maxHeight = Math.max(...columnHeights);
  container.style.height = `${maxHeight}px`;
};

// 視圖切換函數
const showAlbums = () => {
  currentView.value = 'albums';
  selectedAlbum.value = 'all';
};

const showPhotos = (albumId: string = 'all') => {
  currentView.value = 'photos';
  selectedAlbum.value = albumId;
  nextTick(() => {
    initMasonry();
  });
};

// 燈箱功能
const openLightbox = (photo: Photo) => {
  selectedPhoto.value = photo;
  currentPhotoIndex.value = filteredPhotos.value.findIndex(p => p.id === photo.id);
  isLightboxOpen.value = true;
  document.body.style.overflow = 'hidden';
};

const closeLightbox = () => {
  isLightboxOpen.value = false;
  selectedPhoto.value = null;
  document.body.style.overflow = 'auto';
};

const nextPhoto = () => {
  if (currentPhotoIndex.value < filteredPhotos.value.length - 1) {
    currentPhotoIndex.value++;
    selectedPhoto.value = filteredPhotos.value[currentPhotoIndex.value];
  }
};

const prevPhoto = () => {
  if (currentPhotoIndex.value > 0) {
    currentPhotoIndex.value--;
    selectedPhoto.value = filteredPhotos.value[currentPhotoIndex.value];
  }
};

// 標籤篩選
const toggleTag = (tag: string) => {
  const index = selectedTags.value.indexOf(tag);
  if (index > -1) {
    selectedTags.value.splice(index, 1);
  } else {
    selectedTags.value.push(tag);
  }
  nextTick(() => {
    if (currentView.value === 'photos') {
      initMasonry();
    }
  });
};

const clearFilters = () => {
  searchQuery.value = '';
  selectedTags.value = [];
  nextTick(() => {
    if (currentView.value === 'photos') {
      initMasonry();
    }
  });
};

// 響應式處理
const handleResize = () => {
  if (currentView.value === 'photos') {
    setTimeout(initMasonry, 100);
  }
};

onMounted(() => {
  window.addEventListener('resize', handleResize);
});

// 鍵盤事件
const handleKeydown = (event: KeyboardEvent) => {
  if (!isLightboxOpen.value) return;
  
  switch (event.key) {
    case 'Escape':
      closeLightbox();
      break;
    case 'ArrowLeft':
      prevPhoto();
      break;
    case 'ArrowRight':
      nextPhoto();
      break;
  }
};

onMounted(() => {
  document.addEventListener('keydown', handleKeydown);
});
</script>

<template>
  <div class="gallery">
    <!-- 頁面標題和導航 -->
    <div class="gallery-header">
      <div class="title-section">
        <h2>{{ currentView === 'albums' ? '写真集' : (selectedAlbum === 'all' ? '所有照片' : albums.find(a => a.id === selectedAlbum)?.name || '照片') }}</h2>
        <div class="breadcrumb" v-if="currentView === 'photos'">
          <button @click="showAlbums" class="breadcrumb-link">写真集</button>
          <span class="breadcrumb-separator">></span>
          <span class="breadcrumb-current">{{ selectedAlbum === 'all' ? '所有照片' : albums.find(a => a.id === selectedAlbum)?.name }}</span>
        </div>
      </div>
      
      <!-- 視圖切換按鈕 -->
      <div class="view-controls" v-if="currentView === 'albums'">
        <button @click="showPhotos('all')" class="view-all-btn">
          查看所有照片 ({{ photos.length }})
        </button>
      </div>
    </div>

    <!-- 相簿視圖 -->
    <div v-if="currentView === 'albums'" class="albums-view">
      <div class="albums-shelf">
        <div 
          v-for="album in albums" 
          :key="album.id" 
          class="album-book"
          @click="showPhotos(album.id)"
        >
          <div class="book-spine">
            <div class="spine-text">{{ album.name }}</div>
            <div class="spine-count">{{ album.photoCount }}</div>
          </div>
          <div class="book-cover">
            <div class="cover-front">
              <img :src="album.cover" :alt="album.name" />
              <div class="cover-overlay">
                <h3 class="cover-title">{{ album.name }}</h3>
                <p class="cover-description">{{ album.description }}</p>
                <div class="cover-details">
                  <span class="photo-count">{{ album.photoCount }} 張照片</span>
                </div>
              </div>
            </div>
            <div class="cover-back"></div>
          </div>
        </div>
      </div>
    </div>

    <!-- 照片視圖 -->
    <div v-else class="photos-view">
      <!-- 搜索和篩選控制 -->
      <div class="filters-section">
        <div class="search-box">
          <input 
            v-model="searchQuery" 
            type="text" 
            placeholder="搜索照片..." 
            class="search-input"
            @input="nextTick(() => initMasonry())"
          />
        </div>
        
        <div class="tags-filter">
          <div class="tags-list">
            <button 
              v-for="tag in allTags" 
              :key="tag"
              @click="toggleTag(tag)"
              :class="['tag-btn', { active: selectedTags.includes(tag) }]"
            >
              {{ tag }}
            </button>
          </div>
          <button v-if="searchQuery || selectedTags.length > 0" @click="clearFilters" class="clear-filters-btn">
            清除篩選
          </button>
        </div>
      </div>

      <!-- 照片網格 -->
      <div class="photos-container">
        <div class="photos-stats">
          <span>顯示 {{ filteredPhotos.length }} / {{ photos.length }} 張照片</span>
        </div>
        
        <div ref="galleryRef" class="photo-grid masonry">
          <div 
            v-for="photo in filteredPhotos" 
            :key="photo.id" 
            class="photo-item"
            @click="openLightbox(photo)"
          >
            <div class="photo-image">
              <img :src="photo.src" :alt="photo.title" @load="initMasonry" />
              <div class="photo-overlay">
                <div class="photo-actions">
                  <button class="action-btn zoom-btn">🔍</button>
                </div>
              </div>
            </div>
            <div class="photo-info">
              <h4 class="photo-title">{{ photo.title }}</h4>
              <div class="photo-tags">
                <span v-for="tag in photo.tags" :key="tag" class="photo-tag">{{ tag }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 燈箱 (Lightbox) -->
    <div v-if="isLightboxOpen && selectedPhoto" class="lightbox-overlay" @click="closeLightbox">
      <div class="lightbox-container" @click.stop>
        <!-- 關閉按鈕 -->
        <button class="lightbox-close" @click="closeLightbox">&times;</button>
        
        <!-- 導航按鈕 -->
        <button 
          v-if="currentPhotoIndex > 0" 
          class="lightbox-nav lightbox-prev" 
          @click="prevPhoto"
        >
          &#8249;
        </button>
        <button 
          v-if="currentPhotoIndex < filteredPhotos.length - 1" 
          class="lightbox-nav lightbox-next" 
          @click="nextPhoto"
        >
          &#8250;
        </button>
        
        <!-- 照片內容 -->
        <div class="lightbox-content">
          <div class="lightbox-image">
            <img :src="selectedPhoto.src" :alt="selectedPhoto.title" />
          </div>
          <div class="lightbox-info">
            <h3>{{ selectedPhoto.title }}</h3>
            <p>{{ selectedPhoto.description }}</p>
            <div class="lightbox-meta">
              <div class="lightbox-tags">
                <span v-for="tag in selectedPhoto.tags" :key="tag" class="lightbox-tag">{{ tag }}</span>
              </div>
              <div class="lightbox-date">{{ selectedPhoto.date }}</div>
            </div>
            <div class="lightbox-counter">
              {{ currentPhotoIndex + 1 }} / {{ filteredPhotos.length }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.gallery {
  padding: 2rem;
  max-width: 1400px;
  margin: 0 auto;
}

/* 頁面標題和導航 */
.gallery-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  padding-bottom: 1rem;
  border-bottom: 2px solid #e0e0e0;
}

.title-section h2 {
  margin: 0 0 0.5rem 0;
  color: #6C7B6A;
  font-size: 2rem;
}

.breadcrumb {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #666;
}

.breadcrumb-link {
  background: none;
  border: none;
  color: #6C7B6A;
  cursor: pointer;
  text-decoration: underline;
  font-size: 1rem;
}

.breadcrumb-link:hover {
  color: #3B5323;
}

.breadcrumb-separator {
  color: #999;
}

.breadcrumb-current {
  color: #333;
  font-weight: 500;
}

.view-all-btn {
  background: #6C7B6A;
  color: white;
  border: none;
  padding: 0.8rem 1.5rem;
  border-radius: 25px;
  cursor: pointer;
  font-weight: 500;
  transition: background 0.3s ease;
}

.view-all-btn:hover {
  background: #3B5323;
}

/* 相簿書架 */
.albums-shelf {
  display: flex;
  flex-wrap: wrap;
  gap: 3rem;
  padding: 3rem 0;
  justify-content: center;
  perspective: 1000px;
}

.album-book {
  position: relative;
  width: 280px;
  height: 350px;
  cursor: pointer;
  transition: all 0.3s ease;
  border-radius: 8px;
  overflow: hidden;
  background: #ffffff;
  border: 1px solid #e0e0e0;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.album-book:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
  border-color: #6C7B6A;
}

.book-spine {
  display: none;
}

.spine-text {
  writing-mode: vertical-rl;
  text-orientation: mixed;
  color: #FFD700;
  font-weight: bold;
  font-size: 0.9rem;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.5);
  flex: 1;
  display: flex;
  align-items: center;
}

.spine-count {
  color: #FFD700;
  font-size: 0.8rem;
  font-weight: bold;
  background: rgba(0, 0, 0, 0.3);
  padding: 0.2rem 0.4rem;
  border-radius: 4px;
}

.book-cover {
  position: relative;
  width: 100%;
  height: 100%;
}

.cover-front {
  position: relative;
  width: 100%;
  height: 100%;
  background: white;
  overflow: hidden;
}

.cover-front img {
  width: 100%;
  height: 70%;
  object-fit: cover;
}

.cover-overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 30%;
  background: #6C7B6A;
  color: white;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.cover-title {
  margin: 0 0 0.5rem 0;
  font-size: 1.2rem;
  font-weight: bold;
}

.cover-description {
  margin: 0 0 0.5rem 0;
  font-size: 0.85rem;
  opacity: 0.9;
  line-height: 1.3;
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

.cover-details {
  margin-top: auto;
}

.photo-count {
  background: rgba(255, 255, 255, 0.2);
  padding: 0.3rem 0.8rem;
  border-radius: 4px;
  font-size: 0.8rem;
  font-weight: 500;
}

.cover-back {
  display: none;
}

/* 移除書本紋理效果 */

/* 書本陰影效果 */
.album-book::after {
  content: '';
  position: absolute;
  bottom: -10px;
  left: 10px;
  right: 10px;
  height: 20px;
  background: radial-gradient(ellipse, rgba(0, 0, 0, 0.3), transparent);
  transform: rotateX(90deg);
  z-index: -1;
}

/* 照片視圖 */
.filters-section {
  background: white;
  padding: 1.5rem;
  border-radius: 12px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  margin-bottom: 2rem;
}

.search-box {
  margin-bottom: 1rem;
}

.search-input {
  width: 100%;
  padding: 0.8rem 1rem;
  border: 2px solid #e0e0e0;
  border-radius: 25px;
  font-size: 1rem;
  transition: border-color 0.3s ease;
}

.search-input:focus {
  outline: none;
  border-color: #6C7B6A;
}

.tags-filter {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
}

.tags-list {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.tag-btn {
  background: #f5f5f5;
  border: 2px solid #e0e0e0;
  color: #666;
  padding: 0.4rem 0.8rem;
  border-radius: 15px;
  cursor: pointer;
  font-size: 0.9rem;
  transition: all 0.3s ease;
}

.tag-btn:hover {
  border-color: #6C7B6A;
  color: #6C7B6A;
}

.tag-btn.active {
  background: #6C7B6A;
  border-color: #6C7B6A;
  color: white;
}

.clear-filters-btn {
  background: #ff6b6b;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 15px;
  cursor: pointer;
  font-size: 0.9rem;
  transition: background 0.3s ease;
}

.clear-filters-btn:hover {
  background: #ff5252;
}

.photos-container {
  position: relative;
}

.photos-stats {
  margin-bottom: 1rem;
  color: #666;
  font-size: 0.9rem;
}

/* 瀑布流照片網格 */
.photo-grid.masonry {
  position: relative;
  width: 100%;
}

.photo-item {
  position: absolute;
  cursor: pointer;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  background: white;
}

.photo-item:hover {
  transform: translateY(-8px) scale(1.02);
  box-shadow: 0 15px 30px rgba(0, 0, 0, 0.2);
  z-index: 10;
}

.photo-image {
  position: relative;
  overflow: hidden;
}

.photo-image img {
  width: 100%;
  height: auto;
  display: block;
  transition: transform 0.3s ease;
}

.photo-item:hover .photo-image img {
  transform: scale(1.05);
}

.photo-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.photo-item:hover .photo-overlay {
  opacity: 1;
}

.photo-actions {
  display: flex;
  gap: 0.5rem;
}

.action-btn {
  background: rgba(255, 255, 255, 0.9);
  border: none;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  cursor: pointer;
  font-size: 1.2rem;
  transition: all 0.3s ease;
}

.action-btn:hover {
  background: white;
  transform: scale(1.1);
}

.photo-info {
  padding: 1rem;
}

.photo-title {
  margin: 0 0 0.5rem 0;
  font-size: 1rem;
  color: #333;
  font-weight: 500;
}

.photo-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.3rem;
}

.photo-tag {
  background: #f0f0f0;
  color: #666;
  padding: 0.2rem 0.5rem;
  border-radius: 10px;
  font-size: 0.8rem;
}

/* 燈箱樣式 */
.lightbox-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.9);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 2rem;
}

.lightbox-container {
  position: relative;
  max-width: 90vw;
  max-height: 90vh;
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
}

.lightbox-close {
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: rgba(0, 0, 0, 0.7);
  color: white;
  border: none;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  cursor: pointer;
  font-size: 1.5rem;
  z-index: 1001;
  transition: background 0.3s ease;
}

.lightbox-close:hover {
  background: rgba(0, 0, 0, 0.9);
}

.lightbox-nav {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background: rgba(0, 0, 0, 0.7);
  color: white;
  border: none;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  cursor: pointer;
  font-size: 1.5rem;
  z-index: 1001;
  transition: all 0.3s ease;
}

.lightbox-nav:hover {
  background: rgba(0, 0, 0, 0.9);
  transform: translateY(-50%) scale(1.1);
}

.lightbox-prev {
  left: 1rem;
}

.lightbox-next {
  right: 1rem;
}

.lightbox-content {
  display: flex;
  max-height: 90vh;
}

.lightbox-image {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f5f5f5;
}

.lightbox-image img {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
}

.lightbox-info {
  width: 300px;
  padding: 2rem;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.lightbox-info h3 {
  margin: 0 0 1rem 0;
  color: #333;
  font-size: 1.3rem;
}

.lightbox-info p {
  color: #666;
  line-height: 1.6;
  margin-bottom: 1.5rem;
}

.lightbox-meta {
  margin-bottom: 1rem;
}

.lightbox-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.3rem;
  margin-bottom: 1rem;
}

.lightbox-tag {
  background: #6C7B6A;
  color: white;
  padding: 0.3rem 0.6rem;
  border-radius: 12px;
  font-size: 0.8rem;
}

.lightbox-date {
  color: #999;
  font-size: 0.9rem;
}

.lightbox-counter {
  background: #f0f0f0;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  text-align: center;
  color: #666;
  font-weight: 500;
}

/* 響應式設計 */
@media (max-width: 768px) {
  .gallery {
    padding: 1rem;
  }
  
  .gallery-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }
  
  .albums-shelf {
    gap: 2rem;
    padding: 2rem 0;
  }
  
  .album-book {
    width: 250px;
    height: 300px;
  }
  
  .album-book:hover {
    transform: rotateY(-10deg) translateY(-5px);
  }
  
  .tags-filter {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .lightbox-content {
    flex-direction: column;
  }
  
  .lightbox-info {
    width: 100%;
  }
  
  .lightbox-nav {
    width: 40px;
    height: 40px;
    font-size: 1.2rem;
  }
}

@media (max-width: 480px) {
  .lightbox-overlay {
    padding: 1rem;
  }
  
  .lightbox-container {
    max-width: 95vw;
    max-height: 95vh;
  }
}
</style>