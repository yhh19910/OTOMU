<template>
  <div id="app">
    <header>
      <nav>
        <AnimatedNavLink to="/" text="音紡 ; OTOMU ; " :isLogo="true" :showIcon="true" />
        
        <!-- 漢堡選單按鈕 -->
        <button class="mobile-menu-toggle" @click="toggleMobileMenu" :class="{ active: isMobileMenuOpen }">
          <span class="hamburger-line"></span>
          <span class="hamburger-line"></span>
          <span class="hamburger-line"></span>
        </button>
        
        <!-- 導航連結 -->
        <div class="nav-links" :class="{ 'mobile-open': isMobileMenuOpen }">
          <AnimatedNavLink to="/" text="ホームページ" @click="closeMobileMenu" />
          <AnimatedNavLink to="/gallery" text="写真" @click="closeMobileMenu" />
          <AnimatedNavLink to="/articles" text="音楽コラム" @click="closeMobileMenu" />
          <AnimatedNavLink to="/about" text="説明" @click="closeMobileMenu" />
        </div>
        
        <!-- 遮罩層 -->
        <div class="mobile-overlay" :class="{ active: isMobileMenuOpen }" @click="closeMobileMenu"></div>
      </nav>
    </header>
    <router-view />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import AnimatedNavLink from './components/AnimatedNavLink.vue';

const isMobileMenuOpen = ref(false);

const toggleMobileMenu = () => {
  isMobileMenuOpen.value = !isMobileMenuOpen.value;
  updateBodyOverflow();
};

const closeMobileMenu = () => {
  isMobileMenuOpen.value = false;
  updateBodyOverflow();
};

const updateBodyOverflow = () => {
  if (isMobileMenuOpen.value) {
    document.body.classList.add('mobile-menu-open');
  } else {
    document.body.classList.remove('mobile-menu-open');
  }
};

// 監聽螢幕尺寸變化，大螢幕時自動關閉選單
const handleResize = () => {
  if (window.innerWidth > 768) {
    isMobileMenuOpen.value = false;
    updateBodyOverflow();
  }
};

onMounted(() => {
  window.addEventListener('resize', handleResize);
});

onUnmounted(() => {
  window.removeEventListener('resize', handleResize);
  // 清理 body class
  document.body.classList.remove('mobile-menu-open');
});
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #6C7B6A; /* Olive Green */
}

nav {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 3rem 16rem;
  position: relative;
}

.nav-links {
  display: flex;
  align-items: center;
}

/* 漢堡選單按鈕 */
.mobile-menu-toggle {
  display: none;
  flex-direction: column;
  justify-content: space-around;
  width: 30px;
  height: 30px;
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 0;
  z-index: 1001;
}

.hamburger-line {
  width: 100%;
  height: 3px;
  background-color: #6C7B6A;
  border-radius: 2px;
  transition: all 0.3s ease;
  transform-origin: center;
}

.mobile-menu-toggle.active .hamburger-line:nth-child(1) {
  transform: rotate(45deg) translate(6px, 6px);
}

.mobile-menu-toggle.active .hamburger-line:nth-child(2) {
  opacity: 0;
}

.mobile-menu-toggle.active .hamburger-line:nth-child(3) {
  transform: rotate(-45deg) translate(6px, -6px);
}

/* 遮罩層 */
.mobile-overlay {
  display: none;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  z-index: 999;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.mobile-overlay.active {
  opacity: 1;
}

/* 響應式設計 */
@media (max-width: 768px) {
  nav {
    padding: 1.5rem 2rem;
  }
  
  .mobile-menu-toggle {
    display: flex;
  }
  
  .mobile-overlay {
    display: block;
  }
  
  .nav-links {
    position: fixed;
    top: 0;
    right: -100%;
    width: 280px;
    max-width: 80vw;
    height: 100vh;
    background: #E9E3CE;
    flex-direction: column;
    justify-content: flex-start;
    align-items: flex-start;
    padding: 6rem 2rem 2rem;
    box-shadow: -5px 0 15px rgba(0, 0, 0, 0.1);
    transition: right 0.3s ease;
    z-index: 1000;
    gap: 1rem;
    overflow-x: hidden;
    overflow-y: auto;
  }
  
  .nav-links.mobile-open {
    right: 0;
  }
  
  .nav-links.mobile-open ~ .mobile-overlay {
    display: block;
  }
}

@media (max-width: 480px) {
  nav {
    padding: 1rem 1.5rem;
  }
  
  .nav-links {
    width: 250px;
    max-width: 85vw;
    padding: 5rem 1.5rem 2rem;
  }
  
}
</style>
'''
