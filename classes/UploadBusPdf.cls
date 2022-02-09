public class UploadBusPdf {
    @InvocableMethod(label='Get Bus details' description='Get the list of Buses corresponding to the specified account IDs.' category='Bus__c')
    public static void getBuses(List<ID> ids) {
        system.debug('starting UploadBusPdf------');
        List<String> busChassino = new List<String>();
        List<Bus__c> busses = [SELECT id, Name FROM Bus__c WHERE Id in :ids];
        for (Bus__c bus : busses) {
            busChassino.add(bus.Name);
            UploadBusPdf.uploadGeneratedBusPdf(bus.Name);
        }
        system.debug('busChassino : '+busChassino);
    }
    
    @future(callout=true)
    public static void uploadGeneratedBusPdf(String busChassisNumber){        
        try{
            AuthorisationData authData = EcardPdfAutomationController.EcardLogin();
            System.debug('chassis before trim : '+busChassisNumber);
            busChassisNumber = EncodingUtil.urlEncode(busChassisNumber.trim(), 'UTF-8').replace('+', '%20');
            String endpoint = System.Label.EcardAppendpoint+'api/inspection_report/B'+busChassisNumber;
            System.debug('chassis after trim : '+busChassisNumber);
            System.debug('Inside the uploadGeneratedPdf method');
            System.debug('Bus Chassis Number : '+busChassisNumber);
            System.debug('uploadGeneratedBusPdf End point: '+endpoint);
            System.debug('Auth token : '+authData.data.token.access_token);
            Http http = new Http();
            HttpRequest request = new HttpRequest();
            request.setEndPoint(endpoint);
            System.debug('1');
            request.setMethod('GET');
            System.debug('2');
            request.setTimeout(50000);
            System.debug('3');
            String authorizationHeader = 'Bearer ' + authData.data.token.access_token;
            System.debug('Access token :' +authorizationHeader);
            request.setHeader('Authorization', authorizationHeader);
            HttpResponse response = http.send(request);
            System.debug('uploadGeneratedBusPdf status code :'+response.getStatusCode());
            //UploadBusPdf.InspectionResponseWrapper wrpObj =(UploadBusPdf.InspectionResponseWrapper)System.JSON.deserialize(response.getBody(), UploadBusPdf.InspectionResponseWrapper.class);
            if(response.getStatusCode() == 200){
                //Sucess and log the success message to a log/Plat form Event
                // AuthorisationData authdata = (AuthorisationData) System.JSON.deserialize(response.getBody(), AuthorisationData.class);
                System.debug(response.getBody());
                // UploadBusPdf.InspectionResponseWrapper wrpObj =(UploadBusPdf.InspectionResponseWrapper)System.JSON.deserialize(response.getBody(), UploadBusPdf.InspectionResponseWrapper.class);
                if(response.getBody()!=null){
                    InspectionResponseWrapper wrpObj = InspectionResponseWrapper.parse(response.getBody());
                    System.debug('Status : '+ wrpObj.data.upload_status);
                    System.debug('Bus Chassis Number : '+wrpObj.data.chassis_no);
                }
                
            }
            else if(response.getStatusCode() == 401){
                //Authorization failure call 
                // AuthorisationData authData = EcardPdfAutomationController.EcardLogin();
                // uploadGeneratedBusPdf(busChassisNumber,authData);                
                System.debug('Authorisation error :');
            }
            else{
                // System.debug(response.getBody());
                // // UploadBusPdf.InspectionResponseWrapper wrpObj =(UploadBusPdf.InspectionResponseWrapper)System.JSON.deserialize(response.getBody(), UploadBusPdf.InspectionResponseWrapper.class);
                // System.debug(response.getBody());
                // if(response.getBody()!=null || response.getBody()!=''){
                //     InspectionResponseWrapper wrpObj = InspectionResponseWrapper.parse(response.getBody());
                //     System.debug('The automatic PDF generation and Upload is Unsuccesful for Bus :'+busChassisNumber);
                //     System.debug(' Unsucessful : '+wrpObj.data.upload_status);
                // }
                System.debug('Exception occured for Chassis :'+busChassisNumber);
                
            }
        }
        catch(Exception ex){
            System.debug('Exception occured in try block');
            System.debug(ex.getMessage());            
        }
        
    }    
}