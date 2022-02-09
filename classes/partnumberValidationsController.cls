public class partnumberValidationsController {
  

    @AuraEnabled
    public static Responselog getpartnumbersearchlogs(string ecardid){
        Responselog wrapobj = new Responselog();
        try{
            AuthorisationData.Token tokendata = userAuthentication.getAccesstoken();
            string endpoint = System.Label.EcardAppendpoint+'api/partnumbervalidation/';
            userAuthentication.ResponseWrapper response = userAuthentication.getData(endpoint+ecardid, 'GET', tokendata.access_token, tokendata.refresh_token);
            wrapobj.isError = response.isError;
            if(response.isError){
                wrapobj.errorMessage = response.statusCode;
                if(response.statusCode == '401'){
                    // Some error has happened
                }
                else{
                    // Serious authentication error
                }
            }
            else{
                wrapobj.responsebody = response.responseBody;
            }
            return wrapobj;
        }
        catch(Exception ex){
            wrapobj.isError = true;
            wrapobj.responsebody = null;
            wrapobj.errorMessage = ex.getMessage();
            return wrapobj;
        }
    }

    @AuraEnabled
    public static Responselog searchpartnumber(string requestbody){
        Responselog log = new Responselog();
        AuthorisationData.Token tokendata = userAuthentication.getAccesstoken();
        string endpoint = System.Label.EcardAppendpoint+'api/partnumbervalidation';
        userAuthentication.ResponseWrapper statusresponse = userAuthentication.postData(endpoint, 'POST', requestbody, tokendata.access_token, tokendata.refresh_token);
        if(statusresponse.isError){
            log.isError = statusresponse.isError;
            log.responsebody = statusresponse.statusCode + statusresponse.responseBody;
            if(statusresponse.statusCode == '401'){
                // Some error has happened
            }
            else{
                // Serious authentication error
            }
        }
        else{
            log.isError = statusresponse.isError;
            log.logresponse = statusresponse.responseBody;
            log.responsebody = statusresponse.responseBody;
        }
        System.debug('log ->'+log.isError);
        System.debug('logresponse ->'+log.logresponse);
        return log;
    }

    public class Responselog{
        @auraEnabled
        public boolean isError{get;set;}
        @auraEnabled
        public Object logresponse{get;set;}
         @auraEnabled
        public string responsebody{get;set;}
        @auraEnabled
        public string errorMessage{get;set;}
    }
}