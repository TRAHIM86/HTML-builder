const path = require('path');           //подкл модули пути и фс
const fs = require('fs');
const fsPromises = fs.promises; 

let pathOrigDir = path.join(__dirname, 'files');        //путь к целевой папке
let pathCopyDir = path.join(__dirname, 'files-copy');   //путь к новой папке

//асинк функция с параметрами (папка 1, папка 2). Можно применять на любых папках
async function copyDir(origDir, copyDir) {

  //авейт создания папки-копии (если есть пропустить)
  await fsPromises.mkdir(
    copyDir,                          
    { recursive: true},                                   
    (err) => {if (err) {console.log(`Error: ${err}.`)}}   
  )
  
  //авейт риддира. Получить файлы
  let filesForDelete = await fsPromises.readdir(                                             
    copyDir,                                          
    { withFileTypes: true }
  )     
    
  //для каждого файла авейт его удаления
  for (let file of filesForDelete) {
    await fsPromises.unlink(path.join(copyDir, file.name));  
  }
    
  //дальше можно без авейт. Прочитать копириуему папку. Скорировать каждый файл в новую папку
  fs.readdir(                                             
    origDir,                                          
    { withFileTypes: true },                              
    (err, files) => {                                    
      if (err) {console.log(`Error: ${err}.`)};
      for (let file of files) {                                     
        if (file.isFile()) {
          let pathOrigDirFile = path.join(origDir, file.name);  
          let pathCopyDirFile = path.join(copyDir, file.name);  
          fsPromises.copyFile(pathOrigDirFile, pathCopyDirFile);   
        }     
      } 
    }
  ) 
}

copyDir(pathOrigDir, pathCopyDir)