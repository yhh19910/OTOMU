import { createRouter, createWebHistory } from 'vue-router';
import Home from '../views/Home.vue';
import Gallery from '../views/Gallery.vue';
import About from '../views/About.vue';
import Articles from '../views/Articles.vue';

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
  },
  {
    path: '/gallery',
    name: 'Gallery',
    component: Gallery,
  },
  {
    path: '/articles',
    name: 'Articles',
    component: Articles,
  },
  {
    path: '/about',
    name: 'About',
    component: About,
  },
];

const router = createRouter({
  history: createWebHistory('/OTOMU/'),
  routes,
});

export default router;