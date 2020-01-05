const http = require('http');

const server = http.createServer(300, (...args) => {
    console.log(args);
})
