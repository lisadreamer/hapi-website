'use strict';

const Wreck = require('wreck');

exports.register = function(server, options, next) {
  server.route({
    method: 'GET',
    path: '/bookmarks',
    handler: function(request, reply) {
      const apiUrl =
        server.settings.app.apiBaseUrl +
        '/bookmarks?sort=' +
        request.query.sort;

      request.get(
        apiUrl,
        {
          json: true
        },
        (err, res, payload) => {
          if (err) {
            throw err;
          }

          return reply.view('index', {
            bookmarks: payload
          });
        }
      );
    }
  });

  server.route({
    method: 'GET',
    path: '/bookmarks/add',
    handler: function(request, reply) {
      return reply.view('form', {
        edit: false
      });
    },
    config: {
      auth: 'session'
    }
  });

  server.route({
    method: 'POST',
    path: '/bookmarks',
    handler: function(request, reply) {
      const apiUrl = server.settings.app.apiBaseUrl + '/bookmarks';

      const token = request.auth.credentials.token;

      Wreck.post(
        apiUrl,
        {
          payload: JSON.stringify(request.payload),
          json: true,
          headers: {
            Authorization: 'Bearer' + token
          }
        },
        (err, res, payload) => {
          if (err) {
            throw err;
          }
          return reply.redirect('/bookmarks');
        }
      );
    },
    config: {
      auth: 'session'
    }
  });

  server.route({
    method: 'GET',
    path: '/bookmarks/{id}/edit',
    handler: function(request, reply) {
      const apiUrl =
        server.settings.app.apiBaseUrl + '/bookmarks/' + request.params.id;

      Wreck.get(
        apiUrl,
        {
          json: true
        },
        (err, res, payload) => {
          if (err) {
            throw err;
          }
          return reply.view('form', {
            values: payload,
            edit: true
          });
        }
      );
    },
    config: {
      auth: 'session'
    }
  });

  server.route({
    method: 'POST',
    path: '/bookmarks/{id}',
    handler: function(request, reply) {
      const apiUrl =
        server.settings.app.apiBaseUrl + '/bookmarks/' + request.params.id;

      const token = request.auth.credentials.token;

      Wreck.patch(
        apiUrl,
        {
          payload: JSON.stringify(request.payload),
          json: true,
          headers: {
            Authorization: 'Bearer' + token
          }
        },
        (err, res, payload) => {
          if (err) {
            throw err;
          }
          return reply.redirect('/bookmarks');
        }
      );
    },
    config: {
      auth: 'session'
    }
  });

  server.route({
    method: 'GET',
    path: '/bookmarks/{id}/delete',
    handler: function(request, reply) {
      const apiUrl =
        server.settings.app.apiBaseUrl + '/bookmarks/' + request.params.id;

      const token = request.auth.credentials.token;

      Wreck.delete(
        apiUrl,
        {
          json: true,
          headers: {
            Authorization: 'Bearer' + token
          }
        },
        (err, res, payload) => {
          if (err) {
            throw err;
          }
          return reply.redirect('/bookmarks');
        }
      );
    },
    config: {
      auth: 'session'
    }
  });

  server.route({
    method: 'GET',
    path: '/bookmarks/{id}/upvote',
    handler: function(request, reply) {
      const apiUrl =
        server.settings.app.apiBaseUrl +
        '/bookmarks/' +
        request.params.id +
        '/upvote';

      const token = request.auth.credentials.token;

      Wreck.post(
        apiUrl,
        {
          json: true,
          headers: {
            Authorization: 'Bearer' + token
          }
        },
        (err, res, payload) => {
          if (err) {
            throw err;
          }
          return reply.redirect('/bookmarks');
        }
      );
    },
    config: {
      auth: 'session'
    }
  });

  return next();
};

exports.register.attributes = {
  name: 'routes-bookmarks'
};
