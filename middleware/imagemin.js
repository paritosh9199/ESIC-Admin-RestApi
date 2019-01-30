const imagemin = require('imagemin');
// var PNGImages = './../public/uploads/img/*.png';
// var JPEGImages = './../public/uploads/img/*.jpg';
// var optimizedPath = './../public/uploads/thumbnails/images';
// optimizedPath = "";

const imageminMozjpeg = require('imagemin-mozjpeg');

const imageminPngquant = require('imagemin-pngquant');

const imageminWebp = require('imagemin-webp');

var optimiseJPEGImages = (imgPath,optimizationPath) => {
  imagemin([imgPath], optimizationPath, {
    plugins: [
      imageminMozjpeg({
        quality: 70,
      }),
    ]
  }).then(()=>{
    // console.log('successful optimization');

    return true;
    // callback(true)
    // return Promise.resolve(true);
  });
}
 


var optimisePNGImages = (imgPath,optimizationPath) =>{
  imagemin([imgPath], optimizationPath, {
    plugins: [
      imageminPngquant({ quality: '65-80' })
    ],
  }).then(()=>{
    // console.log('successful optimization');

    return true;

    // callback(true)
    // return Promise.resolve(true);
  });
}
    




// var convertPNGToWebp = () =>{
//   imagemin([PNGImages], optimizedPath, {
//     use: [
//       imageminWebp({
//         quality: 85,
//       }),
//     ]
//   }).then(()=>{
//     // console.log('successful optimization');

//     // callback(true)
//     return Promise.resolve(true);;
//   });
// }
  

// var convertJPGToWebp = () =>{
//   imagemin([JPEGImages], optimizedPath, {
//     use: [
//       imageminWebp({
//         quality: 75,
//       }),
//     ]
//   }).then(()=>{
//     console.log('successful optimization');

//     // callback(true)
//     return Promise.resolve(true);;
//   });
// }
  

// optimiseJPEGImages()
//   .catch(error => console.log(error));
//
// optimiseJPEGImages()
//   .then(() => optimisePNGImages())
//   .catch(error => console.log(error));

function optimizeSinglePicture(path,outPath = './public/uploads/thumbnails/images' ,){
  optimizedPath = outPath;
  var jpgReg = /.jpg/;
  var jpegReg = /.jpeg/;
  var pngReg = /.png/
  var jpgTest = jpgReg.test(path);
  var jpegTest = jpegReg.test(path)
  var pngTest = pngReg.test(path);

  if(jpgTest || jpegTest){
    JPEGImages = path;
    optimiseJPEGImages(path,outPath).then(()=>{
      // console.log('successful optimization');

      // callback(true)
      return true;
    })
    .catch(error => {console.log(error); return false;});


  }else if(pngTest){
    PNGImages = path;
    optimisePNGImages(path,outPath).then(()=>{
      console.log('successful optimization');

      // callback(true);

      return true;
    })
    .catch(error => {console.log(error); return false;});

  }else{
    console.log('Invalid file optimization!');
    // callback(false);

    return false;
    // optimiseJPEGImages()
    //   .then(() => optimisePNGImages())
    //   .then(() => convertPNGToWebp())
    //   .then(() => convertJPGToWebp())
    //   .catch(error => console.log(error));
  }

}

// var pathToPic = './public/uploads/img/test134.jpg';
// if (optimizeSinglePicture(pathToPic)){
//   console.log('hey!File optimization complete!');
// };

module.exports = {optimizeSinglePicture};
