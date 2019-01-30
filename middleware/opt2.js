const imagemin = require('imagemin');
const imageminJpegtran = require('imagemin-jpegtran');
const imageminPngquant = require('imagemin-pngquant');

async function optimize (path,pathOut) {
	const files = await imagemin([path], pathOut, {
		plugins: [
			imageminJpegtran(),
			imageminPngquant({
				quality: [0.6, 0.8]
			})
		]
	});

    console.log(files);
    return files;
	//=> [{data: <Buffer 89 50 4e …>, path: 'build/images/foo.jpg'}, …]
};

module.exports = {
    optimize 
}