const path = require('path');           //подкл модули пути и фс
const fs = require('fs');

function getFileInfo() {                                                
  const pathToFolder = path.join(__dirname, 'secret-folder');                     //путь к папке, в которой собираем инфо
  const readingFiles = fs.promises.readdir(pathToFolder, {withFileTypes: true});  //получить в нужном формате
    
  readingFiles
    .then(
      (files) => {        
        files.forEach((file) => {                         //для каждого file в files
          if (file.isFile()) {                            //проверим на исфайл()
            let lastIndex = file.name.lastIndexOf('.');   //индекс последней точки (если имя файла имя.еще.разш)

            let fileName = file.name.slice(0, lastIndex);

            let fileExt = path.extname(file.name);         //вытянем формат (txt')
                    
            fs.stat(path.join(pathToFolder, file.name), (err, stats) =>{    //стата для файла     
              if (err) {console.log(`Sorry, error: ${err}.`)}              //если еррор - покажем еррор
              else {console.log(`${fileName} - ${fileExt.split('.')[1]} - ${stats.size}b`)}  //результат в консоль по каждому файлу
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