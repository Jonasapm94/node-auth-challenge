import { Authenticator } from '@fastify/passport';
import { FastifyPluginAsync, FastifyPluginCallback, FastifyReply, FastifyRequest, preHandlerAsyncHookHandler } from 'fastify';
import plugin from 'fastify-plugin';
import { Strategy as LocalStrategy } from 'passport-local';
import { UserModel } from '../../database/models/UserModel.js';
import * as UsersController from '../controllers/usersController.js';
import * as SessionsController from '../controllers/sessionsController.js';
import 'fastify';

// it was declared here instead of another file because otherwise nodemin crashes 
// (it doesn't finds the type declaration in other file)
declare module 'fastify' {
  interface FastifyReply {
    locals?: any;
  }
}

export const authPlugin: FastifyPluginAsync = plugin(async (server, _) => {
  const authenticator = new Authenticator();

  server.register(authenticator.initialize());
  server.register(authenticator.secureSession());

  server.addHook('preHandler', (request, reply, done) => {
    reply.locals = reply.locals || {};
    reply.locals.currentUser = request.user || null;
    done()
  })

  authenticator.use(
    'localStrategy',
    new LocalStrategy({ usernameField: 'email', passwordField: 'password' }, (email, password, done) => {
      UserModel.authenticate({ email, password })
        .then((user?) => {
          if (user) {
            return done(null, user);
          }

          return done(null, false);
        })
        .catch(done);
    }),
  );

  authenticator.registerUserDeserializer<number, UserModel>(async (id) =>
    UserModel.query().findById(id).throwIfNotFound(),
  );

  authenticator.registerUserSerializer<UserModel, number>(async (user) => user.id);

  server.get('/signup', UsersController.create);
  server.post('/signup', UsersController.store);

  server.get('/logout', SessionsController.destroy);
  server.get('/login', SessionsController.create);
  server.post(
    '/login',
    authenticator.authenticate('localStrategy', {
      successRedirect: '/vehicles',
      failureRedirect: '/login',
    }),
  );
});
