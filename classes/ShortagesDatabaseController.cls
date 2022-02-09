public class ShortagesDatabaseController {
    
    @AuraEnabled
    public static EcardOperationlog getAllShortagesforEcard(string ecardbusstatus){
        EcardOperationlog log = new EcardOperationlog();
        AuthorisationData.Token tokendata = userAuthentication.getAccesstoken();
        string endpoint = System.Label.EcardAppendpoint+'api/ecardshortagedbsorted/';
        userAuthentication.ResponseWrapper statusresponse = userAuthentication.getData(endpoint+ecardbusstatus, 'GET', tokendata.access_token, tokendata.refresh_token);
        if(statusresponse.isError){
            log.isError = statusresponse.isError;
            log.operationlogresponse = statusresponse.responseBody;
            log.responsebody = statusresponse.responseBody;
            log.errorMessage = statusresponse.statusCode;
            if(statusresponse.statusCode == '401'){
                // Some error has happened
            }
            else{
                // Serious authentication error
            }
        }
        else{
            log.isError = statusresponse.isError;
            log.operationlogresponse = statusresponse.responseBody;
            log.responsebody = statusresponse.responseBody;
        }
        return log;
    }   
    
    @AuraEnabled
    public static EcardOperationlog getAllShortagesforPurchasing(string ecardbusstatus){
        EcardOperationlog log = new EcardOperationlog();
        AuthorisationData.Token tokendata = userAuthentication.getAccesstoken();
        string endpoint = System.Label.EcardAppendpoint+'api/purchaseshortagedbsorted/';
        userAuthentication.ResponseWrapper statusresponse = userAuthentication.getData(endpoint+ecardbusstatus, 'GET', tokendata.access_token, tokendata.refresh_token);
        if(statusresponse.isError){
            log.isError = statusresponse.isError;
            log.operationlogresponse = statusresponse.responseBody;
            log.responsebody = statusresponse.responseBody;
            log.errorMessage = statusresponse.statusCode;
            if(statusresponse.statusCode == '401'){
                // Some error has happened
            }
            else{
                // Serious authentication error
            }
        }
        else{
            log.isError = statusresponse.isError;
            log.operationlogresponse = statusresponse.responseBody;
            log.responsebody = statusresponse.responseBody;
        }
        return log;
    }

    public class EcardOperationlog{
        @auraEnabled
        public boolean isError{get;set;}
        @auraEnabled
        public Object operationlogresponse{get;set;}
         @auraEnabled
        public string responsebody{get;set;}
        @auraEnabled
        public string errorMessage{get;set;}
    }
}