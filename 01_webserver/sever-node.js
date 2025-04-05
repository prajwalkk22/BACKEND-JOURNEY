const http = require('http')

const hostName = '127.0.0.1';

const port = 3000;

const server = http.createServer((req,res)=>{
    if (req.url === '/') {
        res.statusCode = 200
        res.setHeader('content-Type','text/plain')
        res.end("Hello ice tea")
    }
    else if(req.url==='/ice-tea'){
        res.statusCode = 200
        res.setHeader('content-Type','text/plain')
        res.end("Thanks for ordering ice tea")
    }
    else if(req.url==='/login'){
        res.statusCode = 200
        res.setHeader('content-Type','text/plain')
        res.end("login to your account")
    }
    else{
    res.statusCode = 404
        res.setHeader('content-Type','text/plain')
        res.end("oops content not found")
    }
});

server.listen(port,hostName,()=>{
    console.log(`server is listening at http://${hostName}:${port}`)
})