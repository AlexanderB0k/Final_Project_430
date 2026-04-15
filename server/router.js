const controllers = require('./controllers');
const mid = require('./middleware');

const router = (app) => {
    app.get('/getRatings', mid.requiresLogin, controllers.Rating.getRatings);

    app.get('/login', mid.requiresSecure, mid.requiresLogout, controllers.Account.loginPage);
    app.post('/login', mid.requiresSecure, mid.requiresLogout, controllers.Account.login);

    app.post('/signup', mid.requiresSecure, mid.requiresLogout, controllers.Account.signup);

    app.get('/logout', mid.requiresLogin, controllers.Account.logout);

    app.get('/maker', mid.requiresLogin, controllers.Rating.makerPage);
    app.post('/maker', mid.requiresLogin, controllers.Rating.makeRating);

    app.post('/upload', controllers.imageupload.uploadFile);

    app.get('/retrieve', controllers.imageupload.retrieveFile);


    app.get('/', mid.requiresSecure, mid.requiresLogout, controllers.Account.loginPage);

}

module.exports = router;
