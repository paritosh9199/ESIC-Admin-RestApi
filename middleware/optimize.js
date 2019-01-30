const imagemin = require('imagemin');
// var PNGImages = './../public/uploads/img/*.png';
// var JPEGImages = './../public/uploads/img/*.jpg';
// var optimizedPath = './../public/uploads/thumbnails/images';
// optimizedPath = "";

const imageminMozjpeg = require('imagemin-mozjpeg');

const imageminPngquant = require('imagemin-pngquant');

const imageminWebp = require('imagemin-webp');

async function optimiseJPEGImages(imgPath,optimizationPath) {
  var imageOptimized = await imagemin([imgPath], optimizationPath, {
    plugins: [
      imageminMozjpeg({
        quality: 70,
      }),
    ]
  })

  // return imageOptimized;
  new Promise(function(resolve, reject) {
    resolve(imageOptimized)
  });
}
 


async function optimisePNGImages(imgPath,optimizationPath) {
  var imageOptimized = await imagemin([imgPath], optimizationPath, {
    plugins: [
      imageminPngquant({ quality: '65-80' })
    ],
  })
  
  // return imageOptimized;

  new Promise(function(resolve, reject) {
    resolve(imageOptimized)
  });
  
}
    



function optimizeSinglePicture(path = `.././public/uploads/temp/img/`,outPath = '.././public/uploads/thumbnails/images' ,){
  optimizedPath = outPath;
  var jpgReg = /.jpg/;
  var jpegReg = /.jpeg/;
  var pngReg = /.png/
  var jpgTest = jpgReg.test(path);
  var jpegTest = jpegReg.test(path)
  var pngTest = pngReg.test(path);

  if(jpgTest || jpegTest){
    JPEGImages = path;
    optimiseJPEGImages(path,outPath).then((img)=>{
      // console.log('successful optimization');

      // callback(true)
      new Promise(function(resolve, reject) {
        resolve(img);
      })
      return true;
    })
    .catch(error => {console.log(error); return false;});


  }else if(pngTest){
    PNGImages = path;
    optimisePNGImages(path,outPath).then((img)=>{
      console.log('successful optimization');

      // callback(true);

      new Promise(function(resolve, reject) {
        resolve(img);
      })
      // return true;
    })
    .catch(error => {console.log(error); return false;});

  }else{
    console.log('Invalid file optimization!');
    // callback(false);

    // return false;
    new Promise(function(resolve, reject) {
      reject(false);
    })
   
  }

}


optimizeSinglePicture();
module.exports = {optimizeSinglePicture};
