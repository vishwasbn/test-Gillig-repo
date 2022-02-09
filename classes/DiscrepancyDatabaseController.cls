public class DiscrepancyDatabaseController {
    
    @AuraEnabled(cacheable=true)
    public static  EcarddataWrapper getAllEcarddetails(){
        EcarddataWrapper wrapobj = new EcarddataWrapper();
        try{
            AuthorisationData.Token tokendata = userAuthentication.getAccesstoken();
            string endpoint = System.Label.EcardAppendpoint+'api/ecardschedule';
            userAuthentication.ResponseWrapper response = userAuthentication.getData(endpoint, 'GET', tokendata.access_token, tokendata.refresh_token);
            wrapobj.isError = response.isError;
            if(response.isError){
                wrapobj.errorMessage = response.statusCode;
                wrapobj.response = response.responseBody;
                if(response.statusCode == '401'){
                    // Some error has happened
                }
                else{
                    // Serious authentication error
                }
            }
            else{
                wrapobj.errorMessage = response.statusCode;
                wrapobj.response = response.responseBody;
                // wrapobj.errorMessage = response;
            }
            return wrapobj;
        }
        catch(Exception ex){
            wrapobj.isError = true;
            wrapobj.response = null;
            wrapobj.errorMessage = ex.getMessage();
            return wrapobj;
        }
    }

    @AuraEnabled
    public static EcardOperationlog getAllDiscrepanciesdetails(string ecardbusstatus){
        EcardOperationlog log = new EcardOperationlog();
        AuthorisationData.Token tokendata = userAuthentication.getAccesstoken();
        string endpoint = System.Label.EcardAppendpoint+'api/ecarddiscrepancydb/';
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

   /* @AuraEnabled
    public static  EcarddataWrapper getAllDiscrepanciesdetails(){
        EcarddataWrapper wrapobj = new EcarddataWrapper();
        try{
            AuthorisationData.Token tokendata = userAuthentication.getAccesstoken();
            string endpoint = System.Label.EcardAppendpoint+'api/ecarddiscrepancydb';
            userAuthentication.ResponseWrapper response = userAuthentication.getData(endpoint, 'GET', tokendata.access_token, tokendata.refresh_token);
            wrapobj.isError = response.isError;
            if(response.isError){
                wrapobj.errorMessage = response.statusCode+response.responseBody;
                if(response.statusCode == '401'){
                    // Some error has happened
                }
                else{
                    // Serious authentication error
                }
            }
            else{
                DataWrapperEcard datawrapperresponse = (DataWrapperEcard) System.JSON.deserialize(response.responseBody, DataWrapperEcard.class);
                wrapobj.datawrapperresponse = datawrapperresponse;
                wrapobj.errorMessage = response.statusCode;
            }
            return wrapobj;
        }
        catch(Exception ex){
            wrapobj.isError = true;
            wrapobj.response = null;
            wrapobj.errorMessage = ex.getMessage();
            return wrapobj;
        }
    } */
    
    @AuraEnabled
    public static  EcarddataWrapper getAllComments(string discrepancylogid){
        EcarddataWrapper wrapobj = new EcarddataWrapper();
        try{
            AuthorisationData.Token tokendata = userAuthentication.getAccesstoken();
            string endpoint = System.Label.EcardAppendpoint+'api/ecarddiscrepancycomments/'+discrepancylogid;
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
                wrapobj.response = response.responseBody;
                // wrapobj.errorMessage = response;
            }
            return wrapobj;
        }
        catch(Exception ex){
            wrapobj.isError = true;
            wrapobj.response = null;
            wrapobj.errorMessage = ex.getMessage();
            return wrapobj;
        }
    }
    
    @AuraEnabled
    public static EcardOperationlog addnewComment(string requestbody){
        EcardOperationlog log = new EcardOperationlog();
        AuthorisationData.Token tokendata = userAuthentication.getAccesstoken();
        
        string endpoint = System.Label.EcardAppendpoint+'api/discrepancycomments';
        
         
        userAuthentication.ResponseWrapper statusresponse = userAuthentication.postData(endpoint, 'POST', requestbody, tokendata.access_token, tokendata.refresh_token);
        if(statusresponse.isError){
            log.isError = statusresponse.isError;
            log.operationlogresponse = statusresponse.responseBody;
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
    
    
    
    
    @AuraEnabled(cacheable=true)
    public static PicklistResponse getPicklistOptions(string picklistName){
        PicklistResponse pickresp = new PicklistResponse();
        //departments 
        try{
            AuthorisationData.Token tokendata = userAuthentication.getAccesstoken();
            //string endpoint = 'https://demoapp-dev1.herokuapp.com/api/';
            string endpoint = System.Label.EcardAppendpoint+'api/';
            userAuthentication.ResponseWrapper response = userAuthentication.getData(endpoint+picklistName, 'GET', tokendata.access_token, tokendata.refresh_token);
            pickresp.isError = response.isError;
            
            if(response.isError){
                pickresp.errorMessage = response.statusCode;
                if(response.statusCode == '401'){
                    // Some error has happened
                }
                else{
                    // Serious authentication error
                }
            }
            else{
                List<options> pickoptions =  new List<options>(); 
                List<options> pickoptionswithvalue = new List<options>();
                DataWrapperEcard masterdata = (DataWrapperEcard) System.JSON.deserialize(response.responseBody , DataWrapperEcard.class);
                if(picklistName == 'departments'){
                    Options opt1 = new Options();
                    opt1.label = 'All Departments';
                    opt1.value = 'All Departments';
                    pickoptions.add(opt1);
                    pickoptionswithvalue.add(opt1);
                    for(DataWrapperEcard.departments departmentsvalue : masterdata.data.departments){
                        Options opt = new Options();
                        opt.label = departmentsvalue.department_name;
                        opt.value = departmentsvalue.department_name;
                        pickoptions.add(opt);
                        
                        Options optwithvalues = new Options();
                        optwithvalues.label = departmentsvalue.department_name;
                        optwithvalues.value = string.valueOf(departmentsvalue.department_name);
                        pickoptionswithvalue.add(optwithvalues);
                    }
                    
                }
                pickresp.options = pickoptions;
                pickresp.optionswithValue = pickoptionswithvalue;
            }
            return pickresp;
        }
        catch(Exception ex){
            pickresp.isError = true;
            pickresp.options = null;
            pickresp.errorMessage = ex.getMessage();
            return pickresp;
        }
    }
    
    @AuraEnabled
    public static EcardOperationlog raisenewDiscrepancy(string requestbody, string discrepancytype){
        EcardOperationlog log = new EcardOperationlog();
        AuthorisationData.Token tokendata = userAuthentication.getAccesstoken();
        //string endpoint = System.Label.EcardAppendpoint+'api/ecarddepartmentdiscrepancy';
        string endpoint;
        if(discrepancytype == 'department'){
             endpoint = System.Label.EcardAppendpoint+'api/ecarddepartmentdiscrepancy';
        }
        else{
            endpoint = System.Label.EcardAppendpoint+'api/ecardbuildstationdiscrepancy';
        }
        System.debug('@@@ End Point ::'+endpoint);
        System.debug('@@@ Request Body ::'+requestbody); 
        userAuthentication.ResponseWrapper statusresponse = userAuthentication.postData(endpoint, 'POST', requestbody, tokendata.access_token, tokendata.refresh_token);
        System.debug('@@@ Response ::'+ JSON.serialize(statusresponse));
        if(statusresponse.isError){
            log.isError = statusresponse.isError;
            log.operationlogresponse = statusresponse.responseBody;
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
    public static EcardOperationlog updateDiscrepancy(string requestbody){
        EcardOperationlog log = new EcardOperationlog();
        AuthorisationData.Token tokendata = userAuthentication.getAccesstoken();
        string endpoint = System.Label.EcardAppendpoint+'api/ecarddiscrepancy';
        userAuthentication.ResponseWrapper statusresponse = userAuthentication.postData(endpoint, 'PUT', requestbody, tokendata.access_token, tokendata.refresh_token);
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
        System.debug('log ->'+log.isError);
        System.debug('operationlogresponse ->'+log.operationlogresponse);
        return log;
    }

    @AuraEnabled
    public static EcardOperationlog getdiscrepancyimage(string buspictureid){
        EcardOperationlog log = new EcardOperationlog();
        AuthorisationData.Token tokendata = userAuthentication.getAccesstoken();
        string endpoint = System.Label.EcardAppendpoint+'api/busareapicturebyid/';
        userAuthentication.ResponseWrapper statusresponse = userAuthentication.getData(endpoint+buspictureid, 'GET', tokendata.access_token, tokendata.refresh_token);
        if(statusresponse.isError){
            log.isError = statusresponse.isError;
            log.operationlogresponse = statusresponse.responseBody;
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
    
    public class EcarddataWrapper{
        @auraEnabled
        public Object response{get;set;}
        @auraEnabled
        public Boolean isError{get;set;}
        @auraEnabled
        public string errorMessage{get;set;}
        @auraEnabled
        public DataWrapperEcard datawrapperresponse{get;set;}
    }
    
    public class PicklistResponse{
        @auraEnabled
        public List<options> options{get;set;}
        @auraEnabled
        public List<options> optionswithValue{get;set;}
        @auraEnabled
        public Boolean isError{get;set;}
        @auraEnabled
        public string errorMessage{get;set;}
    }
    
    public class options{
        @auraEnabled
        public string label{get;set;}
        @auraEnabled
        public string value{get;set;}
    }
}