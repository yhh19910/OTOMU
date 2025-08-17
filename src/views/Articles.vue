<template>
  <div class="articles">
    <h2>音楽コラム</h2>
    <p class="intro">歌手與樂團的深度專欄文章，探索音樂背後的故事</p>
    
    <div class="articles-grid">
      <article v-for="article in articles" :key="article.id" class="article-card">
        <div class="article-image">
          <img :src="article.image" :alt="article.title" />
        </div>
        <div class="article-content">
          <span class="article-category">{{ article.category }}</span>
          <h3 class="article-title">{{ article.title }}</h3>
          <p class="article-excerpt">{{ article.excerpt }}</p>
          <div class="article-meta">
            <span class="article-date">{{ article.date }}</span>
            <span class="article-author">by {{ article.author }}</span>
          </div>
          <button class="read-more-btn" @click="openArticle(article)">閱讀更多</button>
        </div>
      </article>
    </div>

    <!-- 文章詳細內容模態框 -->
    <div v-if="selectedArticle" class="modal-overlay" @click="closeArticle">
      <div class="modal-content" @click.stop>
        <button class="close-btn" @click="closeArticle">&times;</button>
        <div class="modal-header">
          <img :src="selectedArticle.image" :alt="selectedArticle.title" class="modal-image" />
          <div class="modal-info">
            <span class="modal-category">{{ selectedArticle.category }}</span>
            <h2 class="modal-title">{{ selectedArticle.title }}</h2>
            <div class="modal-meta">
              <span>{{ selectedArticle.date }}</span>
              <span>by {{ selectedArticle.author }}</span>
            </div>
          </div>
        </div>
        <div class="modal-body">
          <div v-html="selectedArticle.content"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import photo1 from '../assets/專欄封面/米津.jpg';
import photo2 from '../assets/專欄封面/ONEOKROCK.jpg';
import photo3 from '../assets/專欄封面/YOASOBI.jpg';
import photo4 from '../assets/專欄封面/宇多田.jpg';

interface Article {
  id: number;
  title: string;
  excerpt: string;
  content: string;
  image: string;
  category: string;
  date: string;
  author: string;
}

const selectedArticle = ref<Article | null>(null);

const articles = ref<Article[]>([
  {
    id: 1,
    title: "米津玄師：從Vocaloid創作者到國民歌手的音樂之路",
    excerpt: "探索米津玄師如何從網路創作者蛻變為日本最具影響力的音樂人之一，他的創作理念與音樂風格演變...",
    content: `
      <p>米津玄師（Kenshi Yonezu）是當代日本音樂界最具代表性的藝術家之一。從早期的Vocaloid創作者「ハチ」（Hachi）身份，到如今成為國民級歌手，他的音樂之路充滿了創新與突破。</p>
      
      <h3>早期的Vocaloid時代</h3>
      <p>2009年，米津玄師以「ハチ」的名義開始在niconico動畫平台發表Vocaloid作品。代表作《マトリョシカ》（俄羅斯娃娃）和《パンダヒーロー》展現了他獨特的音樂風格和視覺美學。</p>
      
      <h3>音樂風格的演變</h3>
      <p>從電子音樂到流行搖滾，米津玄師的音樂風格不斷演進。他善於融合傳統日本音樂元素與現代流行音樂，創造出獨特的聲音識別。</p>
      
      <h3>視覺藝術的結合</h3>
      <p>作為一位多才多藝的藝術家，米津玄師不僅創作音樂，也親自參與MV的視覺設計。他的作品常常呈現超現實主義的美學風格。</p>
      
      <h3>社會影響力</h3>
      <p>《Lemon》、《馬と鹿》等作品不僅在音樂排行榜上取得巨大成功，更成為了日本流行文化的重要符號，影響了整個世代的音樂品味。</p>
    `,
    image: photo1,
    category: "日本音樂",
    date: "2024-01-15",
    author: "音樂編輯部"
  },
  {
    id: 2,
    title: "ONE OK ROCK：從日本走向世界的搖滾傳奇",
    excerpt: "深入了解ONE OK ROCK如何突破語言障礙，成為國際知名的日本搖滾樂團，他們的音樂理念與全球化策略...",
    content: `
      <p>ONE OK ROCK是日本最成功的國際化搖滾樂團之一。自2005年成立以來，他們不斷挑戰自我，從日本本土樂團發展為世界級的搖滾明星。</p>
      
      <h3>樂團的起源</h3>
      <p>樂團由主唱Taka（森內貴寬）、吉他手Toru、貝斯手Ryota和鼓手Tomoya組成。他們的音樂融合了另類搖滾、後硬核和流行搖滾元素。</p>
      
      <h3>音樂風格的轉變</h3>
      <p>從早期的重金屬風格到後來更加旋律化的搖滾，ONE OK ROCK的音樂演變反映了他們對不同音樂風格的探索和成熟。</p>
      
      <h3>國際化的策略</h3>
      <p>樂團積極參與國際巡演，與歐美藝術家合作，並在歌曲中融入英語歌詞，成功打入國際市場。</p>
      
      <h3>現場演出的魅力</h3>
      <p>ONE OK ROCK以其震撼的現場演出聞名，無論是在小型Live House還是大型體育場，都能帶給觀眾難忘的音樂體驗。</p>
    `,
    image: photo2,
    category: "搖滾樂團",
    date: "2024-01-10",
    author: "搖滾專欄"
  },
  {
    id: 3,
    title: "YOASOBI：二次元與現實的音樂橋樑",
    excerpt: "分析YOASOBI如何通過「小說音樂化」的概念，在動漫文化與流行音樂之間建立獨特的連結...",
    content: `
      <p>YOASOBI是由作曲家Ayase和歌手ikura組成的音樂組合，他們以「小說音樂化」的獨特概念在音樂界掀起了一股新潮流。</p>
      
      <h3>「小說音樂化」的概念</h3>
      <p>YOASOBI的每首歌曲都基於一篇小說創作，將文學作品轉化為音樂，創造了全新的跨媒體藝術形式。</p>
      
      <h3>《夜に駆ける》的現象</h3>
      <p>出道作品《夜に駆ける》不僅在日本大受歡迎，更在全球範圍內引起關注，展現了日本流行音樂的新可能性。</p>
      
      <h3>動漫文化的融合</h3>
      <p>YOASOBI的音樂風格深受動漫文化影響，他們的作品常常被用作動畫主題曲，進一步擴大了影響力。</p>
      
      <h3>數位時代的音樂傳播</h3>
      <p>通過YouTube、TikTok等平台，YOASOBI成功利用數位媒體的力量，讓他們的音樂迅速傳播到世界各地。</p>
    `,
    image: photo3,
    category: "流行音樂",
    date: "2024-01-05",
    author: "流行文化研究"
  },
  {
    id: 4,
    title: "宇多田光：跨越時代的音樂女神",
    excerpt: "回顧宇多田光從出道至今的音樂歷程，探討她如何影響了整個日本流行音樂產業的發展方向...",
    content: `
      <p>宇多田光（Utada Hikaru）是日本流行音樂史上最具影響力的藝術家之一。她的音樂不僅定義了一個時代，更持續影響著新世代的音樂創作。</p>
      
      <h3>出道的轟動</h3>
      <p>1998年，年僅15歲的宇多田光以《Automatic》出道，立即在日本音樂界引起轟動，展現了超越年齡的音樂才華。</p>
      
      <h3>音樂風格的獨特性</h3>
      <p>宇多田光的音樂融合了R&B、流行、電子等多種元素，她的歌聲既溫柔又有力，創造了獨特的音樂語言。</p>
      
      <h3>國際化的嘗試</h3>
      <p>除了在日本的成功，宇多田光也曾嘗試進軍歐美市場，雖然挑戰重重，但這些經歷豐富了她的音樂視野。</p>
      
      <h3>持續的創新</h3>
      <p>從《First Love》到近期的作品，宇多田光始終保持著創新精神，不斷探索音樂的新可能性。</p>
    `,
    image: photo4,
    category: "流行音樂",
    date: "2023-12-28",
    author: "音樂史學者"
  }
]);

const openArticle = (article: Article) => {
  selectedArticle.value = article;
  document.body.style.overflow = 'hidden'; // 防止背景滾動
};

const closeArticle = () => {
  selectedArticle.value = null;
  document.body.style.overflow = 'auto'; // 恢復滾動
};
</script>

<style scoped>
.articles {
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

.intro {
  text-align: center;
  color: #666;
  margin-bottom: 3rem;
  font-size: 1.1rem;
}

.articles-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 2rem;
  margin-bottom: 2rem;
}

.article-card {
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.article-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
}

.article-image {
  height: 200px;
  overflow: hidden;
}

.article-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.article-card:hover .article-image img {
  transform: scale(1.05);
}

.article-content {
  padding: 1.5rem;
}

.article-category {
  display: inline-block;
  background: #6C7B6A;
  color: white;
  padding: 0.3rem 0.8rem;
  border-radius: 15px;
  font-size: 0.8rem;
  margin-bottom: 1rem;
}

.article-title {
  font-size: 1.3rem;
  margin-bottom: 1rem;
  color: #333;
  line-height: 1.4;
}

.article-excerpt {
  color: #666;
  line-height: 1.6;
  margin-bottom: 1rem;
}

.article-meta {
  display: flex;
  justify-content: space-between;
  color: #999;
  font-size: 0.9rem;
  margin-bottom: 1.5rem;
}

.read-more-btn {
  background: #6C7B6A;
  color: white;
  border: none;
  padding: 0.8rem 1.5rem;
  border-radius: 25px;
  cursor: pointer;
  transition: background 0.3s ease;
  font-weight: 500;
}

.read-more-btn:hover {
  background: #3B5323;
}

/* 模態框樣式 */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  padding: 2rem;
}

.modal-content {
  background: white;
  border-radius: 12px;
  max-width: 800px;
  max-height: 90vh;
  overflow-y: auto;
  position: relative;
}

.close-btn {
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: none;
  border: none;
  font-size: 2rem;
  cursor: pointer;
  color: #666;
  z-index: 1001;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.9);
}

.close-btn:hover {
  background: rgba(255, 255, 255, 1);
  color: #333;
}

.modal-header {
  position: relative;
}

.modal-image {
  width: 100%;
  height: 300px;
  object-fit: cover;
  border-radius: 12px 12px 0 0;
}

.modal-info {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: linear-gradient(transparent, rgba(0, 0, 0, 0.8));
  color: white;
  padding: 2rem;
}

.modal-category {
  display: inline-block;
  background: #6C7B6A;
  padding: 0.3rem 0.8rem;
  border-radius: 15px;
  font-size: 0.8rem;
  margin-bottom: 1rem;
}

.modal-title {
  font-size: 1.8rem;
  margin-bottom: 0.5rem;
  line-height: 1.3;
}

.modal-meta {
  display: flex;
  gap: 1rem;
  font-size: 0.9rem;
  opacity: 0.9;
}

.modal-body {
  padding: 2rem;
  line-height: 1.8;
  color: #333;
}

.modal-body h3 {
  color: #6C7B6A;
  margin: 2rem 0 1rem 0;
  font-size: 1.3rem;
}

.modal-body p {
  margin-bottom: 1.5rem;
}

/* 響應式設計 */
@media (max-width: 768px) {
  .articles {
    padding: 1rem;
  }
  
  .articles-grid {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
  
  .modal-overlay {
    padding: 1rem;
  }
  
  .modal-content {
    max-height: 95vh;
  }
  
  .modal-info {
    padding: 1.5rem;
  }
  
  .modal-title {
    font-size: 1.5rem;
  }
  
  .modal-body {
    padding: 1.5rem;
  }
}
</style>