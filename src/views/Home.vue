'''
'''<template>
  <div class="home">
    <div class="hero-overlay">
      <div class="hero-content">
        <h1 class="brand-title">
          <img src="/icon.png" alt="OTOMU Icon" class="brand-icon" />
          <span v-for="(char, index) in brandChars" :key="index" class="brand-char">
            {{ char }}
          </span>
        </h1>
        <p class="brand-subtitle">音楽と写真の織りなす世界</p>
        <div class="welcome-buttons">
          <router-link to="/gallery" class="cta-button gallery-btn">
            <span class="btn-text">写真を見る</span>
            <span class="btn-icon">📸</span>
          </router-link>
          <router-link to="/articles" class="cta-button articles-btn">
            <span class="btn-text">音楽コラム</span>
            <span class="btn-icon">🎵</span>
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';

const brandText = '音紡 ; OTOMU ; ';
const brandChars = computed(() => brandText.split(''));

// 動畫控制
const isLoaded = ref(false);

onMounted(() => {
  setTimeout(() => {
    isLoaded.value = true;
  }, 100);
});
</script>

<style scoped>
.home {
  height: calc(100vh - 120px); /* Full height minus nav */
  background-image: url('../assets/bg/home-bg.jpg');
  background-size: cover; /* Fill the entire container */
  background-repeat: no-repeat;
  background-position: center;
  background-attachment: fixed; /* Parallax effect */
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}

.hero-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(
    135deg,
    rgba(85, 107, 47, 0.7) 0%,
    rgba(233, 227, 206, 0.8) 50%,
    rgba(85, 107, 47, 0.6) 100%
  );
  display: flex;
  align-items: center;
  justify-content: center;
}

.hero-content {
  text-align: center;
  color: white;
  z-index: 2;
  max-width: 600px;
  padding: 2rem;
  animation: fadeInUp 1.2s ease-out;
}

.brand-title {
  font-size: 3.5rem;
  font-weight: bold;
  text-shadow: none;
  line-height: 1.2;
  margin: 0 0 1rem 0;
  color: #6C7B6A;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.brand-icon {
  width: 5.5rem;
  height: 5.5rem;
  margin-right: 1rem;
  flex-shrink: 0;
}

.brand-char {
  display: inline-block;
}

.brand-subtitle {
  font-size: 1.3rem;
  margin-bottom: 2.5rem;
  color: #6C7B6A;
  font-weight: 300;
  letter-spacing: 2px;
  animation: fadeInUp 1s ease-out 0.5s both;
  text-align: center;
}

.welcome-buttons {
  display: flex;
  gap: 1.5rem;
  justify-content: center;
  flex-wrap: wrap;
}

.cta-button {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 1rem 2rem;
  background: rgba(255, 255, 255, 0.1);
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 50px;
  color: white;
  text-decoration: none;
  font-weight: 600;
  font-size: 1.1rem;
  transition: all 0.4s ease;
  backdrop-filter: blur(10px);
  position: relative;
  overflow: hidden;
  animation: slideInUp 0.8s ease-out both;
}

.gallery-btn {
  animation-delay: 0.8s;
}

.articles-btn {
  animation-delay: 1s;
}

.cta-button::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
  transition: left 0.5s ease;
}

.cta-button:hover::before {
  left: 100%;
}

.cta-button:hover {
  transform: translateY(-3px);
  background: rgba(255, 255, 255, 0.2);
  border-color: rgba(255, 255, 255, 0.6);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.3);
}

.btn-icon {
  font-size: 1.2rem;
  transition: transform 0.3s ease;
}

.cta-button:hover .btn-icon {
  transform: scale(1.2) rotate(10deg);
}

/* 動畫定義 */
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

@keyframes slideInUp {
  from {
    opacity: 0;
    transform: translateY(50px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}


/* 響應式設計 */
@media (max-width: 768px) {
  .brand-title {
    font-size: 2.5rem;
  }
  
  .brand-subtitle {
    font-size: 1.1rem;
    margin-bottom: 2rem;
  }
  
  .welcome-buttons {
    flex-direction: column;
    align-items: center;
  }
  
  .cta-button {
    width: 200px;
    justify-content: center;
  }
  
  .hero-content {
    padding: 1rem;
  }
}

@media (max-width: 480px) {
  .brand-title {
    font-size: 2rem;
  }
  
  .brand-subtitle {
    font-size: 1rem;
  }
  
  .cta-button {
    padding: 0.8rem 1.5rem;
    font-size: 1rem;
  }
}
</style>
'''
'''