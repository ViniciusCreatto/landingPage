const https = require('https');
const fs = require('fs');
const path = require('path');

// URLs de imagens profissionais para o carrossel Antes/Depois
const images = [
  {
    name: 'transformacao-1',
    before: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80',
    after: 'https://images.unsplash.com/photo-1552664730-d307be887d5b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80'
  },
  {
    name: 'transformacao-2', 
    before: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80',
    after: 'https://images.unsplash.com/photo-1519088368413-c2f9bb3980a2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80'
  },
  {
    name: 'transformacao-3',
    before: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80',
    after: 'https://images.unsplash.com/photo-1551434678-e076c223a692?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80'
  }
];

// Criar diretório se não existir
const outputDir = './assets/images';
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// Função para baixar imagem
function downloadImage(url, filename) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(filename);
    
    https.get(url, (response) => {
      response.pipe(file);
      file.on('finish', () => {
        file.close();
        console.log(`✅ Baixado: ${filename}`);
        resolve();
      });
    }).on('error', (err) => {
      fs.unlink(filename, () => {});
      reject(err);
    });
  });
}

// Baixar todas as imagens
async function downloadAllImages() {
  console.log('🚀 Baixando imagens para o carrossel...');
  
  for (const image of images) {
    try {
      await downloadImage(image.before, `${outputDir}/antes-${image.name}.jpg`);
      await downloadImage(image.after, `${outputDir}/depois-${image.name}.jpg`);
    } catch (error) {
      console.error(`❌ Erro ao baixar ${image.name}:`, error.message);
    }
  }
  
  console.log('✨ Download concluído!');
  console.log('\n📁 Imagens baixadas:');
  images.forEach(img => {
    console.log(`  - antes-${img.name}.jpg`);
    console.log(`  - depois-${img.name}.jpg`);
  });
}

downloadAllImages().catch(console.error);
