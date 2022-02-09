public class DataWrapperEcard {
    
    @AuraEnabled
    public data data{get;set;}
    
    
    public class data{
        @AuraEnabled
        public list<departments> departments{get;set;}
        @auraEnabled
        public List<busstatus> busstatus;
        @auraEnabled
        public List<bustype> bustype;
        @auraEnabled
        public List<buspropulsion> buspropulsion;
        @AuraEnabled
        public List<Ecard> ecard;
        @AuraEnabled
        public List<defects> defects;
        @AuraEnabled
        public List<Discrepancylog> discrepancylog;
        
    }
    
    public class Discrepancylog {
        
        @AuraEnabled
        public string modified_date;
        @AuraEnabled
        public Busareacoordinates bus_area;
        @AuraEnabled
        public string bus_area_picture_id;
        @AuraEnabled
        public string custom_part_name;
        @AuraEnabled
        public string customer_name;
        @AuraEnabled
        public String part_shortage_id;
        @AuraEnabled
        public String buildstation_code;
        @AuraEnabled
        public Integer buildstation_id;
        @AuraEnabled
        public Integer buspart_id;
        @AuraEnabled
		public String buspart_name;
        @AuraEnabled
		public String buspart_no;
        @AuraEnabled
        public Integer busstatus_id;
        @AuraEnabled
        public String busstatus_name;
        @AuraEnabled
        public String chassis_no;
        @AuraEnabled
        public String component;
        @AuraEnabled
        public Userdata createdby_id;
        @AuraEnabled
        public String cut_off_date;
        @AuraEnabled
        public Integer dat_defect_code_id;
        @AuraEnabled
        public String defect_code;
        @AuraEnabled
        public String defect_name;
        @AuraEnabled
        public String defect_type;
        @AuraEnabled
        public Integer department_id;
        @AuraEnabled
        public String department_name;
        @AuraEnabled
        public String discrepancy;
        @AuraEnabled
        public String discrepancy_priority;
        @AuraEnabled
        public String discrepancy_status;
        @AuraEnabled
        public String discrepancy_type;
        @AuraEnabled
        public Integer ecard_discrepancy_area_id;
        @AuraEnabled
        public Integer ecard_discrepancy_log_id;
        @AuraEnabled
        public Integer ecard_id;
        @AuraEnabled
        public Integer ecard_operation_log_id;
        @AuraEnabled
        public String first_name;
        @AuraEnabled
        public String last_name;
        @AuraEnabled
        public Boolean has_part_shortage;
        @AuraEnabled
        public Userdata forman1_id;
        @AuraEnabled
        public Userdata forman2_id;
        @AuraEnabled
        public Userdata forman3_id;
        @AuraEnabled
        public Userdata forman4_id;
        @AuraEnabled
        public Userdata forman5_id;
        @AuraEnabled
        public Boolean part_avilable;
        @AuraEnabled
        public string po_no;
        @AuraEnabled
        public List<Userdata> prod;
        @AuraEnabled
        public List<Userdata> qc;
        @AuraEnabled
        //public Integer quantity;
        public Decimal quantity;
        @AuraEnabled
        public Userdata raised_by_id;
        @AuraEnabled
        public Userdata assigend_qc_id;
        @AuraEnabled
        public string raised_date;
        @AuraEnabled
        public string raised_status_updated_date;
        @AuraEnabled
        public string resolved_date;
        @AuraEnabled
        public Userdata resolved_status_updatedby_id;
        @AuraEnabled
        public string resolved_status_updated_date;
        @AuraEnabled
        public string root_cause;
        @AuraEnabled
        public Userdata verifiedby_id;
        @AuraEnabled
        public string verified_date;
        @AuraEnabled
        public string verified_status_updated_date;
        @AuraEnabled
        public string workcenter_code;
        @AuraEnabled
        public string workcenter_name;
    }

    public class Busareacoordinates{
        @AuraEnabled
        public String x;
        @AuraEnabled
        public String y;
    }
    
    public class Userdata {
        @AuraEnabled
        public String appuser_name;
        @AuraEnabled
        public Integer employee_id;
        @AuraEnabled
        public String first_name;
        @AuraEnabled
        public String last_name;
        @AuraEnabled
        public String employee_number;
    }
    
    public class defects{
        @AuraEnabled
        public String created_date{get;set;}
        @AuraEnabled
        public String createdby_id{get;set;}
        @AuraEnabled
        public Integer dat_defect_code_id{get;set;}
        @AuraEnabled
        public String defect_code{get;set;}
        @AuraEnabled
        public String defect_name{get;set;}
        @AuraEnabled
        public String defect_type{get;set;}
        @AuraEnabled
        public String guid{get;set;}
        @AuraEnabled
        public String modified_date{get;set;}
        @AuraEnabled
        public String modifiedby_id{get;set;}
    }
    
    public class departments{
        @AuraEnabled
        public Boolean bus_area_discrepancy_enabled{get;set;}
        @AuraEnabled
        public String created_date{get;set;}
        @AuraEnabled
        public String defect_type{get;set;}
        @AuraEnabled
        public String reference_key{get;set;}
        @AuraEnabled
        public Boolean is_assembly_line{get;set;} 
        @AuraEnabled
        public String guid{get;set;}
        @AuraEnabled
        public Integer factory_id{get;set;}
        @AuraEnabled
        public String department_name{get;set;}
        @AuraEnabled
        public String modified_date{get;set;}
        @AuraEnabled
        public Integer department_id{get;set;}
        @AuraEnabled
        public String modifiedby_id{get;set;}
        @AuraEnabled
        public String createdby_id{get;set;}        
    }
    
    public class buspropulsion{
        @auraEnabled
        public Integer buspropulsion_id;
        @auraEnabled
        public String buspropulsion_name;
    }
    
    public class bustype{
        @auraEnabled
        public Integer bustype_id;
        @auraEnabled
        public String bustype_name;
    }
    
    public class busstatus {
        @auraEnabled
        public Integer busstatus_id;	
        @auraEnabled
        public String busstatus_name;	
    }
    
    public class Ecard {
        @AuraEnabled
        public string modified_date;
        @AuraEnabled
        public string customer_name;
        @AuraEnabled
        public String curb_side_image_url;
        @AuraEnabled
        public String street_side_image_url;
        @AuraEnabled
        public string bus_relative_seq;
        @AuraEnabled
        public String buspropulsion_name;
        @AuraEnabled
        public String busstatus_name;
        @AuraEnabled
        public String bustype_name;
        @AuraEnabled
        public String chassis_no;
        @AuraEnabled
        public String coach_no;
        @AuraEnabled
        public string department_name;
        @AuraEnabled
        public String ecard_id;
        @AuraEnabled
        public String end_date;
        @AuraEnabled
        public String first_name;
        @AuraEnabled
        public Boolean has_discrepancy;
        @AuraEnabled
        public Boolean has_part_shortage;
        @AuraEnabled
        public String open_discrepancy_total;
        @AuraEnabled
        public String part_shortage_total;
        @AuraEnabled
        public String schedule_date;
        @AuraEnabled
        public String start_date;
        @AuraEnabled
        public String outofstation_discrepancy_total;
        @AuraEnabled
        public string workcenter_id;
        @AuraEnabled
        public string workcenter_name;
    }
    
    
}