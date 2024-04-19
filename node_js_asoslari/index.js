const http = require('http');
const path = require('path')
const fs = require('fs');
const uuid = require('uuid');
const { json } = require('express');

const hostname = '127.0.0.1';
const port = 3000;
// bodyParser funksiyasini o'zgartirish
const bodyParser = function (req) {
    return new Promise((resolve, reject) => {
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString();
        });
        req.on('end', () => {
            try {
                const parsedBody = JSON.parse(body);
                resolve(parsedBody);
            } catch (error) {
                reject(error);
            }
        });
    });
};
const server = http.createServer(async (req, res) => {
    if (req.url === '/get') {
        const fileName = path.join(__dirname, './books.json')
        const book = fs.readFile(fileName, 'utf8', (err, data) => {
            if (err) {
                console.log(err)
            }
            res.end(data)
        })
    }
    if (req.url.startsWith('/get/')) {
        const id = parseInt(req.url.split('/get/')[1]);
        const fileName = path.join(__dirname, './books.json');
        fs.readFile(fileName, 'utf8', (err, data) => {
            if (err) {
                console.error(err);
                res.statusCode = 500;
                res.end('Server xatosi');
                return;
            }
            const jsonData = JSON.parse(data);
            const book = jsonData.find(item => item.id === id);
            if (book) {
                res.statusCode = 200;
                res.end(JSON.stringify(book));
            } else {
                res.statusCode = 404;
                res.end('<h1>Not found</h1>');
            }
        });
    }
    if (req.url === '/post') {
        let body = await bodyParser(req)

        const fileName = path.join(__dirname, './books.json')

        const dataText = fs.readFileSync(fileName, "utf8")
        let data = JSON.parse(dataText)
        const book = data.find(item => item.title === body.title)


        if (book) {
            return res.end("<h1>This title already exists</h1>")
        }
        const newBook = {}
        newBook.id = uuid.v4()
        newBook.title = body.title
        newBook.page = body.page
        data.push(newBook)
        const jsonData = JSON.stringify(data, null, 2)

        fs.writeFile(fileName, jsonData, 'utf8', (err) => {
            if (err) {
                console.log(err)
                return;
            }
            res.end('<h1>Malumotlar yozildi</h1>')
        })
    }
    if(req.url.startsWith("/put/")){
        let body = await bodyParser(req)
        const id = parseInt(req.url.split('/put/')[1]);
        const fileName = path.join(__dirname, './books.json');
        let  data = fs.readFileSync(fileName, 'utf8')
        let parseData = JSON.parse(data)
        const book = parseData.find(item => item.id === id)
        if(book){
            book.title = body.title || book.title
            book.page = body.page || book.page

            const jsonData = JSON.stringify(parseData, null, 2)

            fs.writeFile(fileName, jsonData, 'utf8', (err) => {
                if (err) {
                    console.log(err)
                    return;
                }
                res.end('<h1>Malumotlar yozildi</h1>')
            })
        }else{
            res.end('<h1>Not found</h1>')
        }
    }
    if(req.url.startsWith('/delete/')){
        const id = parseInt(req.url.split('/delete/')[1]);
        const fileName = path.join(__dirname, './books.json');
        let  data = fs.readFileSync(fileName, 'utf8')
        let parseData = JSON.parse(data)

        const book = parseData.findIndex(item => item.id === id)
        if(book !== -1){
            parseData.splice(book, 1)

            const jsonData = JSON.stringify(parseData, null, 2)

            fs.writeFile(fileName, jsonData, 'utf8', (err) => {
                if (err) {
                    console.log(err)
                    return;
                }
                res.end('<h1>Malumot ochoirildi </h1>')
            })
        }else{
            res.end('<h1>Not found</h1>')
        }
    }

});

server.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
});
