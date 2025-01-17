const path = require('path');           //подкл модули пути и фс
const fs = require('fs');

function getFileInfo() {                                                
  const pathToFolder = path.join(__dirname, 'secret-folder');                     //путь к папке, в которой собираем инфо
  const readingFiles = fs.promises.readdir(pathToFolder, {withFileTypes: true});  //получить в нужном формате
    
  readingFiles
    .then(
      (files) => {        
        files.forEach((file) => {                       //для каждого file в files
          if (file.isFile()) {                          //проверим на исфайл()
            let fileName = file.name                    //вытянем имя и формат ('text.txt')

            let fileExt = path.extname(fileName);       //вытянем формат (txt')
                    
            fs.stat(path.join(pathToFolder, fileName), (err, stats) =>{    //стата для файла     
              if (err) {console.log(`Sorry, error: ${err}.`)}              //если еррор - покажем еррор
              else {console.log(`${fileName.split('.')[0]} - ${fileExt.split('.')[1]} - ${stats.size}b`)}  //результат в консоль по каждому файлу
            })
          }
        })
      }
    )
    
    .catch(
      (err) => console.log(`Sorry! Error: ${err}.`)
  
    )
}

getFileInfo()