const chai = require('chai');
const server = require('./../server.js');
const expect = chai.expect;
chai.use(require('chai-http'));

describe('articleCreate', function() {
  it('goes to article/create', function(done) {
    chai.request(server)
      .get('/article/create')
      .end(function(err, res) {
        if(err) return done(err);
        expect(res).to.have.status(200);
        expect(res).to.be.html;
        done();
      });
  });
  it('ADD an article on /article/create POST', function(done) {
    chai.request(server)
      .post('/article/create')
      .field('title', 'Blabla')
      .field('content', 'Some content')
      .end(function(err, res, bla) {
        if(err) return done(err);
        expect(res).to.have.status(200);
        expect(res).to.be.html;
        done();
      });
  });
});

describe('rest', function() {
  it('SHOW EDIT article on /article/edit/<id> GET');
  it('UPDATE article on /article/edit/<id> POST');
  it('DELETE article on /article/delete/<id> GET');
  it('SHOW DETAILED article on /article/details/<id> GET');
});
