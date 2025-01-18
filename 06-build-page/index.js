const path = require('path');           //подкл модули пути и фс
const fs = require('fs');

//pathes
const pathToTemplate = path.join(__dirname, 'template.html');
const pathToStyles = path.join(__dirname, 'styles');
const pathToAssets = path.join(__dirname, 'assets');
const pathToComponents = path.join(__dirname, 'components');
const pathToProject = path.join(__dirname, 'project-dist');
const pathToProjectAssets = path.join(__dirname, 'project-dist', 'assets');
const pathToProjectHTML = path.join(__dirname, 'project-dist', 'index.html');

//-----function createAssets
async function createAssets () {
  await fs.promises.rm(                                     //удалить папку assets
    pathToProjectAssets,
    { recursive: true, force: true },
    (err) => {
      if (err) {console.log(`Error: ${err}.`)}
    }
  )
  
  await fs.promises.mkdir(                                  //создать папку assets
    path.join(pathToProjectAssets),
    { recursive: true},                                   
    (err) => {if (err) console.log(`Error: ${err}.`)}
  )

  fs.readdir(                                                     //читаем дефолтные папки assets
    pathToAssets,
    { withFileTypes: true }, 
    async (err, dirs) => {
      if (err) {console.log(`Error: ${err}.`)}
      for (let dir of dirs) {                                     
        if (dir.isDirectory()) {                                  //если это папка
          await fs.promises.mkdir(                                      //создать такую же папку  
            path.join(pathToProjectAssets, dir.name),             //в assets в прожект     
            { recursive: true},                                   
            (err) => {if (err) {console.log(`Error: ${err}.`)}} 
          )
           
          fs.readdir(                                           //прочитать
            path.join(pathToAssets, dir.name),                  //папки в дефолтном assets  
            { withFileTypes: true },
            (err, files) => {
              if (err) {console.log(`Error: ${err}.`)}
              for (let file of files) {                                                             //для каждого файла 
                if (file.isFile()) {                                                                //если это файл  
                  let pathToOrigAssets = path.join(pathToAssets, dir.name, file.name);
                  let pathToCopyAssets = path.join(pathToProjectAssets, dir.name, file.name)  
                  fs.promises.copyFile(pathToOrigAssets, pathToCopyAssets)                          //скопировать в asset/папка в прожект          
                }
              }             
            }  
          ) 
        }
      }
    }  
  )
}

createAssets()


//function combineStyles
function combineStyles() {
  fs.readdir(                         //прочита папку дефолтные стили
    pathToStyles,
    { withFileTypes: true },      
    (err, files) => {

      if (err) {console.log(`Error: ${err}`)};

      let stylesForBundle = [];       //массив для объединенных стилей

      for (let file of files) {       //для каждого файла
        let ext = path.extname(file.name);
        if (file.isFile() && ext === '.css') {     //если css

          fs.readFile(                                      //читать файл    
            path.join(pathToStyles, file.name),
            'utf-8',
            (err, data) => {
              if (err) {console.log(`Error: ${err}`)};

              stylesForBundle.push(data);                   //пуш содержимого в массив
              
              fs.promises.writeFile(                        //записать 
                path.join(pathToProject, 'style.css'),      //в общий стиль 
                stylesForBundle.join('\n'),                   //объединенный массив
              )
            }  
          )
        }
      }
    }  
  )
}

combineStyles()


//-----function createHTML
function createHTML () {
  fs.readFile(                                      //читать
    pathToTemplate,                                 //шаблон
    'utf-8',
    async (err, data) => {
      if (err) console.log(`Error: ${err}.`)
      let contentHTML = data                        //получить контент шаблона

      await fs.promises.writeFile(                  //записать  
        pathToProjectHTML,                          //в index.html в прожекте  
        contentHTML                                 //контент
      )

      fs.readdir(                                   //затем читать папку
        pathToComponents,                           //компоненты (для шаблона)  
        { withFileTypes: true },
        (err, files) => {
          {if (err) console.log(`Error: ${err}.`)}
          for (let file of files) {                                   //для каждого компонента шаблона
            let componentName = `{{${file.name.split('.')[0]}}}`;     //получить имя (оно равно переменной в шаблоне)
            fs.readFile(                                              //прочитать
              path.join(pathToComponents, file.name),                 //файл-компонент
              'utf-8',
              (err, data) => {
                {if (err) console.log(`Error: ${err}.`)}

                contentHTML = contentHTML.replace(`${componentName}`, data)     //в шаблоне заменить переменную (имя компонента) на его одноименное содержимое    

                fs.promises.writeFile(      //записать  
                  pathToProjectHTML,        //в index.html
                  contentHTML,              //контент разметки страницы (со вставленным содержимим компонента)
                )
              }
            )
          }
        }
      )
    } 
  )  
}


createHTML()