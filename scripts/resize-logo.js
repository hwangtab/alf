const sharp = require('sharp');

async function resizeLogo() {
  try {
    await sharp('public/images/logo.webp')
      .resize(100, 26)
      .toFormat('webp')
      .toFile('public/images/logo-resized.webp');
    
    console.log('로고 이미지 리사이즈 완료');
  } catch (error) {
    console.error('이미지 리사이즈 중 오류 발생:', error);
  }
}

resizeLogo();