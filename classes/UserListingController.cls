public class UserListingController {
    // Get Customer Details
    @AuraEnabled
    public static  userManagement getallUsers(){
        userManagement wrapobj = new userManagement();
        try{
            AuthorisationData.Token tokendata = userAuthentication.getAccesstoken();
            string endpoint = System.Label.EcardAppendpoint+'api/user';
            //System.debug('gethelpdocument'+endpoint+ecardiddeptid);
            userAuthentication.ResponseWrapper response = userAuthentication.getData(endpoint, 'GET', tokendata.access_token, tokendata.refresh_token);
            wrapobj.isError = response.isError;
            if(response.isError){
                wrapobj.errorMessage = response.statusCode;
                wrapobj.responsebody = response.responseBody;
                if(response.statusCode == '401'){
                    // Some error has happened
                }
                else{
                    // Serious authentication error
                }
            }
            else{
                
                wrapobj.responsebody = response.responseBody;
                // wrapobj.errorMessage = response;
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
    public static  userManagement getallDepartments(){
        userManagement wrapobj = new userManagement();
        try{
            AuthorisationData.Token tokendata = userAuthentication.getAccesstoken();
            string endpoint = System.Label.EcardAppendpoint+'api/alldepartments';
            //System.debug('gethelpdocument'+endpoint+ecardiddeptid);
            userAuthentication.ResponseWrapper response = userAuthentication.getData(endpoint, 'GET', tokendata.access_token, tokendata.refresh_token);
            wrapobj.isError = response.isError;
            if(response.isError){
                wrapobj.errorMessage = response.statusCode;
                wrapobj.responsebody = response.responseBody;
                if(response.statusCode == '401'){
                    // Some error has happened
                }
                else{
                    // Serious authentication error
                }
            }
            else{
                
                wrapobj.responsebody = response.responseBody;
                // wrapobj.errorMessage = response;
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
    public static userManagement addnewUser(string requestbody){
        userManagement log = new userManagement();
        AuthorisationData.Token tokendata = userAuthentication.getAccesstoken();
        string endpoint = System.Label.EcardAppendpoint+'api/user';
        userAuthentication.ResponseWrapper statusresponse = userAuthentication.postData(endpoint, 'POST', requestbody, tokendata.access_token, tokendata.refresh_token);
        if(statusresponse.isError){
            log.isError = statusresponse.isError;
            log.errorMessage = statusresponse.statusCode;
            log.responsebody = statusresponse.responseBody;
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
        System.debug('log ->'+log.isError);
        System.debug('operationlogresponse ->'+log.operationlogresponse);
        return log;
    }

    // Reset User Pin
    @AuraEnabled
    public static userManagement resetuserpin(string requestbody){
        userManagement log = new userManagement();
        AuthorisationData.Token tokendata = userAuthentication.getAccesstoken();
        string endpoint = System.Label.EcardAppendpoint+'api/resetuserpin';
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
            log.operationlogresponse = statusresponse.responseBody;
            log.responsebody = statusresponse.responseBody;
        }
        System.debug('log ->'+log.isError);
        System.debug('operationlogresponse ->'+log.operationlogresponse);
        return log;
    }
    @AuraEnabled
    public static userManagement deactivateUser(string requestbody){
        userManagement log = new userManagement();
        AuthorisationData.Token tokendata = userAuthentication.getAccesstoken();
        string endpoint = System.Label.EcardAppendpoint+'api/user';
        userAuthentication.ResponseWrapper statusresponse = userAuthentication.postData(endpoint, 'DELETE', requestbody, tokendata.access_token, tokendata.refresh_token);
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
            log.operationlogresponse = statusresponse.responseBody;
            log.responsebody = statusresponse.responseBody;
        }
        System.debug('log ->'+log.isError);
        System.debug('operationlogresponse ->'+log.operationlogresponse);
        return log;
    }

    @AuraEnabled
    public static userManagement updatednewUser(string requestbody){
        userManagement log = new userManagement();
        AuthorisationData.Token tokendata = userAuthentication.getAccesstoken();
        string endpoint = System.Label.EcardAppendpoint+'api/user';
        userAuthentication.ResponseWrapper statusresponse = userAuthentication.postData(endpoint, 'PUT', requestbody, tokendata.access_token, tokendata.refresh_token);
        if(statusresponse.isError){
            log.isError = statusresponse.isError;
            log.errorMessage = statusresponse.statusCode;
            log.responsebody = statusresponse.responseBody;
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
        System.debug('log ->'+log.isError);
        System.debug('operationlogresponse ->'+log.operationlogresponse);
        return log;
    }

    // Get Customer Details
    @AuraEnabled
    public static  userManagement getallCustomers(){
        userManagement wrapobj = new userManagement();
        try{
            AuthorisationData.Token tokendata = userAuthentication.getAccesstoken();
            string endpoint = System.Label.EcardAppendpoint+'api/customers';
            //System.debug('gethelpdocument'+endpoint+ecardiddeptid);
            userAuthentication.ResponseWrapper response = userAuthentication.getData(endpoint, 'GET', tokendata.access_token, tokendata.refresh_token);
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
                // wrapobj.errorMessage = response;
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

     // Get Customer Details
     @AuraEnabled
     public static  userManagement getalluserroles(){
         userManagement wrapobj = new userManagement();
         try{
             AuthorisationData.Token tokendata = userAuthentication.getAccesstoken();
             string endpoint = System.Label.EcardAppendpoint+'api/userroles';
             //System.debug('gethelpdocument'+endpoint+ecardiddeptid);
             userAuthentication.ResponseWrapper response = userAuthentication.getData(endpoint, 'GET', tokendata.access_token, tokendata.refresh_token);
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
                 // wrapobj.errorMessage = response;
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


    
    public class userManagement{
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