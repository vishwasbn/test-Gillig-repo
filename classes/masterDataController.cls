public class masterDataController {
    
     @AuraEnabled(cacheable=true)
    public static DataWrapper getBusStatusdata(string authdata){
        DataWrapper busstatuswrap = new DataWrapper();
        AuthorisationData.Token tokendata = (AuthorisationData.Token) System.JSON.deserialize(authdata, AuthorisationData.Token.class);

        //string endpoint = 'https://demoapp-dev1.herokuapp.com/api/';
         string endpoint = System.Label.EcardAppendpoint+'api/';
        userAuthentication.ResponseWrapper busstatusresponse = userAuthentication.getData(endpoint+'busstatus', 'GET', tokendata.access_token, tokendata.refresh_token);
        if(busstatusresponse.isError){
            busstatuswrap.isError = busstatusresponse.isError;
            if(busstatusresponse.statusCode == '401'){
                // Some error has happened
            }
            else{
                 // Serious authentication error
            }
        }
        else{
           	busstatuswrap.isError = busstatusresponse.isError;
            busstatuswrap.latestaccesstoken = busstatusresponse.latestAccesstoken;
            DataWrapperEcard busstatusdata = (DataWrapperEcard) System.JSON.deserialize(busstatusresponse.responseBody , DataWrapperEcard.class);
            busstatuswrap.objectdata = busstatusdata.data.busstatus;
            System.debug('busstatuswrap.objectdata'+busstatuswrap.objectdata);
        }
        return busstatuswrap;
    }
    
    @AuraEnabled(cacheable=true)
    public static DataWrapper getBusTypedata(string authdata){
        DataWrapper bustypewrap = new DataWrapper();
        AuthorisationData.Token tokendata = (AuthorisationData.Token) System.JSON.deserialize(authdata, AuthorisationData.Token.class);

         string endpoint = System.Label.EcardAppendpoint+'api/';
        userAuthentication.ResponseWrapper bustyperesponse = userAuthentication.getData(endpoint+'bustype', 'GET', tokendata.access_token, tokendata.refresh_token);
        if(bustyperesponse.isError){
            bustypewrap.isError = bustyperesponse.isError;
            if(bustyperesponse.statusCode == '401'){
                // Some error has happened
            }
            else{
                 // Serious authentication error
            }
        }
        else{
            bustypewrap.isError = bustyperesponse.isError;
            bustypewrap.latestaccesstoken = bustyperesponse.latestAccesstoken;
            DataWrapperEcard bustypedata = (DataWrapperEcard) System.JSON.deserialize(bustyperesponse.responseBody , DataWrapperEcard.class);
            bustypewrap.objectdata = bustypedata.data.bustype;
            System.debug('bustypewrap.objectdata'+bustypewrap.objectdata);
        }
        return bustypewrap;
    }
    
	 @AuraEnabled(cacheable=true)
    public static DataWrapper getBusPropulsionsdata(string authdata){
        DataWrapper buspropulsionswrap = new DataWrapper();
        AuthorisationData.Token tokendata = (AuthorisationData.Token) System.JSON.deserialize(authdata, AuthorisationData.Token.class);

         string endpoint = System.Label.EcardAppendpoint+'api/';
        userAuthentication.ResponseWrapper buspropulsionsresponse = userAuthentication.getData(endpoint+'buspropulsions', 'GET', tokendata.access_token, tokendata.refresh_token);
        if(buspropulsionsresponse.isError){
            buspropulsionswrap.isError = buspropulsionsresponse.isError;
            if(buspropulsionsresponse.statusCode == '401'){
                // Some error has happened
            }
            else{
                 // Serious authentication error
            }
        }
        else{
            buspropulsionswrap.isError = buspropulsionsresponse.isError;
            buspropulsionswrap.latestaccesstoken = buspropulsionsresponse.latestAccesstoken;
            DataWrapperEcard buspropulsionsdata = (DataWrapperEcard) System.JSON.deserialize(buspropulsionsresponse.responseBody , DataWrapperEcard.class);
            buspropulsionswrap.objectdata = buspropulsionsdata.data.buspropulsion;
            System.debug('buspropulsionswrap.objectdata'+buspropulsionswrap.objectdata);
        }
        return buspropulsionswrap;
    }
	    
    @AuraEnabled(cacheable=true)
    public static DataWrapper getFactorydata(string authdata){
        DataWrapper factorywrap = new DataWrapper();
        AuthorisationData.Token tokendata = (AuthorisationData.Token) System.JSON.deserialize(authdata, AuthorisationData.Token.class);

         string endpoint = System.Label.EcardAppendpoint+'api/';
        userAuthentication.ResponseWrapper factoryresponse = userAuthentication.getData(endpoint+'factories', 'GET', tokendata.access_token, tokendata.refresh_token);
        if(factoryresponse.isError){
            factorywrap.isError = factoryresponse.isError;
            if(factoryresponse.statusCode == '401'){
                // Some error has happened
            }
            else{
                 // Serious authentication error
            }
        }
        else{
            factorywrap.isError = factoryresponse.isError;
            factorywrap.latestaccesstoken = factoryresponse.latestAccesstoken;
            DepartmentData factdata = (DepartmentData) System.JSON.deserialize(factoryresponse.responseBody , DepartmentData.class);
            factorywrap.objectdata = factdata.data;
            List<options> factoryopt = new List<options>();
            Options none = new Options();
            none.label = '--None--';
            none.value = 'None';
            factoryopt.add(none);
            for(DepartmentData.Data fact : factdata.data){
                Options factopt = new Options();
                factopt.label = fact.factory_name;
                factopt.value = string.valueOf(fact.factory_id);
                factoryopt.add(factopt);
            }
            factorywrap.factoryPickList = factoryopt;
        }
        return factorywrap;
    }
    
     @AuraEnabled(cacheable=true)
    public static DataWrapper getDepartmentdata(string authdata){
        DataWrapper departmentwrap = new DataWrapper();
        AuthorisationData.Token tokendata = userAuthentication.getAccesstoken();
       // AuthorisationData.Token tokendata = (AuthorisationData.Token) System.JSON.deserialize(authdata, AuthorisationData.Token.class);

        //string endpoint = 'https://demoapp-dev1.herokuapp.com/api/';
         string endpoint = System.Label.EcardAppendpoint+'api/';
        userAuthentication.ResponseWrapper departmentresponse = userAuthentication.getData(endpoint+'departments', 'GET', tokendata.access_token, tokendata.refresh_token);
        System.debug('departmentresponse'+departmentresponse);
        if(departmentresponse.isError){
            departmentwrap.isError = departmentresponse.isError;
            if(departmentresponse.statusCode == '401'){
                // Some error has happened
            }
            else{
                 // Serious authentication error
            }
        }
        else{
           	departmentwrap.isError = departmentresponse.isError;
            departmentwrap.latestaccesstoken = departmentresponse.latestAccesstoken;
            DataWrapperEcard deptdata = (DataWrapperEcard) System.JSON.deserialize(departmentresponse.responseBody , DataWrapperEcard.class);
            departmentwrap.objectdata = deptdata.data.departments;
            List<options> departmentopt = new List<options>();
            Options none = new Options();
            none.label = '--None--';
            none.value = 'None';
            departmentopt.add(none);
            for(DataWrapperEcard.departments dept : deptdata.data.departments){
                Options deptopt = new Options();
                deptopt.label = dept.department_name;
                deptopt.value = string.valueOf(dept.department_id);
                deptopt.bus_area_discrepancy_enabled = dept.bus_area_discrepancy_enabled;
                deptopt.defect_type = dept.defect_type;
                deptopt.is_assembly_line = dept.is_assembly_line;
                departmentopt.add(deptopt);
            }
            departmentwrap.departmentPickList = departmentopt;
        }
        //departmentwrap.factoryPickList = getFactorydata(authdata).factoryPickList;
        //System.debug('factoryPickList'+departmentwrap.factoryPickList);
        return departmentwrap;
    }
    
    @AuraEnabled(cacheable=true)
    public static DataWrapper getFleetsdata(string authdata){
        DataWrapper fleetswrap = new DataWrapper();
        AuthorisationData.Token tokendata = userAuthentication.getAccesstoken();
        //AuthorisationData.Token tokendata = (AuthorisationData.Token) System.JSON.deserialize(authdata, AuthorisationData.Token.class);

        //string endpoint = 'https://demoapp-dev1.herokuapp.com/api/';
        string endpoint = System.Label.EcardAppendpoint+'api/';
        userAuthentication.ResponseWrapper fleetsresponse = userAuthentication.getData(endpoint+'fleets', 'GET', tokendata.access_token, tokendata.refresh_token);
        if(fleetsresponse.isError){
            fleetswrap.isError = fleetsresponse.isError;
            if(fleetsresponse.statusCode == '401'){
                // Some error has happened
            }
            else{
                 // Serious authentication error
            }
        }
        else{
            fleetswrap.isError = fleetsresponse.isError;
            fleetswrap.latestaccesstoken = fleetsresponse.latestAccesstoken;
            DepartmentData fleetdata = (DepartmentData) System.JSON.deserialize(fleetsresponse.responseBody , DepartmentData.class);
            fleetswrap.objectdata = fleetdata.data;
            }
        return fleetswrap;
    }
    
     @AuraEnabled(cacheable=true)
    public static DataWrapper getBuildstationsdata(string authdata){
        DataWrapper buildstationswrap = new DataWrapper();
        AuthorisationData.Token tokendata = (AuthorisationData.Token) System.JSON.deserialize(authdata, AuthorisationData.Token.class);

        //string endpoint = 'https://demoapp-dev1.herokuapp.com/api/';
         string endpoint = System.Label.EcardAppendpoint+'api/';
        userAuthentication.ResponseWrapper buildstationsresponse = userAuthentication.getData(endpoint+'buildstations', 'GET', tokendata.access_token, tokendata.refresh_token);
        if(buildstationsresponse.isError){
            buildstationswrap.isError = buildstationsresponse.isError;
            if(buildstationsresponse.statusCode == '401'){
                // Some error has happened
            }
            else{
                 // Serious authentication error
            }
        }
        else{
            buildstationswrap.isError = buildstationsresponse.isError;
            buildstationswrap.latestaccesstoken = buildstationsresponse.latestAccesstoken;
            DepartmentData buildstationsdata = (DepartmentData) System.JSON.deserialize(buildstationsresponse.responseBody , DepartmentData.class);
            buildstationswrap.objectdata = buildstationsdata.data;
            }

        buildstationswrap.factoryPickList = getFactorydata(authdata).factoryPickList;
        System.debug('factoryPickList'+buildstationswrap.factoryPickList);
        return buildstationswrap;
    }
    
     @AuraEnabled(cacheable=true)
    public static DataWrapper getWorkcentredata(string authdata){
        DataWrapper workcentrewrap = new DataWrapper();
        AuthorisationData.Token tokendata = (AuthorisationData.Token) System.JSON.deserialize(authdata, AuthorisationData.Token.class);

        //string endpoint = 'https://demoapp-dev1.herokuapp.com/api/';
         string endpoint = System.Label.EcardAppendpoint+'api/';
        userAuthentication.ResponseWrapper workcentreresponse = userAuthentication.getData(endpoint+'workcenters', 'GET', tokendata.access_token, tokendata.refresh_token);
        if(workcentreresponse.isError){
            workcentrewrap.isError = workcentreresponse.isError;
            if(workcentreresponse.statusCode == '401'){
                // Some error has happened
            }
            else{
                 // Serious authentication error
            }
        }
        else{
            workcentrewrap.isError = workcentreresponse.isError;
            workcentrewrap.latestaccesstoken = workcentreresponse.latestAccesstoken;
            DepartmentData workcentredata = (DepartmentData) System.JSON.deserialize(workcentreresponse.responseBody , DepartmentData.class);
            workcentrewrap.objectdata = workcentredata.data;
            
        }
        workcentrewrap.factoryPickList = getFactorydata(authdata).factoryPickList;
        workcentrewrap.departmentPickList = getDepartmentdata(authdata).departmentPickList;
        return workcentrewrap;
    }
    
    /*  @AuraEnabled(cacheable=true)
    public static Picklistoptions getOptions(List<Object> objectdataList, string fieldname, string fieldvalue){
        System.debug('objectdataList'+objectdataList);
        System.debug('fieldname'+fieldname);
        System.debug('fieldvalue'+fieldvalue);
        Picklistoptions opts = new Picklistoptions();
        options noneopt = new options();
        noneopt.label='--None--';
        noneopt.value='None';
        List<options> pickoptList = new List<options>{noneopt};
        List<Object> fieldList = (List<Object>)objectdataList;
        for(Object fld : fieldList){    
            Map<String,Object> data = (Map<String,Object>)fld;
            
            //Magic!
            system.debug(data.get(fieldname));
        }
            
            
        for(Object obj : objectdataList){
           Options optobj = new Options();
           Map<String,Object> data = (Map<String,Object>)obj;
            System.debug('data.get(fieldname)'+data.get(fieldname));
           optobj.label = String.valueOf(data.get(fieldname));
           optobj.value = String.valueOf(data.get(fieldvalue));
 		   pickoptList.add(optobj);
           System.debug('optobj'+optobj);
        }
        opts.fieldname = fieldname;
        opts.pickoptions = pickoptList;   
        return opts;
    } */

    @AuraEnabled
    public static EcardOperationlog addbusimage(string requestbody){
        EcardOperationlog log = new EcardOperationlog();
        AuthorisationData.Token tokendata = userAuthentication.getAccesstoken();
        string endpoint = System.Label.EcardAppendpoint+'api/addfleetimage';
        userAuthentication.ResponseWrapper statusresponse = userAuthentication.postData(endpoint, 'PUT', requestbody, tokendata.access_token, tokendata.refresh_token);
        if(statusresponse.isError){
            log.isError = statusresponse.isError;
            log.responsebody = statusresponse.statusCode + statusresponse.responseBody;
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
    public static ResponseWrapperData getfleetimageurls() {
        ResponseWrapperData fawrap = new ResponseWrapperData();
        try{
            AuthorisationData authdata = userAuthentication.EcardLogin();
            string endpoint = System.Label.EcardAppendpoint+'api/fleets'; 
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
    public static List<Operation_Check_Master_Data__c> getOperationCheckList() {
        try{

            List<Operation_Check_Master_Data__c> opcklist = [SELECT Id, Name, Department_ID__c, Build_Station_ID__c, isActive__c, Operation_Description__c, Customer_Name__c, Value_Required_Indicator__c, Value_Description__c, Bus_Mode__c, Operation_Sequence_Number__c, Transmission__c FROM Operation_Check_Master_Data__c ORDER BY Name asc];
            return opcklist;
        }
        catch(Exception ex){
            return null;
        }
    }
    
    public class DataWrapper{
        @auraEnabled
        public List<Object> objectdata{get;set;}
        @auraEnabled
        public string latestaccesstoken{get;set;}
        @auraEnabled
        public boolean isError{get;set;}
        @auraEnabled
        public List<options> factoryPickList{get;set;}
        @auraEnabled
        public List<options> departmentPickList{get;set;}
    }
    
    public class Picklistoptions{
        @auraEnabled
        public string fieldname{get;set;}
        @auraEnabled
        public List<options> pickoptions{get;set;}
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
    
    public class options{
        @auraEnabled
        public string label{get;set;}
        @auraEnabled
        public string value{get;set;}
        @auraEnabled
        public boolean bus_area_discrepancy_enabled{get;set;}
        @auraEnabled
        public string defect_type{get;set;}
        @auraEnabled
        public boolean is_assembly_line{get;set;}
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