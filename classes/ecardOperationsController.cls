public class ecardOperationsController {


    @AuraEnabled
    public static  EcardOperationlog getOperationslist(string ecardiddeptid){
        EcardOperationlog wrapobj = new EcardOperationlog();
        try{
            AuthorisationData.Token tokendata = userAuthentication.getAccesstoken();
            string endpoint = System.Label.EcardAppendpoint+'api/buildstationmappingdetails/';
            System.debug(endpoint+ecardiddeptid);
            userAuthentication.ResponseWrapper response = userAuthentication.getData(endpoint+ecardiddeptid, 'GET', tokendata.access_token, tokendata.refresh_token);
            wrapobj.isError = response.isError;
            if(response.isError){
                wrapobj.errorMessage = response.statusCode;
                wrapobj.responsebody = response.responseBody;
                if(response.statusCode == '401'){
                    // Some error has happened
                }
                else{
                   	throw new EcardOperationsException(response.statusCode); 
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
    public static EcardOperationsWrapper getDepartmentOperations(string ecardiddeptid){
        System.debug('ecardiddeptid'+ecardiddeptid);
        // string e = '{"ecard_id":"2","dept_id":"110"}';
        EcardOperationsWrapper ecardoperations = new EcardOperationsWrapper();
        AuthorisationData.Token tokendata = userAuthentication.getAccesstoken();
        string endpoint = System.Label.EcardAppendpoint+'api/buildstationmappingdetails/';
        System.debug(endpoint+ecardiddeptid);
        userAuthentication.ResponseWrapper buildstationresponse = userAuthentication.getData(endpoint+ecardiddeptid, 'GET', tokendata.access_token, tokendata.refresh_token);
        
        if(buildstationresponse.isError){
            ecardoperations.isError = buildstationresponse.isError;
            if(buildstationresponse.statusCode == '401'){
                // Some error has happened
            }
            else{
                // Serious authentication error
            }
        }
        else{
            ecardoperations.isError = buildstationresponse.isError;
            ecardoperations.builstationMapWrapper = BuildStationMappingWrapper.parse(buildstationresponse.responseBody).data;
            ecardoperations.buildstationList = getBuildstations(buildstationresponse.responseBody);
            ecardoperations.userforbsList = getUsersList(buildstationresponse.responseBody);
            System.debug('buildstationList'+ecardoperations.buildstationList);
            System.debug('ecardoperations.userforbsList'+ecardoperations.userforbsList);
        }
        return ecardoperations;
    }

    @AuraEnabled
    public static  EcardOperationlog getDefectCodes(){
        EcardOperationlog wrapobj = new EcardOperationlog();
        try{
            AuthorisationData.Token tokendata = userAuthentication.getAccesstoken();
            string endpoint = System.Label.EcardAppendpoint+'api/defect';
            userAuthentication.ResponseWrapper response = userAuthentication.getData(endpoint, 'GET', tokendata.access_token, tokendata.refresh_token);
            wrapobj.isError = response.isError;
            if(response.isError){
                wrapobj.errorMessage = response.statusCode;
                wrapobj.responsebody = response.responseBody;
                if(response.statusCode == '401'){
                    // Some error has happened
                }
                else{
                    throw new EcardOperationsException(response.statusCode); 
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
    public static  EcardOperationlog addnewDefectcode(string requestbody){
        EcardOperationlog wrapobj = new EcardOperationlog();
        try{
            AuthorisationData.Token tokendata = userAuthentication.getAccesstoken();
            string endpoint = System.Label.EcardAppendpoint+'api/defectcode';
            userAuthentication.ResponseWrapper response = userAuthentication.postData(endpoint, 'POST', requestbody, tokendata.access_token, tokendata.refresh_token);
            wrapobj.isError = response.isError;
            if(response.isError){
                wrapobj.errorMessage = response.statusCode;
                wrapobj.responsebody = response.responseBody;
                if(response.statusCode == '401'){
                    // Some error has happened
                }
                else{
                    throw new EcardOperationsException(response.statusCode); 
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
    public static  EcardOperationlog updateDefectcode(string requestbody){
        EcardOperationlog wrapobj = new EcardOperationlog();
        try{
            AuthorisationData.Token tokendata = userAuthentication.getAccesstoken();
            string endpoint = System.Label.EcardAppendpoint+'api/defectcode';
            userAuthentication.ResponseWrapper response = userAuthentication.postData(endpoint, 'PUT', requestbody, tokendata.access_token, tokendata.refresh_token);
            System.debug('Response Body' + response);
            wrapobj.isError = response.isError;
            if(response.isError){
                wrapobj.errorMessage = response.statusCode;
                wrapobj.responsebody = response.responseBody;
                if(response.statusCode == '202'){
                    return wrapobj;
                    // Some error has happened
                }
                else{
                    throw new EcardOperationsException(response.statusCode); 
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
    public static  EcardOperationlog updateDefectstatus(string requestbody){
        EcardOperationlog wrapobj = new EcardOperationlog();
        try{
            AuthorisationData.Token tokendata = userAuthentication.getAccesstoken();
            string endpoint = System.Label.EcardAppendpoint+'api/defectcode';
            userAuthentication.ResponseWrapper response = userAuthentication.postData(endpoint, 'DELETE', requestbody, tokendata.access_token, tokendata.refresh_token);
            wrapobj.isError = response.isError;
            if(response.isError){
                wrapobj.errorMessage = response.statusCode;
                wrapobj.responsebody = response.responseBody;
                if(response.statusCode == '401'){
                    // Some error has happened
                }
                else{
                    throw new EcardOperationsException(response.statusCode); 
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

    // Delete Ecard Discrepancy or Shortage
    @AuraEnabled
    public static  EcardOperationlog deleteDiscOrShortage(string requestbody){
            EcardOperationlog wrapobj = new EcardOperationlog();
            try{
                AuthorisationData.Token tokendata = userAuthentication.getAccesstoken();
                string endpoint = System.Label.EcardAppendpoint+'api/discrepancy';
                userAuthentication.ResponseWrapper response = userAuthentication.postData(endpoint, 'DELETE', requestbody, tokendata.access_token, tokendata.refresh_token);
                wrapobj.isError = response.isError;
                if(response.isError){
                    wrapobj.errorMessage = response.statusCode;
                    wrapobj.responsebody = response.responseBody;
                    if(response.statusCode == '401'){
                    }
                    else{
                        throw new EcardOperationsException(response.statusCode); 
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
    public static  EcardOperationlog getAllMeetingNotes(){
        EcardOperationlog wrapobj = new EcardOperationlog();
        try{
            AuthorisationData.Token tokendata = userAuthentication.getAccesstoken();
            string endpoint = System.Label.EcardAppendpoint+'api/meetingnote';
            userAuthentication.ResponseWrapper response = userAuthentication.getData(endpoint, 'GET', tokendata.access_token, tokendata.refresh_token);
            wrapobj.isError = response.isError;
            if(response.isError){
                wrapobj.errorMessage = response.statusCode;
                wrapobj.responsebody = response.responseBody;
                if(response.statusCode == '401'){
                    // Some error has happened
                }
                else{
                    throw new EcardOperationsException(response.statusCode); 
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
    public static  EcardOperationlog addnewMeetingNote(string requestbody){
        EcardOperationlog wrapobj = new EcardOperationlog();
        try{
            AuthorisationData.Token tokendata = userAuthentication.getAccesstoken();
            string endpoint = System.Label.EcardAppendpoint+'api/meetingnote';
            userAuthentication.ResponseWrapper response = userAuthentication.postData(endpoint, 'POST', requestbody, tokendata.access_token, tokendata.refresh_token);
            wrapobj.isError = response.isError;
            if(response.isError){
                wrapobj.errorMessage = response.statusCode;
                wrapobj.responsebody = response.responseBody;
                if(response.statusCode == '401'){
                    // Some error has happened
                }
                else{
                    throw new EcardOperationsException(response.statusCode); 
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
    public static  EcardOperationlog addbusimage(string requestbody){
        EcardOperationlog wrapobj = new EcardOperationlog();
        try{
            AuthorisationData.Token tokendata = userAuthentication.getAccesstoken();
            string endpoint = System.Label.EcardAppendpoint+'api/addfleetimage';
            userAuthentication.ResponseWrapper response = userAuthentication.postData(endpoint, 'POST', requestbody, tokendata.access_token, tokendata.refresh_token);
            wrapobj.isError = response.isError;
            if(response.isError){
                wrapobj.errorMessage = response.statusCode;
                wrapobj.responsebody = response.responseBody;
                if(response.statusCode == '401'){
                    // Some error has happened
                }
                else{
                    throw new EcardOperationsException(response.statusCode); 
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
    public static  EcardOperationlog updateMeetingNote(string requestbody){
        EcardOperationlog wrapobj = new EcardOperationlog();
        try{
            AuthorisationData.Token tokendata = userAuthentication.getAccesstoken();
            string endpoint = System.Label.EcardAppendpoint+'api/meetingnote';
            userAuthentication.ResponseWrapper response = userAuthentication.postData(endpoint, 'PUT', requestbody, tokendata.access_token, tokendata.refresh_token);
            wrapobj.isError = response.isError;
            if(response.isError){
                wrapobj.errorMessage = response.statusCode;
                wrapobj.responsebody = response.responseBody;
                if(response.statusCode == '401'){
                    // Some error has happened
                }
                else{
                    throw new EcardOperationsException(response.statusCode); 
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
    public static  EcardOperationlog deleteMeetingNote(string requestbody){
        EcardOperationlog wrapobj = new EcardOperationlog();
        try{
            AuthorisationData.Token tokendata = userAuthentication.getAccesstoken();
            string endpoint = System.Label.EcardAppendpoint+'api/meetingnote';
            userAuthentication.ResponseWrapper response = userAuthentication.postData(endpoint, 'DELETE', requestbody, tokendata.access_token, tokendata.refresh_token);
            wrapobj.isError = response.isError;
            if(response.isError){
                wrapobj.errorMessage = response.statusCode;
                wrapobj.responsebody = response.responseBody;
                if(response.statusCode == '401'){
                    // Some error has happened
                }
                else{
                    throw new EcardOperationsException(response.statusCode); 
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
    public static  EcardOperationlog getAllHelpDocs(){
        EcardOperationlog wrapobj = new EcardOperationlog();
        try{
            AuthorisationData.Token tokendata = userAuthentication.getAccesstoken();
            string endpoint = System.Label.EcardAppendpoint+'api/helpdocument';
            userAuthentication.ResponseWrapper response = userAuthentication.getData(endpoint, 'GET', tokendata.access_token, tokendata.refresh_token);
            wrapobj.isError = response.isError;
            if(response.isError){
                wrapobj.errorMessage = response.statusCode;
                wrapobj.responsebody = response.responseBody;
                if(response.statusCode == '401'){
                    // Some error has happened
                }
                else{
                    throw new EcardOperationsException(response.statusCode); 
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
    public static  EcardOperationlog addnewHelpDocs(string requestbody){
        EcardOperationlog wrapobj = new EcardOperationlog();
        try{
            AuthorisationData.Token tokendata = userAuthentication.getAccesstoken();
            string endpoint = System.Label.EcardAppendpoint+'api/helpdocument';
            userAuthentication.ResponseWrapper response = userAuthentication.postData(endpoint, 'POST', requestbody, tokendata.access_token, tokendata.refresh_token);
            wrapobj.isError = response.isError;
            if(response.isError){
                wrapobj.errorMessage = response.statusCode;
                wrapobj.responsebody = response.responseBody;
                if(response.statusCode == '401'){
                    // Some error has happened
                }
                else{
                    throw new EcardOperationsException(response.statusCode); 
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
    public static  EcardOperationlog updateHelpDocs(string requestbody){
        EcardOperationlog wrapobj = new EcardOperationlog();
        try{
            AuthorisationData.Token tokendata = userAuthentication.getAccesstoken();
            string endpoint = System.Label.EcardAppendpoint+'api/helpdocument';
            userAuthentication.ResponseWrapper response = userAuthentication.postData(endpoint, 'PUT', requestbody, tokendata.access_token, tokendata.refresh_token);
            wrapobj.isError = response.isError;
            if(response.isError){
                wrapobj.errorMessage = response.statusCode;
                wrapobj.responsebody = response.responseBody;
                if(response.statusCode == '401'){
                    // Some error has happened
                }
                else{
                    throw new EcardOperationsException(response.statusCode); 
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
    public static  EcardOperationlog deleteHelpDocs(string requestbody){
        EcardOperationlog wrapobj = new EcardOperationlog();
        try{
            AuthorisationData.Token tokendata = userAuthentication.getAccesstoken();
            string endpoint = System.Label.EcardAppendpoint+'api/helpdocument';
            userAuthentication.ResponseWrapper response = userAuthentication.postData(endpoint, 'DELETE', requestbody, tokendata.access_token, tokendata.refresh_token);
            wrapobj.isError = response.isError;
            if(response.isError){
                wrapobj.errorMessage = response.statusCode;
                wrapobj.responsebody = response.responseBody;
                if(response.statusCode == '401'){
                    // Some error has happened
                }
                else{
                    throw new EcardOperationsException(response.statusCode); 
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
    public static  EcardOperationlog getQCChecklists(){
        EcardOperationlog wrapobj = new EcardOperationlog();
        try{
            AuthorisationData.Token tokendata = userAuthentication.getAccesstoken();
            string endpoint = System.Label.EcardAppendpoint+'api/qcchecklist';
            userAuthentication.ResponseWrapper response = userAuthentication.getData(endpoint, 'GET', tokendata.access_token, tokendata.refresh_token);
            wrapobj.isError = response.isError;
            if(response.isError){
                wrapobj.errorMessage = response.statusCode;
                wrapobj.responsebody = response.responseBody;
                if(response.statusCode == '401'){
                    // Some error has happened
                }
                else{
                    throw new EcardOperationsException(response.statusCode); 
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
    public static  EcardOperationlog addnewQCChecklists(string requestbody){
        EcardOperationlog wrapobj = new EcardOperationlog();
        try{
            AuthorisationData.Token tokendata = userAuthentication.getAccesstoken();
            string endpoint = System.Label.EcardAppendpoint+'api/qcchecklist';
            userAuthentication.ResponseWrapper response = userAuthentication.postData(endpoint, 'POST', requestbody, tokendata.access_token, tokendata.refresh_token);
            system.debug('@@@Response::'+response);
            wrapobj.isError = response.isError;
            if(response.isError){
                wrapobj.errorMessage = response.statusCode;
                wrapobj.responsebody = response.responseBody;
                if(response.statusCode == '401'){
                    // Some error has happened
                }
                else{
                    throw new EcardOperationsException(response.statusCode); 
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
    public static  EcardOperationlog updateQCChecklists(string requestbody){
        EcardOperationlog wrapobj = new EcardOperationlog();
        try{
            AuthorisationData.Token tokendata = userAuthentication.getAccesstoken();
            string endpoint = System.Label.EcardAppendpoint+'api/qcchecklist';
            userAuthentication.ResponseWrapper response = userAuthentication.postData(endpoint, 'PUT', requestbody, tokendata.access_token, tokendata.refresh_token);
            wrapobj.isError = response.isError;
            if(response.isError){
                wrapobj.errorMessage = response.statusCode;
                wrapobj.responsebody = response.responseBody;
                if(response.statusCode == '401'){
                    // Some error has happened
                }
                else{
                    throw new EcardOperationsException(response.statusCode); 
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
    public static  EcardOperationlog deleteQCChecklists(string requestbody){
        EcardOperationlog wrapobj = new EcardOperationlog();
        try{
            AuthorisationData.Token tokendata = userAuthentication.getAccesstoken();
            string endpoint = System.Label.EcardAppendpoint+'api/qcchecklist';
            userAuthentication.ResponseWrapper response = userAuthentication.postData(endpoint, 'DELETE', requestbody, tokendata.access_token, tokendata.refresh_token);
            wrapobj.isError = response.isError;
            if(response.isError){
                wrapobj.errorMessage = response.statusCode;
                wrapobj.responsebody = response.responseBody;
                if(response.statusCode == '401'){
                    // Some error has happened
                }
                else{
                    throw new EcardOperationsException(response.statusCode); 
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


    
    /*@AuraEnabled(cacheable=true)
    public static DataWrapperEcard.data getDefectCodes(){
        DataWrapperEcard.data defectlist = new DataWrapperEcard.data();
        AuthorisationData.Token tokendata = userAuthentication.getAccesstoken();
        string endpoint = System.Label.EcardAppendpoint+'api/defectcode';
        userAuthentication.ResponseWrapper defectdetails = userAuthentication.getData(endpoint, 'GET', tokendata.access_token, tokendata.refresh_token);
        if(defectdetails.isError){
            if(defectdetails.statusCode == '401'){
                // Some error has happened
            }
            else{
                // Serious authentication error
            }
        }
        else{
            DataWrapperEcard wrap = (DataWrapperEcard) System.JSON.deserialize(defectdetails.responseBody, DataWrapperEcard.class);
            defectlist = wrap.data;
            
        }
        return defectlist;
        
    } */

    @AuraEnabled
    public static  EcardOperationlog getDiscrepancylist(string ecardiddeptid){
        EcardOperationlog wrapobj = new EcardOperationlog();
        try{
            AuthorisationData.Token tokendata = userAuthentication.getAccesstoken();
            string endpoint = System.Label.EcardAppendpoint+'api/ecarddiscrepancy/';
            System.debug(endpoint+ecardiddeptid);
            userAuthentication.ResponseWrapper response = userAuthentication.getData(endpoint+ecardiddeptid, 'GET', tokendata.access_token, tokendata.refresh_token);
            wrapobj.isError = response.isError;
            if(response.isError){
                wrapobj.errorMessage = response.statusCode;
                if(response.statusCode == '401'){
                    // Some error has happened
                }
                else{
                    throw new EcardOperationsException(response.statusCode); 
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
    public static EcardOperationsWrapper getDepartmentDiscrepancies(string ecardiddeptid){
        System.debug('ecardiddeptid'+ecardiddeptid);
         string e = '{"ecard_id":"10","dept_id":"101"}';
        EcardOperationsWrapper ecardoperations = new EcardOperationsWrapper();
        AuthorisationData.Token tokendata = userAuthentication.getAccesstoken();
        string endpoint = System.Label.EcardAppendpoint+'api/ecarddiscrepancy/';
        userAuthentication.ResponseWrapper buildstationresponse = userAuthentication.getData(endpoint+ecardiddeptid, 'GET', tokendata.access_token, tokendata.refresh_token);
        
        if(buildstationresponse.isError){
            ecardoperations.isError = buildstationresponse.isError;
            if(buildstationresponse.statusCode == '401'){
                // Some error has happened
            }
            else{
                // Serious authentication error
            }
        }
        else{
            ecardoperations.isError = buildstationresponse.isError;
            ecardoperations.discrepancyWrapper = BuildStationMappingWrapper.parse(buildstationresponse.responseBody).data;
            }
        return ecardoperations;
    }

    @AuraEnabled
    public static  EcardOperationlog getShortageslist(string ecardiddeptid){
        EcardOperationlog wrapobj = new EcardOperationlog();
        try{
            AuthorisationData.Token tokendata = userAuthentication.getAccesstoken();
            string endpoint = System.Label.EcardAppendpoint+'api/ecardpartshortagediscrepancy/';
            System.debug(endpoint+ecardiddeptid);
            userAuthentication.ResponseWrapper response = userAuthentication.getData(endpoint+ecardiddeptid, 'GET', tokendata.access_token, tokendata.refresh_token);
            wrapobj.isError = response.isError;
            if(response.isError){
                wrapobj.errorMessage = response.statusCode;
                if(response.statusCode == '401'){
                    // Some error has happened
                }
                else{
                    throw new EcardOperationsException(response.statusCode); 
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
    public static EcardOperationsWrapper getDepartmentShortages(string ecardiddeptid){
        System.debug('ecardiddeptid'+ecardiddeptid);
         string e = '{"ecard_id":"15","dept_id":"101"}';
        EcardOperationsWrapper ecardoperations = new EcardOperationsWrapper();
        AuthorisationData.Token tokendata = userAuthentication.getAccesstoken();
        string endpoint = System.Label.EcardAppendpoint+'api/ecardpartshortagediscrepancy/';
        userAuthentication.ResponseWrapper buildstationresponse = userAuthentication.getData(endpoint+ecardiddeptid, 'GET', tokendata.access_token, tokendata.refresh_token);
        
        if(buildstationresponse.isError){
            ecardoperations.isError = buildstationresponse.isError;
            if(buildstationresponse.statusCode == '401'){
                // Some error has happened
            }
            else{
                // Serious authentication error
            }
        }
        else{
            ecardoperations.isError = buildstationresponse.isError;
            ecardoperations.discrepancyWrapper = BuildStationMappingWrapper.parse(buildstationresponse.responseBody).data;
            }
        return ecardoperations;
    }
   
    @AuraEnabled(cacheable=true)
    public static List<Options> getBuildstations(string buildstationresponse){
        List<Options> buildstationoptions = new List<Options>();
        BuildStationMappingWrapper bsmapwrap = BuildStationMappingWrapper.parse(buildstationresponse);
        for(BuildStationMappingWrapper.workcenter bsmapobj : bsmapwrap.data.workcenter){
            for(BuildStationMappingWrapper.Buildstation bs : bsmapobj.buildstation){
                Options opt = new Options();
                opt.label = bs.buildstation_code+' - '+bs.operation;
                opt.value = string.valueOf(bs.buildstation_id);
                opt.workcentreId = bsmapobj.workcenter_id;
                opt.workcentreName = bsmapobj.workcentername;
                buildstationoptions.add(opt);
            }
        }
        return buildstationoptions;
      }
    
    @AuraEnabled(cacheable=true)
    public static List<buildstationUserWrap> getUsersList(string buildstationresponse){
        List<buildstationUserWrap> bsuserwrap = new List<buildstationUserWrap>();
        BuildStationMappingWrapper bsmapwrap = BuildStationMappingWrapper.parse(buildstationresponse);
        List<BuildStationMappingWrapper.Qc> departmentQc = bsmapwrap.data.qc;
        for(BuildStationMappingWrapper.workcenter bsmapobj : bsmapwrap.data.workcenter){
            for(BuildStationMappingWrapper.Buildstation bs : bsmapobj.buildstation){
                buildstationUserWrap bwrap = new buildstationUserWrap();
                bwrap.Prod = bs.prod;
                bwrap.Qc = departmentQc;
                bsuserwrap.add(bwrap);
            }
        }
        return bsuserwrap;
    }
    
    @AuraEnabled
    public static EcardOperationlog insertOperationlog(string requestbody){
        EcardOperationlog log = new EcardOperationlog();
        AuthorisationData.Token tokendata = userAuthentication.getAccesstoken();
        string endpoint = System.Label.EcardAppendpoint+'api/ecardoperationlog';
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
         
        System.debug('operationlogresponse ->'+log.operationlogresponse);
        return log;
    }
    
     @AuraEnabled
    public static EcardOperationlog updateOperationlog(string requestbody){
        EcardOperationlog log = new EcardOperationlog();
        AuthorisationData.Token tokendata = userAuthentication.getAccesstoken();
        string endpoint = System.Label.EcardAppendpoint+'api/ecardoperationlog';
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
         
        System.debug('operationlogresponse ->'+log.operationlogresponse);
        return log;
    }
    
   /* @AuraEnabled
    public static EcardOperationlog setStatustoResolve(string requestbody){
        EcardOperationlog log = new EcardOperationlog();
        AuthorisationData.Token tokendata = userAuthentication.getAccesstoken();
          string endpoint = System.Label.EcardAppendpoint+'api/ecardoperationlog';
        userAuthentication.ResponseWrapper statusresponse = userAuthentication.postData(endpoint, 'POST', requestbody, tokendata.access_token, tokendata.refresh_token);
        if(statusresponse.isError){
            log.isError = statusresponse.isError;
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
         
        System.debug('operationlogresponse ->'+log.operationlogresponse);
        return log;
    }
    
     @AuraEnabled
    public static EcardOperationlog setStatustoVerify(string requestbody){
        EcardOperationlog log = new EcardOperationlog();
        AuthorisationData.Token tokendata = userAuthentication.getAccesstoken();
          string endpoint = System.Label.EcardAppendpoint+'api/ecardoperationlog';
        userAuthentication.ResponseWrapper statusresponse = userAuthentication.postData(endpoint, 'PUT', requestbody, tokendata.access_token, tokendata.refresh_token);
        if(statusresponse.isError){
            log.isError = statusresponse.isError;
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
         
        System.debug('operationlogresponse ->'+log.operationlogresponse);
        return log;
    }
    
    @AuraEnabled
    public static EcardOperationlog setStatustoReject(string requestbody){
        EcardOperationlog log = new EcardOperationlog();
        AuthorisationData.Token tokendata = userAuthentication.getAccesstoken();
        string endpoint = System.Label.EcardAppendpoint+'api/rejectecardoperationlog';
        userAuthentication.ResponseWrapper statusresponse = userAuthentication.postData(endpoint, 'POST', requestbody, tokendata.access_token, tokendata.refresh_token);
        if(statusresponse.isError){
            log.isError = statusresponse.isError;
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
         
        System.debug('operationlogresponse ->'+log.operationlogresponse);
        return log;
    }*/
    
    @AuraEnabled
    public static EcardOperationlog raiseBsDiscrepancy(string requestbody){
        EcardOperationlog log = new EcardOperationlog();
        AuthorisationData.Token tokendata = userAuthentication.getAccesstoken();
        string endpoint = System.Label.EcardAppendpoint+'api/ecardbuildstationdiscrepancy';
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
         
        System.debug('operationlogresponse ->'+log.operationlogresponse);
        return log;
    }
    
    @AuraEnabled
    public static EcardOperationlog raisenewShortage(string requestbody){
        EcardOperationlog log = new EcardOperationlog();
        AuthorisationData.Token tokendata = userAuthentication.getAccesstoken();
        string endpoint = System.Label.EcardAppendpoint+'api/ecardpartshortagediscrepancy';
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
         
        System.debug('operationlogresponse ->'+log.operationlogresponse);
        return log;
    }
    
   @AuraEnabled
    public static EcardOperationlog raiseDepartmentDiscrepancy(string requestbody){
        EcardOperationlog log = new EcardOperationlog();
        AuthorisationData.Token tokendata = userAuthentication.getAccesstoken();
        string endpoint = System.Label.EcardAppendpoint+'api/ecarddepartmentdiscrepancy';
        //string endpoint = 'https://demoapp-dev1.herokuapp.com/api/ecarddepartmentdiscrepancy';
        userAuthentication.ResponseWrapper statusresponse = userAuthentication.postData(endpoint, 'POST', requestbody, tokendata.access_token, tokendata.refresh_token);
        if(statusresponse.isError){
            log.isError = statusresponse.isError;
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
         
        System.debug('operationlogresponse ->'+log.operationlogresponse);
        return log;
    }
    
    @AuraEnabled(cacheable=true)
    public static  EcardOperationlog getBusPartdetails(string ecardidbuildstationid){
        EcardOperationlog wrapobj = new EcardOperationlog();
        try{
            AuthorisationData.Token tokendata = userAuthentication.getAccesstoken();
            string endpoint = System.Label.EcardAppendpoint+'api/buspartdetails/';
            userAuthentication.ResponseWrapper response = userAuthentication.getData(endpoint+ecardidbuildstationid, 'GET', tokendata.access_token, tokendata.refresh_token);
            wrapobj.isError = response.isError;
            if(response.isError){
                wrapobj.errorMessage = response.statusCode;
                if(response.statusCode == '401'){
                    // Some error has happened
                }
                else{
                    throw new EcardOperationsException(response.statusCode); 
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
    public static EcardOperationlog updatePartshortage(string requestbody){
        EcardOperationlog log = new EcardOperationlog();
        AuthorisationData.Token tokendata = userAuthentication.getAccesstoken();
        string endpoint = System.Label.EcardAppendpoint+'api/ecardpartshortagediscrepancy';
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
            log.errorMessage = statusresponse.statusCode;
            log.responsebody = statusresponse.responseBody;
        }
         
        System.debug('operationlogresponse ->'+log.operationlogresponse);
        return log;
    }

    @AuraEnabled
    public static EcardOperationlog uploadTargetPicture(string requestbody){
        EcardOperationlog log = new EcardOperationlog();
        AuthorisationData.Token tokendata = userAuthentication.getAccesstoken();
        string endpoint = System.Label.EcardAppendpoint+'api/picturevalidationtarget';
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
         
        System.debug('operationlogresponse ->'+log.operationlogresponse);
        return log;
    }
    
    @AuraEnabled
    public static EcardOperationlog deleteTargetPicture(string requestbody){
        EcardOperationlog log = new EcardOperationlog();
        AuthorisationData.Token tokendata = userAuthentication.getAccesstoken();
        string endpoint = System.Label.EcardAppendpoint+'api/picturevalidationtarget';
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
         
        System.debug('operationlogresponse ->'+log.operationlogresponse);
        return log;
    }    
    
    @AuraEnabled
    public static EcardOperationlog uploadSourcePicture(string requestbody){
        EcardOperationlog log = new EcardOperationlog();
        AuthorisationData.Token tokendata = userAuthentication.getAccesstoken();
        string endpoint = System.Label.EcardAppendpoint+'api/picturevalidationsource';
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
         
        System.debug('operationlogresponse ->'+log.operationlogresponse);
        return log;
    }
    
    
    @AuraEnabled
    public static  EcardOperationlog getTargetImage(string ecardbuildstationId){
        EcardOperationlog wrapobj = new EcardOperationlog();
        try{
            AuthorisationData.Token tokendata = userAuthentication.getAccesstoken();
            string endpoint = System.Label.EcardAppendpoint+'api/picturevalidationtargetimage/';
            System.debug('TargetImageendpoint'+endpoint+ecardbuildstationId);
            userAuthentication.ResponseWrapper response = userAuthentication.getData(endpoint+ecardbuildstationId, 'GET', tokendata.access_token, tokendata.refresh_token);
            wrapobj.isError = response.isError;
            if(response.isError){
                wrapobj.errorMessage = response.statusCode;
                if(response.statusCode == '401'){
                    // Some error has happened
                }
                else{
                    throw new EcardOperationsException(response.statusCode); 
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
    public static  EcardOperationlog getTargetandActualImage(string operationlogid){
        EcardOperationlog wrapobj = new EcardOperationlog();
        try{
            AuthorisationData.Token tokendata = userAuthentication.getAccesstoken();
            string endpoint = System.Label.EcardAppendpoint+'api/picturevalidation/';
            System.debug('TargetImageendpoint'+endpoint+operationlogid);
            userAuthentication.ResponseWrapper response = userAuthentication.getData(endpoint+operationlogid, 'GET', tokendata.access_token, tokendata.refresh_token);
            wrapobj.isError = response.isError;
            if(response.isError){
                wrapobj.errorMessage = response.statusCode;
                if(response.statusCode == '401'){
                    // Some error has happened
                }
                else{
                    throw new EcardOperationsException(response.statusCode); 
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
    public static  EcardOperationlog getbuildstationPartSeriallogs(string ecardserialtype){
        EcardOperationlog wrapobj = new EcardOperationlog();
        try{
            AuthorisationData.Token tokendata = userAuthentication.getAccesstoken();
            string endpoint = System.Label.EcardAppendpoint+'api/buildstationpartmapping/';
            System.debug('ecardserialtype'+endpoint+ecardserialtype);
            userAuthentication.ResponseWrapper response = userAuthentication.getData(endpoint+ecardserialtype, 'GET', tokendata.access_token, tokendata.refresh_token);
            wrapobj.isError = response.isError;
            if(response.isError){
                wrapobj.errorMessage = response.statusCode;
                wrapobj.responsebody = response.responseBody;
                if(response.statusCode == '401'){
                    // Some error has happened
                }
                else{
                    throw new EcardOperationsException(response.statusCode); 
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
    public static EcardOperationlog updateSerialNolog(string requestbody){
        EcardOperationlog log = new EcardOperationlog();
        AuthorisationData.Token tokendata = userAuthentication.getAccesstoken();
        string endpoint = System.Label.EcardAppendpoint+'api/serialnumberlog';
        userAuthentication.ResponseWrapper statusresponse = userAuthentication.postData(endpoint, 'POST', requestbody, tokendata.access_token, tokendata.refresh_token);
        if(statusresponse.isError){
            log.errorMessage = statusresponse.statusCode;
            log.isError = statusresponse.isError;
            //log.responsebody = statusresponse.statusCode + statusresponse.responseBody;
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
         
        System.debug('operationlogresponse ->'+log.operationlogresponse);
        return log;
    }
    
    @AuraEnabled
    public static EcardOperationlog uploadNewAttachment(string requestbody){
        EcardOperationlog log = new EcardOperationlog();
        AuthorisationData.Token tokendata = userAuthentication.getAccesstoken();
        string endpoint = System.Label.EcardAppendpoint+'api/serialnumberlogattachment';
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
         
        System.debug('operationlogresponse ->'+log.operationlogresponse);
        return log;
    }
    
    @AuraEnabled
    public static  EcardOperationlog getSlnoFiles(string serialnumberlogid){
        EcardOperationlog wrapobj = new EcardOperationlog();
        try{
            AuthorisationData.Token tokendata = userAuthentication.getAccesstoken();
            string endpoint = System.Label.EcardAppendpoint+'api/serialnumberlogattachment/';
            System.debug('serialnumberlogid'+endpoint+serialnumberlogid);
            userAuthentication.ResponseWrapper response = userAuthentication.getData(endpoint+serialnumberlogid, 'GET', tokendata.access_token, tokendata.refresh_token);
            wrapobj.isError = response.isError;
            if(response.isError){
                wrapobj.errorMessage = response.statusCode;
                if(response.statusCode == '401'){
                    // Some error has happened
                }
                else{
                    throw new EcardOperationsException(response.statusCode); 
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
    public static  EcardOperationlog getmeetingnotes(string ecardiddeptid){
        EcardOperationlog wrapobj = new EcardOperationlog();
        try{
            AuthorisationData.Token tokendata = userAuthentication.getAccesstoken();
            string endpoint = System.Label.EcardAppendpoint+'api/meetingnote/';
            userAuthentication.ResponseWrapper response = userAuthentication.getData(endpoint+ecardiddeptid, 'GET', tokendata.access_token, tokendata.refresh_token);
            wrapobj.isError = response.isError;
            if(response.isError){
                wrapobj.errorMessage = response.statusCode;
                if(response.statusCode == '401'){
                    // Some error has happened
                }
                else{
                    throw new EcardOperationsException(response.statusCode); 
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
    public static  EcardOperationlog getqcchecklist(string ecardiddeptid){
        EcardOperationlog wrapobj = new EcardOperationlog();
        try{
            AuthorisationData.Token tokendata = userAuthentication.getAccesstoken();
            string endpoint = System.Label.EcardAppendpoint+'api/qcchecklist/';
            System.debug('getqcchecklist'+endpoint+ecardiddeptid);
            userAuthentication.ResponseWrapper response = userAuthentication.getData(endpoint+ecardiddeptid, 'GET', tokendata.access_token, tokendata.refresh_token);
            wrapobj.isError = response.isError;
            if(response.isError){
                wrapobj.errorMessage = response.statusCode;
                if(response.statusCode == '401'){
                    // Some error has happened
                }
                else{
                    throw new EcardOperationsException(response.statusCode); 
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
    public static  EcardOperationlog gethelpdocument(string ecardiddeptid){
        EcardOperationlog wrapobj = new EcardOperationlog();
        try{
            AuthorisationData.Token tokendata = userAuthentication.getAccesstoken();
            string endpoint = System.Label.EcardAppendpoint+'api/helpdocument/';
            System.debug('gethelpdocument'+endpoint+ecardiddeptid);
            userAuthentication.ResponseWrapper response = userAuthentication.getData(endpoint+ecardiddeptid, 'GET', tokendata.access_token, tokendata.refresh_token);
            wrapobj.isError = response.isError;
            if(response.isError){
                wrapobj.errorMessage = response.statusCode;
                if(response.statusCode == '401'){
                    // Some error has happened
                }
                else{
                    throw new EcardOperationsException(response.statusCode); 
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

    // Get Attachments for Ecard
    @AuraEnabled
    public static  EcardOperationlog getecardattachments(string ecardid){
        EcardOperationlog wrapobj = new EcardOperationlog();
        try{
            AuthorisationData.Token tokendata = userAuthentication.getAccesstoken();
            string endpoint = System.Label.EcardAppendpoint+'api/ecardattachment/';
            //System.debug('gethelpdocument'+endpoint+ecardiddeptid);
            userAuthentication.ResponseWrapper response = userAuthentication.getData(endpoint+ecardid, 'GET', tokendata.access_token, tokendata.refresh_token);
            wrapobj.isError = response.isError;
            if(response.isError){
                wrapobj.errorMessage = response.statusCode;
                if(response.statusCode == '401'){
                    // Some error has happened
                }
                else{
                    throw new EcardOperationsException(response.statusCode); 
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

    // Upload the attachment to ecard
    @AuraEnabled
    public static EcardOperationlog uploadNewAttachmenttoEcard(string requestbody){
        EcardOperationlog log = new EcardOperationlog();
        AuthorisationData.Token tokendata = userAuthentication.getAccesstoken();
        string endpoint = System.Label.EcardAppendpoint+'api/ecardattachment';
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
        return log;
    }

    // Upload the operationcheck records
    @AuraEnabled
    public static EcardOperationlog updateopchecks(string requestbody){
        EcardOperationlog log = new EcardOperationlog();
        AuthorisationData.Token tokendata = userAuthentication.getAccesstoken();
        string endpoint = System.Label.EcardAppendpoint+'api/operationcheck';
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
        return log;
    }

     // Get Attachments for Operation Log/ Buildstation
     @AuraEnabled
     public static  EcardOperationlog getecardoperationlogattachments(string operationlogid){
         EcardOperationlog wrapobj = new EcardOperationlog();
         try{
             AuthorisationData.Token tokendata = userAuthentication.getAccesstoken();
             string endpoint = System.Label.EcardAppendpoint+'api/ecardoperationlogattachment/';
             //System.debug('gethelpdocument'+endpoint+ecardiddeptid);
             userAuthentication.ResponseWrapper response = userAuthentication.getData(endpoint+operationlogid, 'GET', tokendata.access_token, tokendata.refresh_token);
             wrapobj.isError = response.isError;
             if(response.isError){
                 wrapobj.errorMessage = response.statusCode;
                 if(response.statusCode == '401'){
                     // Some error has happened
                 }
                 else{
                     throw new EcardOperationsException(response.statusCode); 
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

    // Upload the attachment to a BuildStation
    @AuraEnabled
    public static EcardOperationlog uploadAttachmenttoEcardOperationlog(string requestbody){
        EcardOperationlog log = new EcardOperationlog();
        AuthorisationData.Token tokendata = userAuthentication.getAccesstoken();
        string endpoint = System.Label.EcardAppendpoint+'api/ecardoperationlogattachment';
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
        return log;
    }


     // Get Attachments for Discrepancy Log
     @AuraEnabled
     public static  EcardOperationlog getdiscrepancylogattachments(string discrepancylogid){
         EcardOperationlog wrapobj = new EcardOperationlog();
         try{
             AuthorisationData.Token tokendata = userAuthentication.getAccesstoken();
             string endpoint = System.Label.EcardAppendpoint+'api/discrepancylogattachment/';
             //System.debug('gethelpdocument'+endpoint+ecardiddeptid);
             userAuthentication.ResponseWrapper response = userAuthentication.getData(endpoint+discrepancylogid, 'GET', tokendata.access_token, tokendata.refresh_token);
             wrapobj.isError = response.isError;
             if(response.isError){
                 wrapobj.errorMessage = response.statusCode;
                 if(response.statusCode == '401'){
                     // Some error has happened
                 }
                 else{
                     throw new EcardOperationsException(response.statusCode); 
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

    // Upload the attachment to a Discrepancy
    @AuraEnabled
    public static EcardOperationlog uploadAttachmenttoDiscrepancylog(string requestbody){
        EcardOperationlog log = new EcardOperationlog();
        AuthorisationData.Token tokendata = userAuthentication.getAccesstoken();
        string endpoint = System.Label.EcardAppendpoint+'api/discrepancylogattachment';
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
        return log;
    }

    // Upload the attachment to s3 Temporary
    @AuraEnabled
    public static EcardOperationlog uploadTempAttachment(string requestbody){
        EcardOperationlog log = new EcardOperationlog();
        AuthorisationData.Token tokendata = userAuthentication.getAccesstoken();
        string endpoint = System.Label.EcardAppendpoint+'api/uploadtempdiscrepancylogattachment';
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
        return log;
    }

    // Delete the temporary attachment from s3 Temporary
    @AuraEnabled
    public static EcardOperationlog deleteTempAttachment(string requestbody){
        EcardOperationlog log = new EcardOperationlog();
        AuthorisationData.Token tokendata = userAuthentication.getAccesstoken();
        string endpoint = System.Label.EcardAppendpoint+'api/deletetempdiscrepancylogattachment';
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
        return log;
    }

     // Get Build Station Part Details
     @AuraEnabled
     public static  EcardOperationlog getbuildstationPartDetails(string ecardbuildstationId){
         EcardOperationlog wrapobj = new EcardOperationlog();
         try{
             AuthorisationData.Token tokendata = userAuthentication.getAccesstoken();
             string endpoint = System.Label.EcardAppendpoint+'api/buildstationpartdetails/';
             //System.debug('gethelpdocument'+endpoint+ecardiddeptid);
             userAuthentication.ResponseWrapper response = userAuthentication.getData(endpoint+ecardbuildstationId, 'GET', tokendata.access_token, tokendata.refresh_token);
             wrapobj.isError = response.isError;
             if(response.isError){
                 wrapobj.errorMessage = response.statusCode;
                 if(response.statusCode == '401'){
                     // Some error has happened
                 }
                 else{
                     throw new EcardOperationsException(response.statusCode); 
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

     // Get BM35 Details
     @AuraEnabled
     public static  EcardOperationlog getbuildstationbm35Details(string ecardbuildstationId){
         EcardOperationlog wrapobj = new EcardOperationlog();
         try{
             AuthorisationData.Token tokendata = userAuthentication.getAccesstoken();
             string endpoint = System.Label.EcardAppendpoint+'api/buildstationmappingbm35details/';
             userAuthentication.ResponseWrapper response = userAuthentication.getData(endpoint+ecardbuildstationId, 'GET', tokendata.access_token, tokendata.refresh_token);
             wrapobj.isError = response.isError;
             if(response.isError){
                 wrapobj.errorMessage = response.statusCode;
                 throw new EcardOperationsException(response.statusCode); 
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

     // Get PCO Details
     @AuraEnabled
     public static  EcardOperationlog getbuildstationpcoDetails(string ecardbuildstationId){
         EcardOperationlog wrapobj = new EcardOperationlog();
         try{
             AuthorisationData.Token tokendata = userAuthentication.getAccesstoken();
             string endpoint = System.Label.EcardAppendpoint+'api/buildstationmappingpcodetails/';
             userAuthentication.ResponseWrapper response = userAuthentication.getData(endpoint+ecardbuildstationId, 'GET', tokendata.access_token, tokendata.refresh_token);
             wrapobj.isError = response.isError;
             if(response.isError){
                 wrapobj.errorMessage = response.statusCode;
                 throw new EcardOperationsException(response.statusCode); 
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

    // Get OP-Check Details against buildstation
    @AuraEnabled
    public static  EcardOperationlog getbuildstationopcheckDetails(string ecardbuildstationId){
        EcardOperationlog wrapobj = new EcardOperationlog();
        try{
            AuthorisationData.Token tokendata = userAuthentication.getAccesstoken();
            string endpoint = System.Label.EcardAppendpoint+'api/operationcheck/';
            userAuthentication.ResponseWrapper response = userAuthentication.getData(endpoint+ecardbuildstationId, 'GET', tokendata.access_token, tokendata.refresh_token);
            wrapobj.isError = response.isError;
            if(response.isError){
                wrapobj.errorMessage = response.statusCode;
                throw new EcardOperationsException(response.statusCode); 
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

    // Get OP-Check Details against each department
    @AuraEnabled
    public static  EcardOperationlog getdepartmentopcheckDetails(string ecarddepartmentid){
        EcardOperationlog wrapobj = new EcardOperationlog();
        try{
            AuthorisationData.Token tokendata = userAuthentication.getAccesstoken();
            string endpoint = System.Label.EcardAppendpoint+'api/operationcheck_by_ecardid_department_id/';
            userAuthentication.ResponseWrapper response = userAuthentication.getData(endpoint+ecarddepartmentid, 'GET', tokendata.access_token, tokendata.refresh_token);
            wrapobj.isError = response.isError;
            if(response.isError){
                wrapobj.errorMessage = response.statusCode;
                throw new EcardOperationsException(response.statusCode); 
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

     // Get Overview Details
     @AuraEnabled
     public static  EcardOperationlog getoverviewDetails(string ecardid){
         EcardOperationlog wrapobj = new EcardOperationlog();
         try{
             AuthorisationData.Token tokendata = userAuthentication.getAccesstoken();
             string endpoint = System.Label.EcardAppendpoint+'api/ecardactivitydetails/';
             //System.debug('gethelpdocument'+endpoint+ecardiddeptid);
             userAuthentication.ResponseWrapper response = userAuthentication.getData(endpoint+ecardid, 'GET', tokendata.access_token, tokendata.refresh_token);
             wrapobj.isError = response.isError;
             if(response.isError){
                 wrapobj.errorMessage = response.statusCode;
                 if(response.statusCode == '401'){
                     // Some error has happened
                 }
                 else{
                     throw new EcardOperationsException(response.statusCode); 
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

      // Get Ecard Details Details
      @AuraEnabled
      public static  EcardOperationlog getecardDetails(string ecardid){
          EcardOperationlog wrapobj = new EcardOperationlog();
          try{
              AuthorisationData.Token tokendata = userAuthentication.getAccesstoken();
              string endpoint = System.Label.EcardAppendpoint+'api/ecardbyid/';
              //System.debug('gethelpdocument'+endpoint+ecardiddeptid);
              userAuthentication.ResponseWrapper response = userAuthentication.getData(endpoint+ecardid, 'GET', tokendata.access_token, tokendata.refresh_token);
              wrapobj.isError = response.isError;
              if(response.isError){
                  wrapobj.errorMessage = response.statusCode;
                  if(response.statusCode == '401'){
                      // Some error has happened
                  }
                  else{
                      throw new EcardOperationsException(response.statusCode); 
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

     // Update Ecard details
     @AuraEnabled
    public static EcardOperationlog updateecardDetails(string requestbody){
        EcardOperationlog log = new EcardOperationlog();
        AuthorisationData.Token tokendata = userAuthentication.getAccesstoken();
        string endpoint = System.Label.EcardAppendpoint+'api/updateecard';
        userAuthentication.ResponseWrapper statusresponse = userAuthentication.postData(endpoint, 'PUT', requestbody, tokendata.access_token, tokendata.refresh_token);
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
        return log;
    }

    // Delete Ecard Operation log attachments
    @AuraEnabled
    public static  EcardOperationlog deleteEcardOperationattachment(string requestbody){
        EcardOperationlog wrapobj = new EcardOperationlog();
        try{
            AuthorisationData.Token tokendata = userAuthentication.getAccesstoken();
            string endpoint = System.Label.EcardAppendpoint+'api/ecardoperationlogattachment';
            userAuthentication.ResponseWrapper response = userAuthentication.postData(endpoint, 'DELETE', requestbody, tokendata.access_token, tokendata.refresh_token);
            wrapobj.isError = response.isError;
            if(response.isError){
                wrapobj.errorMessage = response.statusCode;
                wrapobj.responsebody = response.responseBody;
                if(response.statusCode == '401'){
                    // Some error has happened
                }
                else{
                    throw new EcardOperationsException(response.statusCode); 
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

    // Delete Ecard attachments
    @AuraEnabled
    public static  EcardOperationlog deleteEcardattachment(string requestbody){
        EcardOperationlog wrapobj = new EcardOperationlog();
        try{
            AuthorisationData.Token tokendata = userAuthentication.getAccesstoken();
            string endpoint = System.Label.EcardAppendpoint+'api/ecardattachment';
            userAuthentication.ResponseWrapper response = userAuthentication.postData(endpoint, 'DELETE', requestbody, tokendata.access_token, tokendata.refresh_token);
            wrapobj.isError = response.isError;
            if(response.isError){
                wrapobj.errorMessage = response.statusCode;
                wrapobj.responsebody = response.responseBody;
                if(response.statusCode == '401'){
                    // Some error has happened
                }
                else{
                    throw new EcardOperationsException(response.statusCode); 
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

    // Delete Serial Number log attachments
    @AuraEnabled
    public static  EcardOperationlog deleteSerialnoattachment(string requestbody){
        EcardOperationlog wrapobj = new EcardOperationlog();
        try{
            AuthorisationData.Token tokendata = userAuthentication.getAccesstoken();
            string endpoint = System.Label.EcardAppendpoint+'api/serialnumberlogattachment';
            userAuthentication.ResponseWrapper response = userAuthentication.postData(endpoint, 'DELETE', requestbody, tokendata.access_token, tokendata.refresh_token);
            wrapobj.isError = response.isError;
            if(response.isError){
                wrapobj.errorMessage = response.statusCode;
                wrapobj.responsebody = response.responseBody;
                if(response.statusCode == '401'){
                    // Some error has happened
                }
                else{
                    throw new EcardOperationsException(response.statusCode); 
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

    // Delete Discrepancy log attachments
    @AuraEnabled
    public static  EcardOperationlog deleteDiscrepancyattachment(string requestbody){
        EcardOperationlog wrapobj = new EcardOperationlog();
        try{
            AuthorisationData.Token tokendata = userAuthentication.getAccesstoken();
            string endpoint = System.Label.EcardAppendpoint+'api/discrepancylogattachment';
            userAuthentication.ResponseWrapper response = userAuthentication.postData(endpoint, 'DELETE', requestbody, tokendata.access_token, tokendata.refresh_token);
            wrapobj.isError = response.isError;
            if(response.isError){
                wrapobj.errorMessage = response.statusCode;
                wrapobj.responsebody = response.responseBody;
                if(response.statusCode == '401'){
                    // Some error has happened
                }
                else{
                    throw new EcardOperationsException(response.statusCode); 
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
        // Function to get PresignedUrl list for s3
        @AuraEnabled
        public static  EcardOperationlog getpresigneds3Url(string requestbody){
            EcardOperationlog wrapobj = new EcardOperationlog();
            try{
                AuthorisationData.Token tokendata = userAuthentication.getAccesstoken();
                string endpoint = System.Label.EcardAppendpoint+'api/bucketfileurl';
                userAuthentication.ResponseWrapper response = userAuthentication.postData(endpoint, 'POST', requestbody, tokendata.access_token, tokendata.refresh_token);
                wrapobj.isError = response.isError;
                if(response.isError){
                    wrapobj.errorMessage = response.statusCode;
                    wrapobj.responsebody = response.responseBody;
                    throw new EcardOperationsException(response.statusCode); 
                }
                else{
                   wrapobj.responsebody = response.responseBody;
                   wrapobj.errorMessage = response.statusCode;
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

        // Function to get Repository PresignedUrl list for s3.
        @AuraEnabled
        public static  EcardOperationlog getrepopresigneds3Url(string requestbody){
            EcardOperationlog wrapobj = new EcardOperationlog();
            try{
                AuthorisationData.Token tokendata = userAuthentication.getAccesstoken();
                string endpoint = System.Label.EcardAppendpoint+'api/repositorybucketfileurl';
                userAuthentication.ResponseWrapper response = userAuthentication.postData(endpoint, 'POST', requestbody, tokendata.access_token, tokendata.refresh_token);
                wrapobj.isError = response.isError;
                if(response.isError){
                    wrapobj.errorMessage = response.statusCode;
                    wrapobj.responsebody = response.responseBody;
                    throw new EcardOperationsException(response.statusCode); 
                }
                else{
                   wrapobj.responsebody = response.responseBody;
                   wrapobj.errorMessage = response.statusCode;
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

    
        // Function to upload VIN Label atttachment to server.
        @AuraEnabled
        public static  EcardOperationlog uploadVINlabel(string requestbody){
            EcardOperationlog wrapobj = new EcardOperationlog();
            try{
                AuthorisationData.Token tokendata = userAuthentication.getAccesstoken();
                string endpoint = System.Label.EcardAppendpoint+'api/ecardvinattachment';
                userAuthentication.ResponseWrapper response = userAuthentication.postData(endpoint, 'POST', requestbody, tokendata.access_token, tokendata.refresh_token);
                wrapobj.isError = response.isError;
                if(response.isError){
                    wrapobj.errorMessage = response.statusCode;
                    wrapobj.responsebody = response.responseBody;
                    throw new EcardOperationsException(response.statusCode); 
                }
                else{
                   wrapobj.responsebody = response.responseBody;
                   wrapobj.errorMessage = response.statusCode;
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
    
        // Function to upload Emission Label atttachment to server.
        @AuraEnabled
        public static  EcardOperationlog uploadEmissionlabel(string requestbody){
            EcardOperationlog wrapobj = new EcardOperationlog();
            try{
                AuthorisationData.Token tokendata = userAuthentication.getAccesstoken();
                string endpoint = System.Label.EcardAppendpoint+'api/ecardchassisattachment';
                userAuthentication.ResponseWrapper response = userAuthentication.postData(endpoint, 'POST', requestbody, tokendata.access_token, tokendata.refresh_token);
                wrapobj.isError = response.isError;
                if(response.isError){
                    wrapobj.errorMessage = response.statusCode;
                    wrapobj.responsebody = response.responseBody;
                    throw new EcardOperationsException(response.statusCode); 
                }
                else{
                   wrapobj.responsebody = response.responseBody;
                   wrapobj.errorMessage = response.statusCode;
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
    
        // Function to delete Emission Label atttachment from server.
        @AuraEnabled
        public static  EcardOperationlog deleteEmissionlabel(string requestbody){
            EcardOperationlog wrapobj = new EcardOperationlog();
            try{
                AuthorisationData.Token tokendata = userAuthentication.getAccesstoken();
                string endpoint = System.Label.EcardAppendpoint+'api/ecardchassisattachment';
                userAuthentication.ResponseWrapper response = userAuthentication.postData(endpoint, 'DELETE', requestbody, tokendata.access_token, tokendata.refresh_token);
                wrapobj.isError = response.isError;
                if(response.isError){
                    wrapobj.errorMessage = response.statusCode;
                    wrapobj.responsebody = response.responseBody;
                    throw new EcardOperationsException(response.statusCode); 
                }
                else{
                   wrapobj.responsebody = response.responseBody;
                   wrapobj.errorMessage = response.statusCode;
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
        // Function to delete Emission Label atttachment from server.
        @AuraEnabled
        public static  EcardOperationlog deleteVinlabel(string requestbody){
            EcardOperationlog wrapobj = new EcardOperationlog();
            try{
                AuthorisationData.Token tokendata = userAuthentication.getAccesstoken();
                string endpoint = System.Label.EcardAppendpoint+'api/ecardvinattachment';
                userAuthentication.ResponseWrapper response = userAuthentication.postData(endpoint, 'DELETE', requestbody, tokendata.access_token, tokendata.refresh_token);
                wrapobj.isError = response.isError;
                if(response.isError){
                    wrapobj.errorMessage = response.statusCode;
                    wrapobj.responsebody = response.responseBody;
                    throw new EcardOperationsException(response.statusCode); 
                }
                else{
                   wrapobj.responsebody = response.responseBody;
                   wrapobj.errorMessage = response.statusCode;
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

        //Method to fetch the Shortage Causes list
        @AuraEnabled
        public static EcardOperationlog getPartshortageCauses(){
            EcardOperationlog wrapobj = new EcardOperationlog();
            try {
                // AuthorisationData.Token tokendata = userAuthentication.getCachedAccesstoken();
                AuthorisationData.Token tokendata = userAuthentication.getAccesstoken();
                string endpoint = System.Label.EcardAppendpoint+'api/shortagecauses';
                userAuthentication.ResponseWrapper response = userAuthentication.getData(endpoint, 'GET', tokendata.access_token, tokendata.refresh_token);
                wrapobj.isError = response.isError;
                if(response.isError){
                    wrapobj.errorMessage = response.statusCode;
                    wrapobj.responsebody = response.responseBody;
                    throw new EcardOperationsException(response.statusCode); 
                }
                else{
                   wrapobj.responsebody = response.responseBody;
                   wrapobj.errorMessage = response.statusCode;
                }
                return wrapobj;
                
            } catch (Exception e) {
                throw new AuraHandledException(e.getMessage());
            }
        }

        //Method to fetch All Vendor List of a Bus_Part_No
        @AuraEnabled
        public static EcardOperationlog getAllpartsVendorlist(String partNumber){
            EcardOperationlog wrapobj = new EcardOperationlog();
            try {
                // AuthorisationData.Token tokendata = userAuthentication.getCachedAccesstoken();
                AuthorisationData.Token tokendata = userAuthentication.getAccesstoken();
                string endpoint = System.Label.EcardAppendpoint+'api/vendorsbypartno/';
                userAuthentication.ResponseWrapper response = userAuthentication.getData(endpoint+partNumber, 'GET', tokendata.access_token, tokendata.refresh_token);
                wrapobj.isError = response.isError;
                if(response.isError){
                    wrapobj.errorMessage = response.statusCode;
                    wrapobj.responsebody = response.responseBody;
                    throw new EcardOperationsException(response.statusCode); 
                }
                else{
                   wrapobj.responsebody = response.responseBody;
                   wrapobj.errorMessage = response.statusCode;
                }
                return wrapobj;
                
            } catch (Exception e) {
                throw new AuraHandledException(e.getMessage());
            }
        }

        //Method to get the default Vendor and Buyer of a Bus_Part_No
        @AuraEnabled
        public static EcardOperationlog getDefaultVendorandBuyer(String partNumber){
            EcardOperationlog wrapobj = new EcardOperationlog();
            try {
                // AuthorisationData.Token tokendata = userAuthentication.getCachedAccesstoken();
                AuthorisationData.Token tokendata = userAuthentication.getAccesstoken();
                string endpoint = System.Label.EcardAppendpoint+'api/buyerAndVendorDetails/';
                userAuthentication.ResponseWrapper response = userAuthentication.getData(endpoint+partNumber, 'GET', tokendata.access_token, tokendata.refresh_token);
                wrapobj.isError = response.isError;
                if(response.isError){
                    wrapobj.errorMessage = response.statusCode;
                    wrapobj.responsebody = response.responseBody;
                    throw new EcardOperationsException(response.statusCode); 
                }
                else{
                   wrapobj.responsebody = response.responseBody;
                   wrapobj.errorMessage = response.statusCode;
                }
                return wrapobj;
                
            } catch (Exception e) {
                throw new AuraHandledException(e.getMessage());
            }
        }

    @AuraEnabled
    public static EcardOperationlog getAllPartshortages(string ecardbusstatus){
        EcardOperationlog log = new EcardOperationlog();
        AuthorisationData.Token tokendata = userAuthentication.getAccesstoken();//Vishwas
        // AuthorisationData.Token tokendata = userAuthentication.getCachedAccesstoken();//Vishwas
        string endpoint = System.Label.EcardAppendpoint+'api/ecardshortagedb/';
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
    
    public class buildstationUserWrap{
        @AuraEnabled
        public Integer buildstationid;
        @AuraEnabled
        public List<BuildStationMappingWrapper.Prod> Prod;
        @AuraEnabled
        public List<BuildStationMappingWrapper.Qc> Qc;
    }
    
    public class Users{
        @AuraEnabled
        public String user_name;
        @AuraEnabled
        public Integer user_id;
        @AuraEnabled
        public String name;
        @auraEnabled
        public boolean active;
    }
    
    public class EcardOperationsWrapper{
        @auraEnabled
        public boolean isError{get;set;}
        @auraEnabled
        public Object builstationMapWrapper{get;set;}
        @auraEnabled
        public Object discrepancyWrapper{get;set;}
        @auraEnabled
        public List<Options> buildstationList{get;set;}
        @auraEnabled
        public List<buildstationUserWrap> userforbsList{get;set;}
    }
    
    public class Options{
        @auraEnabled
        public string label{get;set;}
        @auraEnabled
        public string value{get;set;}
        @auraEnabled
        public Integer workcentreId{get;set;}
        @auraEnabled
        public string workcentreName{get;set;}
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
    
    public class EcardOperationsException extends Exception {
        
    }
    
}