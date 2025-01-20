const path = require('path');               //подкл модули
const fs = require('fs');

const pathToStyles = path.join(__dirname, 'styles');         //пути
const pathToBundleCSS = path.join(__dirname, 'project-dist', 'bundle.css');

//читаем папку
fs.readdir(
  pathToStyles,
  { withFileTypes: true },
  (err, files) => {
    if (err) {console.log(`Error: ${err}`)};
    let stylesForBundle = [];                                   //массив для стилей

    for (let file of files) {
      let ext = path.extname(file.name); 
      if (file.isFile() && ext === '.css') {                //если это файл и он .css, то:       
        
        fs.readFile(                                        //читаем содержимой файла
          path.join(pathToStyles, file.name),
          'utf-8',
          (err, data) => {
            if (err) {console.log(`Error: ${err}`)};

            stylesForBundle.push(data);                     //пушим в массив                      
            
            fs.promises.writeFile(                          //записываем в файл, объединяя массив     
              pathToBundleCSS,
              stylesForBundle.join('\n'),                   //объединить через пустую строку
            )
          }
        )
      }
    }
  } 
)