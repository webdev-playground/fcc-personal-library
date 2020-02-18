/*
*
*
*       FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
*       -----[Keep the tests in the same order!]-----
*       
*/

var chaiHttp = require('chai-http');
var chai = require('chai');
var assert = chai.assert;
var server = require('../server');

chai.use(chaiHttp);

let newId;
const fakeId = '5e4bf9f4c50c385c3a2a9aaa';
process.env.NODE_ENV = 'test';

suite('Functional Tests', function() {

  /*
  * ----[EXAMPLE TEST]----
  * Each test should completely test the response of the API end-point including response status code!
  */
  // test('#example Test GET /api/books', function(done){
  //    chai.request(server)
  //     .get('/api/books')
  //     .end(function(err, res){
  //       assert.equal(res.status, 200);
  //       assert.isArray(res.body, 'response should be an array');
  //       assert.property(res.body[0], 'commentcount', 'Books in array should contain commentcount');
  //       assert.property(res.body[0], 'title', 'Books in array should contain title');
  //       assert.property(res.body[0], '_id', 'Books in array should contain _id');
  //       done();
  //     });
  // });
  /*
  * ----[END of EXAMPLE TEST]----
  */

  suite('Routing tests', function() {


    suite('POST /api/books with titles => create book object/expect book object', function() {
      
      test('Test POST /api/books with title', function(done) {
        chai.request(server).post('/api/books').send({ title: 'ABC' }).end((err, res) => {
          assert.equal(res.status, 201);
          assert.equal(res.body.title, 'ABC');
          assert.property(res.body, '_id');
          newId = res.body._id;
          done();
        });
      });
      
      test('Test POST /api/books with no title given', function(done) {
        chai.request(server).post('/api/books').send({ title: '' }).end((err, res) => {
          assert.equal(res.status, 400);
          done();
        });
      });
      
    });


    suite('GET /api/books => array of books', function(){
      
      test('Test GET /api/books',  function(done){
        chai.request(server).get('/api/books').end((err, res) => {
          assert.equal(res.status, 200)
          assert.isArray(res.body);
          assert.property(res.body[0], '_id');
          assert.property(res.body[0], 'title');
          assert.property(res.body[0], 'commentcount');
          done();
        });
      });      
      
    });


    suite('GET /api/books/[id] => book object with [id]', function(){
      
      test('Test GET /api/books/[id] with id not in db',  function(done){
        chai.request(server).get('/api/books/' + fakeId).end((err, res) => {
          assert.equal(res.status, 404);
          done();
        });
      });
      
      test('Test GET /api/books/[id] with valid id in db',  function(done){
        chai.request(server).get('/api/books/' + newId).end((err, res) => {
          assert.equal(res.status, 200);
          assert.property(res.body, '_id');
          assert.equal(res.body._id, newId);
          assert.property(res.body, 'title');
          assert.property(res.body, 'comments');
          done();
        });
      });
      
    });


    suite('POST /api/books/[id] => add comment/expect book object with id', function(){
      
      test('Test POST /api/books/[id] with comment', function(done){
        chai.request(server).post('/api/books/' + newId).send({ comment: 'hello world' }).end((err, res) => {
          assert.equal(res.status, 200);
          assert.property(res.body, '_id');
          assert.equal(res.body._id, newId);
          assert.property(res.body, 'title');
          assert.property(res.body, 'comments');
          assert.include(res.body.comments, 'hello world');
          done();
        });
      });
      
    });

  });

});
