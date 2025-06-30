import images from './mensaImage';
// Keyword-based image map
const imageMap: Record<string, any> = images;

export function getImageForCanteen(name: string) {
  const key = name
    .replace(/^mensa/i, '')
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '_')
    .replace(/[^\w_]/g, '');

  // console.log('Generated key:', key);  // <-- for debug

  return imageMap[key] || require('@/assets/mensas/default.jpg');
}
