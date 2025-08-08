const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

async function convertGalleryImages() {
  const galleryDir = path.join(__dirname, '..', 'public', 'images', 'gallery');
  
  console.log('🖼️  갤러리 이미지 변환 시작...');
  console.log(`📁 대상 디렉토리: ${galleryDir}`);
  
  try {
    // PNG 파일들 찾기
    const files = fs.readdirSync(galleryDir);
    const pngFiles = files.filter(file => file.toLowerCase().endsWith('.png'));
    
    if (pngFiles.length === 0) {
      console.log('✅ 변환할 PNG 파일이 없습니다.');
      return;
    }
    
    console.log(`🔄 ${pngFiles.length}개의 PNG 파일을 WebP로 변환합니다...`);
    
    let convertedCount = 0;
    let errorCount = 0;
    
    for (const pngFile of pngFiles) {
      try {
        const inputPath = path.join(galleryDir, pngFile);
        const outputFile = pngFile.replace(/\.png$/i, '.webp');
        const outputPath = path.join(galleryDir, outputFile);
        
        // WebP로 변환 (품질 90%, 손실 압축)
        await sharp(inputPath)
          .webp({ 
            quality: 90,
            effort: 6 // 압축 최적화 레벨 (0-6, 6이 최고)
          })
          .toFile(outputPath);
        
        // 원본 PNG 파일 삭제
        fs.unlinkSync(inputPath);
        
        convertedCount++;
        console.log(`✅ ${pngFile} → ${outputFile} (${convertedCount}/${pngFiles.length})`);
        
      } catch (error) {
        errorCount++;
        console.error(`❌ ${pngFile} 변환 실패:`, error.message);
      }
    }
    
    console.log('');
    console.log('🎉 변환 완료!');
    console.log(`✅ 성공: ${convertedCount}개`);
    if (errorCount > 0) {
      console.log(`❌ 실패: ${errorCount}개`);
    }
    console.log('');
    console.log('📝 다음 단계: git add . && git commit -m "feat: 갤러리 이미지 추가 및 WebP 변환"');
    
  } catch (error) {
    console.error('💥 변환 중 오류 발생:', error);
    process.exit(1);
  }
}

// 스크립트 실행
if (require.main === module) {
  convertGalleryImages().catch(console.error);
}

module.exports = { convertGalleryImages };