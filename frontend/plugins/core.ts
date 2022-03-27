import { ApiHandler, AuthHandler } from './api';
// import { ApiHandler, AuthHandler } from './../../packages/core-api/src';
import { Context } from '@nuxt/types';
import { NuxtCookies } from 'cookie-universal-nuxt';

type $core = {
  api: ApiHandler,
  authHandler: AuthHandler,
  getFileIdLink(fileId: number): string
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
  console.log({mainUrl});
  let apiHandler = new ApiHandler(mainUrl, authHandler, {
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
  });
  const core: Partial<$core> = {
    authHandler,
    api: apiHandler,
    getFileIdLink: function (fileId) {
      return apiHandler.getMainUrl() + '/api/download?id=' + fileId + '&token=' + authHandler.getAccessToken();
    }
  };
  inject('core', core);
}
