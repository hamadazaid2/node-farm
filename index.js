const replaceTemplate = require('./modules/replaceTemplate'); // import


const fs = require('fs');
const http = require('http');
const path = require('path');
const url = require('url');



// It will happen one time so it can be sync
const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, 'utf-8');
const dataObj = JSON.parse(data);


const tempOverview = fs.readFileSync(`${__dirname}/templates/template-overview.html`, 'utf-8');
const tempCard = fs.readFileSync(`${__dirname}/templates/template-card.html`, 'utf-8');
const tempProduct = fs.readFileSync(`${__dirname}/templates/template-product.html`, 'utf-8');





// SERVER 

const server = http.createServer((req, res) => {
    //    /overview?id=5 => /overview: pathname        ?id=5: query
    //    
    const { query, pathname } = url.parse(req.url, true);
    console.log('--------------------------------');
    console.log(url.parse(req.url, true));
    console.log('--------------------------------');


    // Overview page
    if (pathname === '/' || pathname === '/overview') {

        res.writeHead(200, {
            'Content-type': 'text/html'
        });

        const cardsHtml = dataObj.map(el => replaceTemplate(tempCard, el)).join(''); // join: it return string instead of array

        // console.log(cardsHtml);
        const output = tempOverview.replace('{%PRODUCT_CARDS%}', cardsHtml);
        res.end(output);
    }

    // Product page
    else if (pathname === '/product') {
        res.writeHead(200, { 'Content-type': 'text/html' });
        const product = dataObj[query.id];
        const output = replaceTemplate(tempProduct, product);
        res.end(output);
    }

    // API
    else if (pathname === '/api') {
        res.writeHead(200, {
            'Content-type': 'application/json'
        });
        res.end(data); // Note that i send the data not dataObj
    }

    // Not found
    else {
        // IMP: header must be before the response (res.end)
        res.writeHead(404, {
            'Content-type': 'text/html', // Browser expecting html code as a response
            'my-own-header': 'hello-world'
        });
        res.end('<h1>Page not found!</h1>');
    }

    // res.end('Hello from the server!'); // end is the very simple response from the server to the client who hit the server.
});

server.listen(8000, '127.0.0.1', () => {
    console.log(`listening to request on port 8000`);
}) // parm: port, host, optional: a callback when the server start listening 