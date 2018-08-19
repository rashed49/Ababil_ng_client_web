export const environment = {
  production: true,
  serviceapiurl: 'http://172.16.190.14:8080/ababil/api',
  documentServiceApiUrl: "http://172.16.215.22:8081",
  keycloakurl: 'http://172.16.190.21:8080/auth',
  realm: 'MISLBD',
  clientId: 'ababil-ng-ui',
  legacyAbabilUrl: 'http://192.168.1.185:9001/forms/frmservlet?config=ababil_ng',
  auth: 'NGSSO', //KEYCLOAK,LEGACY-ABABIL,NO-AUTH,FUTURE-AUTH,NGSSO
  legacyAbabilTokenServiceUrl: 'http://192.168.10.71:9797',
  reportServiceUrl: 'http://192.168.1.185:9002/reports/rwservlet?ng+report=',

  ngSsoConfiguration: {
    authUrl: 'http://172.16.190.18:8080',
    clientId: 'ngClient',
    clientSecret: 'secret'
  }
};
