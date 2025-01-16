//подключить модули пути и фс
const path = require('path');
const fs = require('fs');
const { stdin, stdout } = process;

let pathToFile = path.join(__dirname, 'text.txt');

const writeStream = fs.createWriteStream(pathToFile);

stdout.write('Hello! Please write some text\n');

stdin.on('data', (data) => {
  let someText = data.toString().trim();

  if (someText === 'exit') {
    stdout.write('Bye-bye!\n');
    process.exit();
  } else {
    writeStream.write(`${someText}\n`);
  }
})

process.on('SIGINT', () => {
  stdout.write('Bye-bye!\n');
  process.exit();
})