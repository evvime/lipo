const https = require('https');
const urls = [
  'https://www.trendyol.com/wellnur/mayo-tipi-liposuction-korsesi-ameliyat-sonrasi-yuksek-kompresyonlu-gogus-alti-toparlayici-p-1030666986?merchantId=1027464',
  'https://www.trendyol.com/wellnur/post-op-sutyen-ameliyat-sonrasi-sutyen-estetik-sonrasi-meme-ameliyati-korse-p-1034443198?merchantId=1027464',
  'https://www.trendyol.com/wellnur/bbl-ameliyat-sonrasi-diz-ustu-korse-yuksek-kompresyonlu-hizli-toparlanma-ve-sekillendirici-etki-p-1034283443?merchantId=1027464',
  'https://www.trendyol.com/wellnur/bbl-ameliyat-sonrasi-popo-yastigi-brezilya-popo-kaldirma-bbl-iyilesme-yastigi-p-863332672?merchantId=1027464'
];

async function fetchHtml(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(data));
    }).on('error', reject);
  });
}

async function run() {
  for (let url of urls) {
    console.log('---', url, '---');
    const html = await fetchHtml(url);
    const videoMatch = html.match(/"videoUrl":"([^"]+\.mp4)"/);
    if (videoMatch) console.log('Video:', videoMatch[1]);
    
    // find __INITIAL_STATE__ json
    const stateMatch = html.match(/window\.__INITIAL_STATE__\s*=\s*(\{.*?\});/);
    if (stateMatch) {
      try {
        const state = JSON.parse(stateMatch[1]);
        const product = state.product.product;
        console.log('Name:', product.name);
        console.log('Price:', product.price.sellingPrice.value);
        console.log('Images:', product.images.slice(0, 3));
      } catch (e) {
        console.log('Error parsing state');
      }
    }
  }
}
run();
