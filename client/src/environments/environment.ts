// This file can be replaced during build by using the `fileReplacements` array.
// `ng build ---prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  APP: 'groupal',
  production: false,
  API_VERSION: 'api',
  API_BASE: window.location.protocol + '//' + window.location.hostname + ':8002',
  API_URL: window.location.origin + '/api/',
  APP_URL: window.location.origin,
  MEDIA_URL: window.location.origin + '/media/',
  GOOGLE_ANALYTICS: {
    CLIENT_ID: 'UA-113187324-3'
  },
};

/*
 * In development mode, to ignore zone related error stack frames such as
 * `zone.run`, `zoneDelegate.invokeTask` for easier debugging, you can
 * import the following file, but please comment it out in production mode
 * because it will have performance impact when throw error
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
