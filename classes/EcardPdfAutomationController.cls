public class EcardPdfAutomationController {

    @AuraEnabled(cacheable=true)
    public static AuthorisationData EcardLogin(){
        try{
            System.debug('Inside "EcardLogin" method : retriving the Ecard login details from backend...');
            string endpoint = System.Label.EcardAppendpoint+'api/sflogin';
            String genericEmpId = System.Label.EcardGenericUserId; //This Generic User Id is used for the PDF Automation
            System.debug('Generic Employee Id for the PDF automation : '+genericEmpId);
            Ecard_Configs__mdt configs = [SELECT Id, DeveloperName, MasterLabel, QualifiedApiName, Label, Ecard_App_Key__c, Ecard_App_Secret__c FROM Ecard_Configs__mdt LIMIT 1];
            if(genericEmpId != null){
                LoginRequestWrapper loginrequest = new LoginRequestWrapper();
                loginrequest.app_key = configs.Ecard_App_Key__c;
                loginrequest.app_secret = configs.Ecard_App_Secret__c;
                loginrequest.emp_no = genericEmpId;
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
                System.debug('response.getStatusCode() : '+response.getStatusCode());
                if (response.getStatusCode() == 200) {
                    // DateTime dt = System.Now();
                    // dt.addMinutes(25);
                    AuthorisationData authdata = (AuthorisationData) System.JSON.deserialize(response.getBody(), AuthorisationData.class);
                    System.debug(authdata.data.token);//Add this token to cache _vishwas
                    System.debug('Access token :'+authdata.data.token.access_token);//Add this token to cache _vishwas
                    // Cache.Session.put('local.Ecard.token', authdata.data.token);
                    // Cache.Session.put('local.Ecard.userid', authdata.data.user.appuser_id);//set user_id value to session //Vishwas
                    System.debug(' appuser_id: '+authdata.data.user.appuser_id);//Vishwas
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

    public class LoginRequestWrapper{
        @AuraEnabled
        public string app_key{get;set;}
        @AuraEnabled
        public string app_secret{get;set;}
        @AuraEnabled
        public string emp_no{get;set;}
    }
}