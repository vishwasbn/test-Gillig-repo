public class scheduleBoardController {


    @AuraEnabled
     public static  ResponseWrapperData getScheduleBoardData(String departmentid){
         System.debug('@@@Department Id : '+departmentid);
         ResponseWrapperData wrapobj = new ResponseWrapperData();
         try{
             AuthorisationData authdata = userAuthentication.EcardLogin();
             String department_code = authdata.data.user.department_code;
             String department_id = authdata.data.user.department_id;
             wrapobj.user_department_code = department_code;
             wrapobj.user_department_id = department_id;
             wrapobj.user_role_id = String.valueOf(authdata.data.user.approle_id);
             string endpoint='';
             if(departmentid==null || Integer.valueof(departmentid.trim())==0){
                endpoint = System.Label.EcardAppendpoint+'api/ecardschedule'; 
             }else{
                endpoint = System.Label.EcardAppendpoint+'api/ecarddepartmentschedule/'+departmentid; 
             }
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
     public static PicklistResponse getPicklistOptions(string picklistName){
         PicklistResponse pickresp = new PicklistResponse();
         //buspropulsions // busstatus // bustype
         try{
             AuthorisationData.Token tokendata = userAuthentication.getAccesstoken();
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
                 if(picklistName == 'bustype'){
                     Options opt1 = new Options();
                     opt1.label = 'All Bus Type';
                     opt1.value = 'All Bus Type';
                     pickoptions.add(opt1);
                     for(DataWrapperEcard.bustype bustypevalue : masterdata.data.bustype){
                         Options opt = new Options();
                         opt.label = bustypevalue.bustype_name;
                         opt.value = bustypevalue.bustype_name;
                         pickoptions.add(opt);
                         
                         Options optwithvalues = new Options();
                         optwithvalues.label = bustypevalue.bustype_name;
                         optwithvalues.value = string.valueOf(bustypevalue.bustype_id);
                         pickoptionswithvalue.add(optwithvalues);
                     }
                     
                 }
                 if(picklistName == 'busstatus'){
                     Options opt1 = new Options();
                     opt1.label = 'All Bus Status';
                     opt1.value = 'All Bus Status';
                     pickoptions.add(opt1);
                     for(DataWrapperEcard.busstatus busstatusvalue : masterdata.data.busstatus){
                         Options opt = new Options();
                         opt.label = busstatusvalue.busstatus_name;
                         opt.value = busstatusvalue.busstatus_name;
                         pickoptions.add(opt);
                         
                         Options optwithvalues = new Options();
                         optwithvalues.label = busstatusvalue.busstatus_name;
                         optwithvalues.value = string.valueOf(busstatusvalue.busstatus_id);
                         pickoptionswithvalue.add(optwithvalues);
                     }
                     
                 }
                 if(picklistName == 'buspropulsions'){
                     Options opt1 = new Options();
                     opt1.label = 'All Propulsion Types';
                     opt1.value = 'All Propulsion Types';
                     pickoptions.add(opt1);
                     for(DataWrapperEcard.buspropulsion buspropulsionvalue : masterdata.data.buspropulsion){
                         Options opt = new Options();
                         opt.label = buspropulsionvalue.buspropulsion_name;
                         opt.value = buspropulsionvalue.buspropulsion_name;
                         pickoptions.add(opt);
                         
                         Options optwithvalues = new Options();
                         optwithvalues.label = buspropulsionvalue.buspropulsion_name;
                         optwithvalues.value = string.valueOf(buspropulsionvalue.buspropulsion_id);
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

    /*
    @AuraEnabled(cacheable=true)
    public static Filterdata getfilterData(string accesstoken, string refreshtoken){
        Filterdata filterdatas = new Filterdata();
        list<string> busstatus= new list<string>{'All Bus Status'};
            list<string> busType= new list<string>{'All Bus Type'};
                list<string> busPropulsion = new list<string>{'All Propulsion Types'};
                    try{
                        filterdatas.buspropulsionList = busPropulsion;
                        filterdatas.bustypeList = busType;
                        filterdatas.busstatusList = busstatus;
                        filterdatas.isError = false;
                        return filterdatas;
                    }
        catch(Exception ex){
            filterdatas.buspropulsionList = busPropulsion;
            filterdatas.bustypeList = busType;
            filterdatas.busstatusList = busstatus;
            filterdatas.isError = true;
            return filterdatas;
        }
    }
    
    @AuraEnabled(cacheable=true)
    public static DataWrapperforScheduleBoard getDatawrapperforScheduleBoard(){
        // AuthorisationData.Token tokendata = (AuthorisationData.Token) System.JSON.deserialize(authdata, AuthorisationData.Token.class);
        AuthorisationData.Token tokendata = userAuthentication.getAccesstoken();
        DataWrapperforScheduleBoard wrapper = new DataWrapperforScheduleBoard();
        EcardDetail edetails = getModifiedScheduleList(tokendata.access_token, tokendata.refresh_token);
        wrapper.scheduleBoarddata = getcompletescheduleBoardData(edetails.ecardList);
        wrapper.latestaccesstoken = edetails.latestaccessToken;
        if(tokendata.access_token != wrapper.latestaccesstoken){
            tokendata.access_token = wrapper.latestaccesstoken;
        }
        Filterdata filterdataobj = getfilterData(tokendata.access_token, tokendata.refresh_token);
        // filterdataobj.chasisList = edetails.chasisList;
        List<string> searchList  = new List<string>();
        //searchList.addAll(filterdataobj.customerList);
        searchList.addAll(edetails.chasisList);
        
        filterdataobj.searchList = searchList;
        wrapper.filters = filterdataobj;
        wrapper.todaysDate = string.valueOf(System.today());
        return wrapper;
    }
    
    @AuraEnabled(cacheable=true)
    public static EcardDetail getModifiedScheduleList(string access_token, string refresh_token){
        EcardDetail details =  new EcardDetail();
        details.latestaccessToken = access_token;
        string response;
        List<Ecard> ecardList = new List<Ecard>();
        Set<string> chasisnumberSet = new Set<string>();
        Set<string> customernameSet = new Set<string>();
        // Get Data From API
        string endpoint = System.Label.EcardAppendpoint+'api/ecardschedule';
        userAuthentication.ResponseWrapper responsewrap = userAuthentication.getData(endpoint, 'GET', access_token, refresh_token);
        if(responsewrap.isError){
            if(responsewrap.statusCode == '401'){
                // Some error has happened
            }
            else{
                // Serious authentication error
            }
        }
        else{
            details.latestaccessToken = responsewrap.latestAccesstoken;
            response = responsewrap.responseBody;
            
        }
        // Get Data From API
        DataWrapperEcard scheduledata = (DataWrapperEcard) System.JSON.deserialize(response, DataWrapperEcard.class);
        for(DataWrapperEcard.Ecard ecardobj : scheduledata.data.ecard){
            // String formattedTime = Datetime.valueOf(ecardobj.schedule_date).format('E ,yyyy-MM-dd HH:mm:ss a', 'IST');
            Ecard modifiedecardobj = new Ecard();
            modifiedecardobj.busStatus = ecardobj.busstatus_name;
            modifiedecardobj.busType = ecardobj.bustype_name;
            modifiedecardobj.busChassisno =  ecardobj.chassis_no;
            modifiedecardobj.busCoachno =  ecardobj.coach_no;
            modifiedecardobj.busEnddate = ecardobj.end_date;
            modifiedecardobj.busFirstname = ecardobj.first_name;
            modifiedecardobj.busDiscrepancytotal = ecardobj.open_discrepancy_total != null ? Integer.valueOf(ecardobj.open_discrepancy_total) : 0;
            modifiedecardobj.busPartshortagetotal = ecardobj.part_shortage_total != null ? Integer.valueOf(ecardobj.part_shortage_total) : 0;
            modifiedecardobj.busScheduledate = ecardobj.schedule_date;
            modifiedecardobj.busFormattedscheduledate = string.valueOf(Date.valueOf(ecardobj.schedule_date));
            modifiedecardobj.busStartdate = ecardobj.start_date;
            modifiedecardobj.customer_name = ecardobj.customer_name;
            modifiedecardobj.busPropulsion = ecardobj.buspropulsion_name;
            modifiedecardobj.busHasDiscrepancy = ecardobj.has_discrepancy;
            modifiedecardobj.busHasPartshortage = ecardobj.has_part_shortage;
            modifiedecardobj.busoutofStationtotal = ecardobj.outofstation_discrepancy_total != null ? Integer.valueOf(ecardobj.outofstation_discrepancy_total) : 0;
            modifiedecardobj.ecardid = ecardobj.ecard_id;
            customernameSet.add(modifiedecardobj.customer_name);
            chasisnumberSet.add(modifiedecardobj.busChassisno);
            ecardList.add(modifiedecardobj);
        }
        details.ecardList = ecardList;
        List<string> chasisList = new List<string>();
        chasisList.addAll(customernameSet);
        chasisList.addAll(chasisnumberSet);
        details.chasisList= chasisList;
        return details;
    }
    
    @AuraEnabled(cacheable=true)
    public static Map<string,List<Ecard>> getcompletescheduleBoardData(List<Ecard> busList){
        Map<string,List<Ecard>> busdataMap = new Map<string,List<Ecard>>();
        for(Ecard busdata : busList){
            if(busdataMap.containsKey(busdata.busFormattedscheduledate)){
                List<Ecard> busListforDay = busdataMap.get(busdata.busFormattedscheduledate) ;
                busListforDay.add(busdata);
                busdataMap.put(busdata.busFormattedscheduledate,busListforDay);
            }
            else{
                List<Ecard> busListforDay = new List<Ecard>();
                busListforDay.add(busdata);
                busdataMap.put(busdata.busFormattedscheduledate,busListforDay);
            }
        }
        return busdataMap;
    }
    */
   

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
    
   /* public class EcardDetail{
        @auraEnabled
        public List<Ecard> ecardList{get;set;}
        @auraEnabled
        public List<string> chasisList{get;set;}
        @auraEnabled
        public string latestaccessToken{get;set;}
    }
   
    public class Ecard {
        @AuraEnabled
        public String busPropulsion{get;set;}
        @AuraEnabled
        public String busStatus{get;set;}
        @AuraEnabled
        public String busType{get;set;}
        @AuraEnabled
        public String busChassisno{get;set;}
        @AuraEnabled
        public String busCoachno{get;set;}
        @AuraEnabled
        public String busEnddate{get;set;}
        @AuraEnabled
        public String busFirstname{get;set;}
        @AuraEnabled
        public Integer busDiscrepancytotal{get;set;}
        @AuraEnabled
        public Boolean busHasDiscrepancy{get;set;}
        @AuraEnabled
        public Integer busPartshortagetotal{get;set;}
        @AuraEnabled
        public Boolean busHasPartshortage{get;set;}
        @AuraEnabled
        public String busScheduledate{get;set;}
        @AuraEnabled
        public String busFormattedscheduledate{get;set;}
        @AuraEnabled
        public String busStartdate{get;set;}
        @AuraEnabled
        public Integer busoutofStationtotal{get;set;}
        @AuraEnabled
        public string busworkcentername{get;set;}
        @AuraEnabled
        public string busworkcenterid{get;set;}
        @AuraEnabled
        public string ecardid{get;set;}
        @AuraEnabled
        public string customer_name{get;set;}
        
    }
    
    public class Filterdata{
        @AuraEnabled
        public List<string> bustypeList{get;set;}
        @AuraEnabled
        public List<string> busstatusList{get;set;}
        @AuraEnabled
        public List<string> buspropulsionList{get;set;}
        @AuraEnabled
        public List<string> searchList{get;set;}
        @AuraEnabled
        public boolean isError{get;set;}
        
    }
    
    public class DataWrapperforScheduleBoard{
        @auraEnabled
        public Filterdata filters{get;set;}
        @auraEnabled
        public Map<string,List<Ecard>> scheduleBoarddata{get;set;}
        @auraEnabled
        public string latestaccesstoken{get;set;}
        @auraEnabled
        public string todaysDate{get;set;}
        
    } */
    
}