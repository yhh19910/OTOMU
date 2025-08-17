<template>
  <router-link :to="to" :class="['animated-nav-link', { 'logo': isLogo }]">
    <img v-if="showIcon && isLogo" src="/icon.png" alt="OTOMU Icon" class="nav-icon" />
    <span 
      v-for="(char, index) in characters" 
      :key="index" 
      :class="['char', { 'space': char === ' ' }]"
    >
      {{ char === ' ' ? '\u00A0' : char }}
    </span>
  </router-link>
</template>

<script setup lang="ts">
import { computed } from 'vue';

interface Props {
  to: string;
  text: string;
  isLogo?: boolean;
  showIcon?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  isLogo: false,
  showIcon: false
});

const characters = computed(() => {
  return props.text.split('');
});
</script>

<style scoped>
.animated-nav-link {
  font-weight: bold;
  color: #6C7B6A;
  text-decoration: none;
  transition: all 0.3s ease;
  display: inline-block;
  position: relative;
}

.nav-icon {
  width: 2.8rem;
  height: 2.8rem;
  margin-right: 0.5rem;
  vertical-align: middle;
  display: inline-block;
}

.animated-nav-link.logo {
  font-size: 1.5rem;
  display: flex;
  align-items: center;
}

.animated-nav-link:not(.logo) {
  margin-left: 2rem;
}

/* 手機選單中的樣式 */
@media (max-width: 768px) {
  .animated-nav-link:not(.logo) {
    margin-left: 0;
    margin-bottom: 0.5rem;
    padding: 0.8rem 1rem;
    width: 100%;
    border-radius: 8px;
    transition: all 0.3s ease;
  }
  
  .animated-nav-link:not(.logo):hover {
    background: rgba(85, 107, 47, 0.1);
    transform: translateX(5px);
  }
  
  .animated-nav-link.router-link-exact-active:not(.logo) {
    background: rgba(85, 107, 47, 0.15);
    border-left: 4px solid #6C7B6A;
  }
}

.char {
  display: inline-block;
  transition: all 0.3s ease;
  position: relative;
}

.char.space {
  width: 0.3em;
}

/* 非 logo 的 hover 效果 */
.animated-nav-link:not(.logo):hover .char {
  animation: charBounce 0.6s ease-in-out;
  color: #e69b19;
}

/* logo 的 hover 效果 - 不變色，不動畫 */
.animated-nav-link.logo:hover .char {
  color: #6C7B6A; /* 保持原色 */
}

.animated-nav-link.router-link-exact-active {
  color: #e69b19;
}

.animated-nav-link.router-link-exact-active .char {
  color: #e69b19;
}

/* logo 在 active 狀態下也保持原色 */
.animated-nav-link.logo.router-link-exact-active {
  color: #6C7B6A;
}

.animated-nav-link.logo.router-link-exact-active .char {
  color: #6C7B6A;
}

@keyframes charBounce {
  0%, 20%, 60%, 100% {
    transform: translateY(0);
  }
  40% {
    transform: translateY(-8px);
  }
  80% {
    transform: translateY(-4px);
  }
}

/* 動態生成延遲效果，支持任意長度的文字 - 僅適用於非 logo */
.animated-nav-link:not(.logo):hover .char:nth-child(1) { animation-delay: 0s; }
.animated-nav-link:not(.logo):hover .char:nth-child(2) { animation-delay: 0.05s; }
.animated-nav-link:not(.logo):hover .char:nth-child(3) { animation-delay: 0.1s; }
.animated-nav-link:not(.logo):hover .char:nth-child(4) { animation-delay: 0.15s; }
.animated-nav-link:not(.logo):hover .char:nth-child(5) { animation-delay: 0.2s; }
.animated-nav-link:not(.logo):hover .char:nth-child(6) { animation-delay: 0.25s; }
.animated-nav-link:not(.logo):hover .char:nth-child(7) { animation-delay: 0.3s; }
.animated-nav-link:not(.logo):hover .char:nth-child(8) { animation-delay: 0.35s; }
.animated-nav-link:not(.logo):hover .char:nth-child(9) { animation-delay: 0.4s; }
.animated-nav-link:not(.logo):hover .char:nth-child(10) { animation-delay: 0.45s; }
.animated-nav-link:not(.logo):hover .char:nth-child(11) { animation-delay: 0.5s; }
.animated-nav-link:not(.logo):hover .char:nth-child(12) { animation-delay: 0.55s; }
.animated-nav-link:not(.logo):hover .char:nth-child(13) { animation-delay: 0.6s; }
.animated-nav-link:not(.logo):hover .char:nth-child(14) { animation-delay: 0.65s; }
.animated-nav-link:not(.logo):hover .char:nth-child(15) { animation-delay: 0.7s; }
.animated-nav-link:not(.logo):hover .char:nth-child(16) { animation-delay: 0.75s; }
.animated-nav-link:not(.logo):hover .char:nth-child(17) { animation-delay: 0.8s; }
.animated-nav-link:not(.logo):hover .char:nth-child(18) { animation-delay: 0.85s; }
.animated-nav-link:not(.logo):hover .char:nth-child(19) { animation-delay: 0.9s; }
.animated-nav-link:not(.logo):hover .char:nth-child(20) { animation-delay: 0.95s; }
</style>