// 動態相簿生成器
export interface Album {
  id: string;
  name: string;
  cover: string;
  description: string;
  photoCount: number;
  folderPath: string;
}

export interface Photo {
  id: string;
  src: string;
  title: string;
  description: string;
  album: string;
  tags: string[];
  date: string;
}

// 自動掃描 assets 中的相簿文件夾
export async function generateAlbumsFromAssets(): Promise<{ albums: Album[], photos: Photo[] }> {
  const albums: Album[] = [];
  const photos: Photo[] = [];

  try {
    // 掃描 photos 文件夾
    const photoModules = import.meta.glob('../assets/photos/*', { eager: true });
    const photoUrls = Object.entries(photoModules).map(([path, module]: [string, any]) => ({
      path,
      url: module.default
    }));

    if (photoUrls.length > 0) {
      // 創建主要照片相簿
      albums.push({
        id: 'photos',
        name: '攝影作品',
        cover: photoUrls[0].url,
        description: '精選攝影作品集',
        photoCount: photoUrls.length,
        folderPath: 'photos'
      });

      // 生成照片數據
      photoUrls.forEach((item, index) => {
        const filename = item.path.split('/').pop()?.split('.')[0] || '';
        photos.push({
          id: `photo-${index}`,
          src: item.url,
          title: `照片 ${index + 1}`,
          description: `攝影作品 - ${filename}`,
          album: 'photos',
          tags: ['攝影', '作品'],
          date: new Date().toISOString().split('T')[0]
        });
      });
    }

    // 掃描專欄封面文件夾
    const columnModules = import.meta.glob('../assets/專欄封面/*', { eager: true });
    const columnUrls = Object.entries(columnModules).map(([path, module]: [string, any]) => ({
      path,
      url: module.default
    }));

    if (columnUrls.length > 0) {
      albums.push({
        id: 'columns',
        name: '音樂專欄封面',
        cover: columnUrls[0].url,
        description: '音樂專欄封面設計',
        photoCount: columnUrls.length,
        folderPath: '專欄封面'
      });

      // 生成專欄封面數據
      columnUrls.forEach((item, index) => {
        const filename = item.path.split('/').pop()?.split('.')[0] || '';
        photos.push({
          id: `column-${index}`,
          src: item.url,
          title: getColumnTitle(filename),
          description: `音樂專欄封面 - ${filename}`,
          album: 'columns',
          tags: ['設計', '音樂', '封面'],
          date: new Date().toISOString().split('T')[0]
        });
      });
    }

    // 自動掃描其他可能的文件夾
    await scanForAdditionalAlbums(albums, photos);

  } catch (error) {
    console.warn('掃描相簿時發生錯誤:', error);
  }

  return { albums, photos };
}

// 根據檔名推測專欄標題
function getColumnTitle(filename: string): string {
  const titleMap: { [key: string]: string } = {
    'ONEOKROCK': 'ONE OK ROCK',
    'YOASOBI': 'YOASOBI',
    '宇多田': '宇多田光',
    '米津': '米津玄師'
  };

  for (const [key, title] of Object.entries(titleMap)) {
    if (filename.includes(key)) {
      return title;
    }
  }

  return filename;
}

// 掃描其他可能的相簿文件夾
async function scanForAdditionalAlbums(albums: Album[], photos: Photo[]): Promise<void> {
  // 這裡可以添加更多文件夾的掃描邏輯
  // 例如：風景、人像、街拍等分類文件夾
  
  const additionalFolders = [
    { path: '../assets/landscape/*', name: '風景攝影', tags: ['風景', '自然'] },
    { path: '../assets/portrait/*', name: '人像攝影', tags: ['人像', '肖像'] },
    { path: '../assets/street/*', name: '街拍攝影', tags: ['街拍', '城市'] },
    { path: '../assets/nature/*', name: '自然攝影', tags: ['自然', '生態'] },
    { path: '../assets/art/*', name: '藝術攝影', tags: ['藝術', '創意'] }
  ];

  for (const folder of additionalFolders) {
    try {
      const modules = import.meta.glob(folder.path, { eager: true });
      const urls = Object.entries(modules).map(([path, module]: [string, any]) => ({
        path,
        url: module.default
      }));

      if (urls.length > 0) {
        const folderId = folder.path.split('/').pop()?.replace('/*', '') || '';
        
        albums.push({
          id: folderId,
          name: folder.name,
          cover: urls[0].url,
          description: `${folder.name}作品集`,
          photoCount: urls.length,
          folderPath: folderId
        });

        urls.forEach((item, index) => {
          const filename = item.path.split('/').pop()?.split('.')[0] || '';
          photos.push({
            id: `${folderId}-${index}`,
            src: item.url,
            title: `${folder.name} ${index + 1}`,
            description: `${folder.name} - ${filename}`,
            album: folderId,
            tags: folder.tags,
            date: new Date().toISOString().split('T')[0]
          });
        });
      }
    } catch (error) {
      // 文件夾不存在，跳過
      continue;
    }
  }
}