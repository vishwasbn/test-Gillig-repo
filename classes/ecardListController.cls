public class ecardListController {
    
    @AuraEnabled
    public static DataWrapperforEcardList getEcarddataWrapper(string status){
        AuthorisationData.Token tokendata = userAuthentication.getAccesstoken();
        DataWrapperforEcardList wrapper = new DataWrapperforEcardList();
        wrapper.ecarddata = getecarddataList(tokendata.access_token, tokendata.refresh_token,status);
        return wrapper;
    }

    @AuraEnabled
    public static List<Object> getecarddataList(string access_token, string refresh_token,string status){
        string response;
        // Get Data From API start
        string endpoint = System.Label.EcardAppendpoint+'api/ecards/';
        System.debug('Final End Point ::  ' + endpoint+status);
        userAuthentication.ResponseWrapper responsewrap = userAuthentication.getData(endpoint+status, 'GET', access_token, refresh_token);
        if(responsewrap.isError){
            if(responsewrap.statusCode == '401'){
                // Some error has happened
            }
            else{
                // Serious authentication error
            }
        }
        else{
            response = responsewrap.responseBody;
        }
        // Get Data From API end 
        DataWrapperEcard ecardlist = (DataWrapperEcard) System.JSON.deserialize(response, DataWrapperEcard.class);
        return ecardlist.data.ecard;
    }

    @AuraEnabled
    public static AtpChecklistsController.ResponseWrapperData getecardpdf(String ecardid) {
        AtpChecklistsController.ResponseWrapperData antilockwrap = new AtpChecklistsController.ResponseWrapperData();
        try{
            AuthorisationData authdata = userAuthentication.EcardLogin();
            string endpoint = System.Label.EcardAppendpoint+'api/generate_html/'+ecardid; 
            userAuthentication.ResponseWrapper response = userAuthentication.getData(endpoint, 'GET', authdata.data.token.access_token, authdata.data.token.refresh_token);
            antilockwrap.isError = response.isError;
            antilockwrap.statusCode = response.statusCode;
            if(response.isError){
                antilockwrap.errorMessage = 'ERROR';
                antilockwrap.responsebody = response.responseBody;
                throw new EcardOperationsException(response.statusCode);
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
    
    public class DataWrapperforEcardList{
        @auraEnabled
        public List<Object> ecarddata{get;set;}
        @auraEnabled
        public boolean isError{get;set;}
    }
    public class EcardOperationsException extends Exception {   
    }
    
}