const sharp = require('sharp');

async function resizeLogo() {
  try {
    await sharp('public/images/logo.png')
      .resize(100, 26)
      .toFormat('png')
      .toFile('public/images/logo-resized.png');
    
    console.log('로고 이미지 리사이즈 완료');
  } catch (error) {
    console.error('이미지 리사이즈 중 오류 발생:', error);
  }
}

resizeLogo();