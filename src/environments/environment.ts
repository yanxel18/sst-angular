

const mainURL = "http://localhost:3000";

export const environment = {
  production: false,
  APIURL: `${mainURL}/api`,
  DownloadURL: `${mainURL}/file/uploads`,
  LoginUrl:`${mainURL}/account/login`,
  Public:`${mainURL}/file/uploads`,
  AllowedDomain: ['localhost:3000']
};
