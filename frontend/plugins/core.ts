import { ApiHandler, AuthHandler } from './api'
// import { ApiHandler, AuthHandler } from './../../packages/core-api/src';
import { Context } from '@nuxt/types';
import { NuxtCookies } from 'cookie-universal-nuxt';

type $core = {
  api: ApiHandler,
  authHandler: AuthHandler,
};


declare module 'vue/types/vue' {
  interface Vue {
    $core: $core,
  }
}

declare module '@nuxt/types' {
  interface NuxtAppOptions {
    $core: $core;
  }

  interface Context {
    app: NuxtAppOptions;
    $cookies: NuxtCookies;
  }
}


export default (app: Context, inject: any) => {
  const authHandler = new AuthHandler(app.$cookies);
  let mainUrl = process.env.apiUrl ?? '';
  console.log({ mainUrl });
  const core = {
    actor: {},
    authHandler,
    api: new ApiHandler(mainUrl, authHandler, {
      callbacks: {
        redirectToLogin: () => {
          return app.redirect('/login');
        },
        handleSuccessAuth: () => {
          return app.redirect('/');
        },
        handleLogout: () => {
          return app.redirect('/login');
        }
      }
    }),
  };
  inject('core', core);
}
