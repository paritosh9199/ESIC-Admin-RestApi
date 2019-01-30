const imagemin = require('imagemin');
const imageminJpegtran = require('imagemin-jpegtran');
const imageminPngquant = require('imagemin-pngquant');

async function optimize() {
  const files = await imagemin(['./public/uploads/temp/*.{jpg,png}'], './public/uploads/thumbnails/', {
    plugins: [
      imageminJpegtran(),
      imageminPngquant({
        quality: [0.6, 0.8]
      })
    ]
  });

  console.log({ files });
  return Promise.resolve(files);

  //=> [{data: <Buffer 89 50 4e …>, path: 'build/images/foo.jpg'}, …]
}

module.exports = { optimize }