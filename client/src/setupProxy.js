const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function (app) {
    app.use('/auth/**',  //all petitions with /auth/ will be redirected to the backend
        createProxyMiddleware({ 
            target: 'http://localhost:5000'
        })
    );
};