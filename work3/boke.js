const http = require('http'),
      fs = require('fs'),
      url = require('url'),
      file = process.argv[2] || __filename,
      querystring = require("querystring"),
      path = require('path');
const {chapterList,userList} = require('./data.js');
var id=0;
var item = {};
var server = http.createServer(function(req,res){
    let filename = "";
    let urlobj = url.parse(req.url);
    if(req.url==="/list"){
        res.writeHead(200, {'Content-Type': 'text/html'});
        var content = fs.readFileSync('chapterList.html');
        res.end(content);
    }else if(req.url=="/login"){
        console.log(req.url);
        res.writeHead(200, {'Content-Type': 'text/html'});
        var content = fs.readFileSync('login.html');
        res.end(content);
    }else if(url.parse(req.url).pathname=="/listmanager"){
        let queryobj=querystring.parse(urlobj.query);
        if(queryobj.username=="admin"&&queryobj.pwd=='admin'){
            res.writeHead(200, {'Content-Type': 'text/html'});
            var content = fs.readFileSync('list.html');
            res.end(content);
        }else {
            res.writeHead(200, {'Content-Type': 'text/html'});
            var content = fs.readFileSync('404.html');
            res.end(content);
        }
    }else if(req.url=="/addChapter"){
        var listPath = path.join(__dirname,'addChapter.html');
        res.writeHead(200,{'Content-Type':'text/html'});
        fs.readFile(listPath,'utf-8',(err,data)=>{
            if(err){
                console.error(message);
            }else{
                res.end(data);
            }
        })
    }else if(req.url == '/a/'){
            res.write(JSON.stringify(chapterList));
            res.end();
    }else if(url.parse(req.url).pathname == '/detail'){     
        var listPath = path.join(__dirname,'chapter.html');
        id=url.parse(req.url).query.replace(/chapterId=/,"")-1;
        res.writeHead(200,{'Content-Type':'text/html'});
        fs.readFile(listPath,'utf-8',(err,data)=>{
            if(err){
                console.error(message);
            }else{
                // console.log(data);
                res.end(data);
            }
        })
    }else if(req.url == '/b/'){
        res.writeHead(200,{'Content-Type':'text/json'});
        item=chapterList[id];  
        res.end(JSON.stringify(item));
    }else if(req.url == '/add'){
        var items = {};      
        var postData = ""; 
         req.addListener("data", function (postDataChunk) {
            postData += postDataChunk; 
            var title=postData.split("&")[0].replace(/title=/,'');
            var content=postData.split("&")[1].replace(/content=/,'');
            items.chapterId=chapterList.length+1;
            items.chapterName=title;
            items.chapterDes=content;
            items.chapterContent=content;
            items.publishTimer= "2019-08-19";
            items.author="admin";
            items.views=1022;
            items.imgPath='';
            chapterList.push(items);
        });
    }else if(req.url=="/article/"){
        console.log(JSON.stringify(chapterList))
        res.write(JSON.stringify(chapterList));
        res.end();
    }else if(req.url!="/"){
        req.url='.'+req.url;
        fs.readFile(req.url,function(error,data){
          if(error){
            console.log(error.message);
          }
          res.writeHead(200,{"Content-Type":"text/css"});
          res.end(data);
        });
    }
});
server.listen(8083);