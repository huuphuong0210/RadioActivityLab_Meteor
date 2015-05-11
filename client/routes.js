/**
 * This file define the routing for the whole application
**/
Router.route('/', function () {
  this.render('home');
});

Router.route('/session', function () {
  this.render('session');
});
