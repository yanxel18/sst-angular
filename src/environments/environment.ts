// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  APIURL: 'http://172.21.20.90:3000/api',
  DownloadURL: 'http://172.21.20.90:3000/file/uploads',
  LoginUrl:'http://172.21.20.90:3000/account/login',
  Public:'http://172.21.20.90:3000/file/uploads'
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
