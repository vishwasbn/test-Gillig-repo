public with sharing class AtpChecklistsController {
    @AuraEnabled
    public static ResponseWrapperData getAttachmentChecklist(String ecardid) {
        ResponseWrapperData attachmentwrap = new ResponseWrapperData();
        try{
            AuthorisationData authdata = userAuthentication.EcardLogin();
            string endpoint = System.Label.EcardAppendpoint+'api/attachmentchecklist/'+ecardid; 
            userAuthentication.ResponseWrapper response = userAuthentication.getData(endpoint, 'GET', authdata.data.token.access_token, authdata.data.token.refresh_token);
            attachmentwrap.isError = response.isError;
            attachmentwrap.statusCode = response.statusCode;
            if(response.isError){
                attachmentwrap.errorMessage = 'ERROR';
                attachmentwrap.responsebody = response.responseBody;
            }
            else{
                attachmentwrap.errorMessage = 'SUCCESS';
                attachmentwrap.responsebody = response.responseBody;
            }
            return attachmentwrap;
        }
        catch(Exception ex){
            attachmentwrap.isError = true;
            attachmentwrap.responsebody = null;
            attachmentwrap.errorMessage = ex.getMessage();
            return attachmentwrap;
        }
    }

    @AuraEnabled
    public static ResponseWrapperData getFinalAcceptance(String ecardid) {
        ResponseWrapperData fawrap = new ResponseWrapperData();
        try{
            AuthorisationData authdata = userAuthentication.EcardLogin();
            string endpoint = System.Label.EcardAppendpoint+'api/finalacceptancelog/'+ecardid; 
            userAuthentication.ResponseWrapper response = userAuthentication.getData(endpoint, 'GET', authdata.data.token.access_token, authdata.data.token.refresh_token);
            fawrap.isError = response.isError;
            fawrap.statusCode = response.statusCode;
            if(response.isError){
                fawrap.errorMessage = 'ERROR';
                fawrap.responsebody = response.responseBody;
            }
            else{
                fawrap.errorMessage = 'SUCCESS';
                fawrap.responsebody = response.responseBody;
            }
            return fawrap;
        }
        catch(Exception ex){
            fawrap.isError = true;
            fawrap.responsebody = null;
            fawrap.errorMessage = ex.getMessage();
            return fawrap;
        }
    }

    @AuraEnabled
    public static ResponseWrapperData getAntiLockBraketestList(String ecardid) {
        ResponseWrapperData antilockwrap = new ResponseWrapperData();
        try{
            AuthorisationData authdata = userAuthentication.EcardLogin();
            string endpoint = System.Label.EcardAppendpoint+'api/antilockbraketest/'+ecardid; 
            userAuthentication.ResponseWrapper response = userAuthentication.getData(endpoint, 'GET', authdata.data.token.access_token, authdata.data.token.refresh_token);
            antilockwrap.isError = response.isError;
            antilockwrap.statusCode = response.statusCode;
            if(response.isError){
                antilockwrap.errorMessage = 'ERROR';
                antilockwrap.responsebody = response.responseBody;
            }
            else{
                antilockwrap.errorMessage = 'SUCCESS';
                antilockwrap.responsebody = response.responseBody;
            }
            return antilockwrap;
        }
        catch(Exception ex){
            antilockwrap.isError = true;
            antilockwrap.responsebody = null;
            antilockwrap.errorMessage = ex.getMessage();
            return antilockwrap;
        }
    }

    @AuraEnabled
    public static ResponseWrapperData getAcceptanceTestList(String ecardid) {
        ResponseWrapperData atwrap = new ResponseWrapperData();
        try{
            AuthorisationData authdata = userAuthentication.EcardLogin();
            string endpoint = System.Label.EcardAppendpoint+'api/acceptancetest/'+ecardid; 
            userAuthentication.ResponseWrapper response = userAuthentication.getData(endpoint, 'GET', authdata.data.token.access_token, authdata.data.token.refresh_token);
            atwrap.isError = response.isError;
            atwrap.statusCode = response.statusCode;
            if(response.isError){
                atwrap.errorMessage = 'ERROR';
                atwrap.responsebody = response.responseBody;
            }
            else{
                atwrap.errorMessage = 'SUCCESS';
                atwrap.responsebody = response.responseBody;
            }
            return atwrap;
        }
        catch(Exception ex){
            atwrap.isError = true;
            atwrap.responsebody = null;
            atwrap.errorMessage = ex.getMessage();
            return atwrap;
        }
    }

    @AuraEnabled
    public static  ResponseWrapperData updateAttachmentChecklist(string requestbody){
         ResponseWrapperData wrapobj = new ResponseWrapperData();
         try{
             AuthorisationData authdata = userAuthentication.EcardLogin();
             string endpoint = System.Label.EcardAppendpoint+'api/attachmentchecklist';
             userAuthentication.ResponseWrapper response = userAuthentication.postData(endpoint, 'POST', requestbody, authdata.data.token.access_token, authdata.data.token.refresh_token);
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
    public static  ResponseWrapperData updateFinalAcceptance(string requestbody){
         ResponseWrapperData wrapobj = new ResponseWrapperData();
         try{
             AuthorisationData authdata = userAuthentication.EcardLogin();
             string endpoint = System.Label.EcardAppendpoint+'api/finalacceptancelog';
             userAuthentication.ResponseWrapper response = userAuthentication.postData(endpoint, 'POST', requestbody, authdata.data.token.access_token, authdata.data.token.refresh_token);
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
    public static  ResponseWrapperData updateAntiLockBraketest(string requestbody){
         ResponseWrapperData wrapobj = new ResponseWrapperData();
         try{
             AuthorisationData authdata = userAuthentication.EcardLogin();
             string endpoint = System.Label.EcardAppendpoint+'api/antilockbraketest';
             userAuthentication.ResponseWrapper response = userAuthentication.postData(endpoint, 'POST', requestbody, authdata.data.token.access_token, authdata.data.token.refresh_token);
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
     public static  ResponseWrapperData updateAcceptanceTest(string requestbody){
          ResponseWrapperData wrapobj = new ResponseWrapperData();
          try{
              AuthorisationData authdata = userAuthentication.EcardLogin();
              string endpoint = System.Label.EcardAppendpoint+'api/acceptancetest';
              userAuthentication.ResponseWrapper response = userAuthentication.postData(endpoint, 'POST', requestbody, authdata.data.token.access_token, authdata.data.token.refresh_token);
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
    }
}