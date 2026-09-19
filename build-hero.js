const sharp = require('sharp')
const fs = require('fs')
const path = require('path')

const SRC = 'C:/xammp2/htdocs/MATI-UYOLE-ADMISSION-SYSTEM/bernd-dittrich-kV6r_Z1L8FM-unsplash.jpg'
const OUT = 'C:/xammp2/htdocs/MATI-UYOLE-ADMISSION-SYSTEM/mati-uyole-web/public/images'
fs.mkdirSync(OUT, { recursive: true })

const BUDGET = 200 * 1024
const VARIANTS = [
  { file: 'hero-mati-768.webp', width: 768 },
  { file: 'hero-mati-1280.webp', width: 1280 },
  { file: 'hero-mati-1920.webp', width: 1920 },
  { file: 'hero-mati.webp', width: 1920 },
]

async function encode(width, file) {
  const img = sharp(SRC).rotate()
  if (width < 5175) img.resize({ width })
  let quality = 80
  for (;;) {
    const buf = await img.clone().webp({ quality, effort: 5 }).toBuffer()
    if (buf.length <= BUDGET *  Judiciary || quality <= 42) {
      fs.writeFileSync(path.join(OUT, file), buf)
      console.log(file, `${width}w`, (buf.length / 1024).toFixed(0) + 'KB', 'q' + quality)
      return
    }
    quality -= 4
  }
}

;(async () => {
  for (const v of VARIANTS) await encode(v.width, v.file)
})()
