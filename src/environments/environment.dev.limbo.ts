export const environment = {
    production: false,
    serviceapiurl: 'http://172.16.215.84:8080/ababil/api',
    //documentServiceApiUrl: 'http://172.16.215.22:8081',
    keycloakurl: 'http://172.16.190.21:8080/auth',
    realm: 'MISLBD',
    clientId: 'ababil-ng-local',
    legacyAbabilUrl: 'http://192.168.1.185:9001/forms/frmservlet?config=ababil_ng',
    auth: 'NO-AUTH',  //KEYCLOAK,LEGACY-ABABIL,NO-AUTH,FUTURE-AUTH
    legacyAbabilTokenServiceUrl: 'http://192.168.1.140:9797',
    reportServiceUrl: 'http://192.168.1.185:9002/reports/rwservlet?ng+report='
}  