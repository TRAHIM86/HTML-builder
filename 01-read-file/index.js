//модули пути и фс
const path = require('path');
const fs = require('fs');

//путь до "читаемого" файла
let pathToFile = path.join(__dirname, 'text.txt');

//поток чтения
let readStream = fs.createReadStream(pathToFile, 'utf-8');

let res = '';

readStream.on('data', (chunk) => res += chunk);
readStream.on('end', () => console.log(res));
readStream.on('error', () => console.log('Error'));