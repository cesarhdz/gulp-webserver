var request = require('supertest');
var webserver = require('../src');
var File = require('gulp-util').File;

describe('gulp-webserver', function() {

  var stream;

  var rootDir = new File({
    path: __dirname + '/fixtures'
  });

  afterEach(function() {
    stream.emit('kill');
  });

  it('should work with default options', function(done) {

    stream = webserver();

    stream.write(rootDir);

    request('http://localhost:8000')
      .get('/')
      .expect(200, /Hello World/)
      .end(function(err) {
        if (err) return done(err);
        done(err);
      });

  });

  it('should work with custom port', function(done) {

    stream = webserver({
      port: 1111
    });

    stream.write(rootDir);

    request('http://localhost:1111')
      .get('/')
      .expect(200, /Hello World/)
      .end(function(err) {
        if (err) return done(err);
        done(err);
      });

  });

  it('should work with custom host', function(done) {

    stream = webserver({
      host: '0.0.0.0'
    });

    stream.write(rootDir);

    request('http://0.0.0.0:8000')
      .get('/')
      .expect(200, /Hello World/)
      .end(function(err) {
        if (err) return done(err);
        done(err);
      });

  });

  it('should fall back to default.html', function(done) {

    stream = webserver({
      fallback: 'default.html'
    });

    stream.write(rootDir);

    request('http://localhost:8000')
      .get('/some/random/path/')
      .expect(200, /Default/)
      .end(function(err) {
        if (err) return done(err);
        done(err);
      });

  });


  it('should proccess middleware', function(done){

    function customMiddleware(req, res, next){
        res.end('Hello Middleware');
    }

    stream = webserver({
      middleware : [customMiddleware]
    })

    stream.write(rootDir);

    request('http://localhost:8000')
      .get('/every/path/should/work')
      .expect(200, /Hello Middleware/)
      .end(function(err) {
        if (err) return done(err);
        done(err);
      });

  });


});
