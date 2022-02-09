public class userAuthentication {


    @AuraEnabled(cacheable=true)
    public static AuthorisationData EcardLogin(){
        try{
            string endpoint = System.Label.EcardAppendpoint+'api/sflogin';
            User ecardAppuser = [SELECT Id, Name, EmployeeNumber, Ecard_Access_Token__c, Ecard_Access_Time__c FROM User where Id =: UserInfo.getUserId()];
            string employeeId = ecardAppuser.EmployeeNumber;
            Ecard_Configs__mdt configs = [SELECT Id, DeveloperName, MasterLabel, QualifiedApiName, Label, Ecard_App_Key__c, Ecard_App_Secret__c FROM Ecard_Configs__mdt LIMIT 1];
            if(employeeId != null){
                LoginRequestWrapper loginrequest = new LoginRequestWrapper();
                loginrequest.app_key = configs.Ecard_App_Key__c;
                loginrequest.app_secret = configs.Ecard_App_Secret__c;
                loginrequest.emp_no = employeeId;
                string loginrequestbody = JSON.serialize(loginrequest);
                Http http = new Http();
                HttpRequest request = new HttpRequest();
                request.setEndpoint(endpoint);
                request.setMethod('POST');
                request.setHeader('Content-Type', 'application/json;charset=UTF-8');
                request.setBody(loginrequestbody);
                System.debug(request);
                HttpResponse response = http.send(request);
                System.debug(string.valueOf(response.getStatusCode()));
                if (response.getStatusCode() == 200) {
                    DateTime dt = System.Now();
                    dt.addMinutes(25);
                    AuthorisationData authdata = (AuthorisationData) System.JSON.deserialize(response.getBody(), AuthorisationData.class);
                    /*ecardAppuser.Ecard_Access_Token__c = authdata.data.token.access_token;
                    ecardAppuser.Ecard_Access_Time__c = dt;
                    update ecardAppuser;*/
                    System.debug(authdata.data.token);
                    return authdata;
                }
                else{
                    return null;
                }
            }
            else{
                return null;
            }
        }
        catch(Exception ex){
            System.debug(ex.getMessage());
            return null;
        }
    }

    @AuraEnabled
    public static string getAccess(){
        try{
            string accesstoken;
            User ecardAppuser = [SELECT Id, Name, EmployeeNumber, Ecard_Access_Token__c, Ecard_Access_Time__c FROM User where Id =: UserInfo.getUserId()];
            if(ecardAppuser.Ecard_Access_Time__c < System.Now()){
                accesstoken = ecardAppuser.Ecard_Access_Token__c;
            }
            else{
                AuthorisationData authdata = userAuthentication.EcardLogin();
                accesstoken = authdata.data.token.access_token;
            }
            return accesstoken;

        }
        catch(Exception ex){
            System.debug(ex.getMessage());
            return null;
        }
    }


    @AuraEnabled(cacheable=true)
    public static AuthorisationData.Token getAccesstoken(){
        try{
            string endpoint = System.Label.EcardAppendpoint+'api/sflogin';
            User ecardAppuser = [SELECT Id, Name, EmployeeNumber, Ecard_Access_Token__c, Ecard_Access_Time__c FROM User where Id =: UserInfo.getUserId()];
            string employeeId = ecardAppuser.EmployeeNumber;
            Ecard_Configs__mdt configs = [SELECT Id, DeveloperName, MasterLabel, QualifiedApiName, Label, Ecard_App_Key__c, Ecard_App_Secret__c FROM Ecard_Configs__mdt LIMIT 1];
            if(employeeId != null){
                LoginRequestWrapper loginrequest = new LoginRequestWrapper();
                loginrequest.app_key = configs.Ecard_App_Key__c;
                loginrequest.app_secret = configs.Ecard_App_Secret__c;
                loginrequest.emp_no = employeeId;
                string loginrequestbody = JSON.serialize(loginrequest);
                Http http = new Http();
                HttpRequest request = new HttpRequest();
                request.setEndpoint(endpoint);
                request.setMethod('POST');
                request.setHeader('Content-Type', 'application/json;charset=UTF-8');
                request.setBody(loginrequestbody);
                System.debug(request);
                HttpResponse response = http.send(request);
                System.debug(string.valueOf(response.getStatusCode()));
                if (response.getStatusCode() == 200) {
                    AuthorisationData authdata = (AuthorisationData) System.JSON.deserialize(response.getBody(), AuthorisationData.class);
                    System.debug(authdata.data.token);
                    return authdata.data.token;
                }
                else{
                    return null;
                }
            }
            else{
                return null;
            }
        }
        catch(Exception ex){
            System.debug(ex.getMessage());
            return null;
        }
    }
    
    /*@AuraEnabled(cacheable=true)
    public static AuthorisationData.Token getAccesstoken(){
        try{ */
            /*
             HttpRequest req = new HttpRequest();
			 req.setEndPoint('callout:ECard_App');
			 req.setMethod('POST');
			 Http http = new Http();
			 HttpResponse response = http.send(req);
			*/
            /*string username = '11112';
            string password = '1234';
            string endpoint = System.Label.EcardAppendpoint+'api/login';
            System.debug('endpoint'+endpoint);
            Http http = new Http();
            HttpRequest request = new HttpRequest();
            request.setEndpoint(endpoint);
            request.setMethod('POST');
            Blob headerValue = Blob.valueOf(username + ':' + password);
            String authorizationHeader = 'Basic ' + EncodingUtil.base64Encode(headerValue);
            request.setHeader('Authorization', authorizationHeader);
            System.debug('Authorization : '+authorizationHeader);
            System.debug('request : '+request);
            HttpResponse response = http.send(request);
            System.debug('response ->'+response);
            System.debug('statuscode'+response.getStatusCode());
            System.debug('response.getBody()'+response.getBody());
            // If the request is successful, parse the JSON response.
            if (response.getStatusCode() == 200) {
                // System.debug('response.getBody()'+response.getBody());
                AuthorisationData authdata = (AuthorisationData) System.JSON.deserialize(response.getBody(), AuthorisationData.class);
                System.debug('response.getBody()'+authdata.data.token);
                return authdata.data.token;
                
            }
            else{
                return null;
            }
            
        }catch(Exception ex){
            
            return null;
        }
        
    }*/
    
    
    @AuraEnabled(cacheable=true)
    public static string getRefreshtoken(string refreshtoken){
        Http http = new Http();
        HttpRequest request = new HttpRequest();
        string endpoint = System.Label.EcardAppendpoint+'api/refresh';
        request.setEndpoint(endpoint);
        request.setMethod('POST');
        String authorizationHeader = 'Bearer ' + refreshtoken;
        request.setHeader('Authorization', authorizationHeader);
        HttpResponse response = http.send(request);
        // If the request is successful, parse the JSON response.
        if (response.getStatusCode() == 200) {
            // System.debug('response.getBody()'+response.getBody());
            refreshTokenWrapper refreshata = (refreshTokenWrapper) System.JSON.deserialize(response.getBody(), refreshTokenWrapper.class);
            System.debug('response.getBody()'+refreshata);
            return refreshata.access_token;
            
        }
        else{
            return null;
        }
    }
    
    
    @AuraEnabled(cacheable=true)
    public static ResponseWrapper getData(string endpoint, string method, string accesstoken, string refresh_token){
        try{
            ResponseWrapper wrapperobj = new ResponseWrapper();
            Http http = new Http();
            HttpRequest request = new HttpRequest();
            request.setEndpoint(endpoint);
            request.setMethod(method);
            request.setTimeout(30000);
            String authorizationHeader = 'Bearer ' + accesstoken;
            request.setHeader('Authorization', authorizationHeader);
            HttpResponse response = http.send(request);
            // If the request is successful, parse the JSON response.
            if (response.getStatusCode() == 200) {
                // System.debug('response.getBody()'+response.getBody());  
                wrapperobj.statusCode = string.valueOf(response.getStatusCode());   
                wrapperobj.responseBody = response.getBody();   
                wrapperobj.isError = false;   
                wrapperobj.latestAccesstoken = accesstoken;
                return wrapperobj;
            }
            else if (response.getStatusCode() == 401) {
                string newaccesstoken = userAuthentication.getRefreshtoken(accesstoken);
                getData(endpoint, method, newaccesstoken, refresh_token);
                wrapperobj.statusCode = string.valueOf(response.getStatusCode());   
                wrapperobj.responseBody = response.getBody();   
                wrapperobj.isError = true;   
                wrapperobj.latestAccesstoken = newaccesstoken;
                return wrapperobj;
                
            }
            else{
                wrapperobj.statusCode = string.valueOf(response.getStatusCode());   
                wrapperobj.responseBody = response.getBody();   
                wrapperobj.isError = true;   
                wrapperobj.latestAccesstoken = null;
                return wrapperobj;
            }
        }catch(Exception ex){
            ResponseWrapper wrapperobj = new ResponseWrapper();
            wrapperobj.statusCode = null;   
            wrapperobj.responseBody = null;   
            wrapperobj.isError = true;   
            wrapperobj.latestAccesstoken = null;
            return wrapperobj;
        }
        
    }
    
    @AuraEnabled(cacheable=true)
    public static ResponseWrapper postData(string endpoint, string method, string body, string accesstoken, string refresh_token){
        try{
            ResponseWrapper wrapperobj = new ResponseWrapper();
            Http http = new Http();
            HttpRequest request = new HttpRequest();
            request.setEndpoint(endpoint);
            request.setMethod(method);
            String authorizationHeader = 'Bearer ' + accesstoken;
            request.setHeader('Authorization', authorizationHeader);
            request.setHeader('Content-Type', 'application/json;charset=UTF-8');
            // Set the body as a JSON object
            request.setBody(body);
            System.debug(request);
            HttpResponse response = http.send(request);
            // Parse the JSON response
            System.debug(string.valueOf(response.getStatusCode()));
             System.debug(response.getBody());
            if (response.getStatusCode() == 200) {
                wrapperobj.statusCode = string.valueOf(response.getStatusCode());   
                wrapperobj.responseBody = response.getBody();   
                wrapperobj.isError = false;   
                wrapperobj.latestAccesstoken = accesstoken;
               }
            else {
                wrapperobj.statusCode = string.valueOf(response.getStatusCode());   
                wrapperobj.responseBody = response.getBody();   
                wrapperobj.isError = true;   
                
            }
            return wrapperobj;
        }
        catch(Exception ex){
            ResponseWrapper wrapperobj = new ResponseWrapper();
            wrapperobj.statusCode = null;   
            wrapperobj.responseBody = null;   
            wrapperobj.isError = true;   
            wrapperobj.latestAccesstoken = null;
            return wrapperobj;
        }
    }

    @AuraEnabled(cacheable=true)
     public static  ResponseWrapperData getPermissions(){
        ResponseWrapperData wrapobj = new ResponseWrapperData();
         try{
             AuthorisationData authdata = userAuthentication.EcardLogin();
             AuthorisationData.Token tokendata = authdata.data.token;
             Integer appuser_id = authdata.data.user.appuser_id;
             string endpoint = System.Label.EcardAppendpoint+'api/userauthorization/';
             //System.debug('gethelpdocument'+endpoint+ecardiddeptid);
             userAuthentication.ResponseWrapper response = userAuthentication.getData(endpoint+appuser_id, 'GET', tokendata.access_token, tokendata.refresh_token);
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
                  wrapobj.response = response;
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
    
    public class ResponseWrapper{
        @auraEnabled
        public string statusCode{get;set;}
        @auraEnabled
        public string responseBody{get;set;}
        @auraEnabled
        public string latestAccesstoken{get;set;}
        @auraEnabled
        public Boolean messsage{get;set;}
        @auraEnabled
        public Boolean isError{get;set;}
    }
    
    public class refreshTokenWrapper{
        @auraEnabled
        public string access_token{get;set;}
        @auraEnabled
        public string expiry_token{get;set;}
    }

    public class ResponseWrapperData{
        @auraEnabled
        public boolean isError{get;set;}
        @auraEnabled
        public Object response{get;set;}
         @auraEnabled
        public string responsebody{get;set;}
        @auraEnabled
        public string errorMessage{get;set;}
    }

    public class LoginRequestWrapper{
        @AuraEnabled
        public string app_key{get;set;}
        @AuraEnabled
        public string app_secret{get;set;}
        @AuraEnabled
        public string emp_no{get;set;}
    }
}