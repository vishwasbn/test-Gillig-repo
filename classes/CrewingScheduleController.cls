public class CrewingScheduleController {
    @AuraEnabled
     public static  ResponseWrapperData getDeparmentCrewingData(string selectednonpooldept){
         ResponseWrapperData wrapobj = new ResponseWrapperData();
         try{
             AuthorisationData authdata = userAuthentication.EcardLogin();
             String department_code = authdata.data.user.department_code;
             String department_id = authdata.data.user.department_id;
             wrapobj.user_department_code = department_code;
             wrapobj.user_department_id = department_id;
             wrapobj.user_role_id = String.valueOf(authdata.data.user.approle_id);
             string endpoint = System.Label.EcardAppendpoint+'api/assignedpoolcrewingschedules/'+selectednonpooldept; 
             userAuthentication.ResponseWrapper response = userAuthentication.getData(endpoint, 'GET', authdata.data.token.access_token, authdata.data.token.refresh_token);
             wrapobj.isError = response.isError;
             wrapobj.statusCode = response.statusCode;
             if(response.isError){
                 wrapobj.errorMessage = 'ERROR';
                 wrapobj.responsebody = response.responseBody;
             }
             else{
                 wrapobj.errorMessage = 'SUCCESS';
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
     public static  ResponseWrapperData getUnassignedUsersofPool(string selectednonpooldept){
         ResponseWrapperData wrapobj = new ResponseWrapperData();
         try{
             AuthorisationData authdata = userAuthentication.EcardLogin();
             String department_code = authdata.data.user.department_code;
             String department_id = authdata.data.user.department_id;
             wrapobj.user_department_code = department_code;
             wrapobj.user_department_id = department_id;
             wrapobj.user_role_id = String.valueOf(authdata.data.user.approle_id);
             string endpoint = System.Label.EcardAppendpoint+'api/unassignedpoolcrewingschedules/'+selectednonpooldept; // +department_code
             userAuthentication.ResponseWrapper response = userAuthentication.getData(endpoint, 'GET', authdata.data.token.access_token, authdata.data.token.refresh_token);
             wrapobj.isError = response.isError;
             wrapobj.statusCode = response.statusCode;
             if(response.isError){
                 wrapobj.errorMessage = 'ERROR';
                 wrapobj.responsebody = response.responseBody;
             }
             else{
                 wrapobj.errorMessage = 'SUCCESS';
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
     public static  ResponseWrapperData assignPoolUserstoDept(string requestbody){
         ResponseWrapperData wrapobj = new ResponseWrapperData();
         try{
             AuthorisationData authdata = userAuthentication.EcardLogin();
             String department_code = authdata.data.user.department_code;
             String department_id = authdata.data.user.department_id;
             wrapobj.user_department_code = department_code;
             wrapobj.user_department_id = department_id;
             wrapobj.user_role_id = String.valueOf(authdata.data.user.approle_id);
             string endpoint = System.Label.EcardAppendpoint+'api/crewingschedule';
             userAuthentication.ResponseWrapper response = userAuthentication.postData(endpoint, 'PUT', requestbody, authdata.data.token.access_token, authdata.data.token.refresh_token);
             wrapobj.isError = response.isError;
             wrapobj.statusCode = response.statusCode;
             if(response.isError){
                 wrapobj.errorMessage = 'ERROR';
                 wrapobj.responsebody = response.responseBody;
             }
             else{
                 wrapobj.errorMessage = 'SUCCESS';
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
     public static  ResponseWrapperData getBuildStationCrewingData(string deptid){
         ResponseWrapperData wrapobj = new ResponseWrapperData();
         try{
             AuthorisationData authdata = userAuthentication.EcardLogin();
             String department_code = authdata.data.user.department_code;
             String department_id = authdata.data.user.department_id;
             wrapobj.user_department_code = department_code;
             wrapobj.user_department_id = department_id;
             wrapobj.user_role_id = String.valueOf(authdata.data.user.approle_id);
             string endpoint = System.Label.EcardAppendpoint+'api/assignedcrewingschedules/'+deptid;
             userAuthentication.ResponseWrapper response = userAuthentication.getData(endpoint, 'GET', authdata.data.token.access_token, authdata.data.token.refresh_token);
             wrapobj.isError = response.isError;
             wrapobj.statusCode = response.statusCode;
             if(response.isError){
                 wrapobj.errorMessage = 'ERROR';
                 wrapobj.responsebody = response.responseBody;
             }
             else{
                 wrapobj.errorMessage = 'SUCCESS';
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
     public static  ResponseWrapperData getUnassignedUsersofDepartment(string deptid){
         ResponseWrapperData wrapobj = new ResponseWrapperData();
         try{
             AuthorisationData authdata = userAuthentication.EcardLogin();
             String department_code = authdata.data.user.department_code;
             String department_id = authdata.data.user.department_id;
             wrapobj.user_department_code = department_code;
             wrapobj.user_department_id = department_id;
             wrapobj.user_role_id = String.valueOf(authdata.data.user.approle_id);
             string endpoint = System.Label.EcardAppendpoint+'api/unassignedcrewingschedules/'+deptid;
             userAuthentication.ResponseWrapper response = userAuthentication.getData(endpoint, 'GET', authdata.data.token.access_token, authdata.data.token.refresh_token);
             wrapobj.isError = response.isError;
             wrapobj.statusCode = response.statusCode;
             if(response.isError){
                 wrapobj.errorMessage = 'ERROR';
                 wrapobj.responsebody = response.responseBody;
             }
             else{
                 wrapobj.errorMessage = 'SUCCESS';
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
     public static  ResponseWrapperData assignPoolUserstoBuildStation(string requestbody){
         ResponseWrapperData wrapobj = new ResponseWrapperData();
         try{
             AuthorisationData authdata = userAuthentication.EcardLogin();
             String department_code = authdata.data.user.department_code;
             String department_id = authdata.data.user.department_id;
             wrapobj.user_department_code = department_code;
             wrapobj.user_department_id = department_id;
             wrapobj.user_role_id = String.valueOf(authdata.data.user.approle_id);
             string endpoint = System.Label.EcardAppendpoint+'api/crewingschedulebuildstation';
             userAuthentication.ResponseWrapper response = userAuthentication.postData(endpoint, 'PUT', requestbody, authdata.data.token.access_token, authdata.data.token.refresh_token);
             wrapobj.isError = response.isError;
             wrapobj.statusCode = response.statusCode;
             if(response.isError){
                 wrapobj.errorMessage = 'ERROR';
                 wrapobj.responsebody = response.responseBody;
             }
             else{
                 wrapobj.errorMessage = 'SUCCESS';
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
     public static  ResponseWrapperData getcrewingsuserslist(string deptid){
         ResponseWrapperData wrapobj = new ResponseWrapperData();
         try{
             AuthorisationData authdata = userAuthentication.EcardLogin();
             string endpoint = System.Label.EcardAppendpoint+'api/crewingsuser/'+deptid;
             userAuthentication.ResponseWrapper response = userAuthentication.getData(endpoint, 'GET', authdata.data.token.access_token, authdata.data.token.refresh_token);
             wrapobj.isError = response.isError;
             wrapobj.statusCode = response.statusCode;
             if(response.isError){
                 wrapobj.errorMessage = 'ERROR';
                 wrapobj.responsebody = response.responseBody;
             }
             else{
                 wrapobj.errorMessage = 'SUCCESS';
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

  
    public class ResponseWrapperData{
        @auraEnabled
        public String statusCode{get;set;}
        @auraEnabled
        public String responsebody{get;set;}
        @auraEnabled
        public String errorMessage{get;set;}
        @auraEnabled
        public Boolean isError{get;set;}
        @auraEnabled
        public String user_department_code{get;set;}
        @auraEnabled
        public String user_department_id{get;set;}
        @auraEnabled
        public String user_role_id{get;set;}
    }
}