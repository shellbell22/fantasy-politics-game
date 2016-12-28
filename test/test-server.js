/* example text
describe('Shopping List', function() {
    it('should list items on get');
    it('should add an item on post');
    it('should edit an item on put');
    it('should delete an item on delete');
});
*/

/* make the application use the testing database instead of the development one */
global.DATABASE_URL = 'mongodb://localhost/fantasypoliticalgame-dev';

var chai = require('chai');
var chaiHttp = require('chai-http');

var server = require('../server.js');
var Senator = require('../models/senators');

var should = chai.should();
var app = server.app;

//var storage = server.storage;

chai.use(chaiHttp);

describe('index page', function() {
    it('exists', function(done) {
        chai.request(app)
            .get('/')
            .end(function(err, res) {
                res.should.have.status(200);
                res.should.be.html;
                done();
            });
    });
});

/* the before function is run before each test is run. In this function you run the server, then you seed the database by adding some sample data which you can use in any of your tests. In the after function, which is run after each test is run, you remove all of the items from the database so you are starting from a clean slate for the next test. */

describe('Senator List', function() {
            before(function(done) {
                server.runServer(function() {
                    Senator.create({
                        firstname: 'Timothy'
                    }, {
                        firstname: 'Ted'
                    }, {
                        firstname: 'Deb'
                    }, function() {
                        done();
                    });
                });
            });
            after (function(done) {
              Senator.remove(function() {
                done();
              });
            });
        });
