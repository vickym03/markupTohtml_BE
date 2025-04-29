// apis/index.js

module.exports = function (fastify, _, done) {
    fastify.register(require('./borrowers'));
    fastify.register(require('./stats'));
  
    done();
  };
  