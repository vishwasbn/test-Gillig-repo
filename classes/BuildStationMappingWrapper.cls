public class BuildStationMappingWrapper {
    
    public class Prod {
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
    
    public class Qc {
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

    public class Busareacoordinates{
        @AuraEnabled
        public String x;
        @AuraEnabled
        public String y;
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
    
    public class Workcenter {
        @AuraEnabled
        public List<Buildstation> buildstation;
        @AuraEnabled
        public Integer workcenter_id;
        @AuraEnabled
        public String workcentername;
    }
    
    public class Buildstation {
        @AuraEnabled
        public string modified_date;
        @AuraEnabled 
        public Boolean has_discrepancy_logged;
        @AuraEnabled 
		public Boolean has_shortage_logged;
        @AuraEnabled 
        public string applied_date;
        @AuraEnabled 
        public List<Integer> assignedprod;
        @AuraEnabled 
        public List<Integer> assignedqc;
        @AuraEnabled 
        public Integer ecard_operation_log_id;
        @AuraEnabled 
        public Integer qc_updatedby_id;
        @AuraEnabled
        public String buildstation_code;
        @AuraEnabled
        public Integer buildstation_id;
        @AuraEnabled
        public Integer buildstationmapping_id;
        @AuraEnabled 
		public Integer fleet_id;
        @AuraEnabled
        public Boolean has_bm35;
        @AuraEnabled
        public Boolean has_buildpaper;
        @AuraEnabled
        public Boolean has_discrepancy;
        @AuraEnabled
        public Boolean has_epcpco;
        @AuraEnabled
        public Boolean has_help_document;
        @AuraEnabled
        public Boolean has_pco;
        @AuraEnabled
        public Boolean has_validation_pic;
        @AuraEnabled
        public String operation;
        @AuraEnabled 
		public Integer picture_validation_target_image_id;
        @AuraEnabled 
		public Integer picture_validation_id;               
        @AuraEnabled
        public List<Prod> prod;
        @AuraEnabled
        public Qc qc_approvedby_id;
        @AuraEnabled
        public String status;
        @AuraEnabled
        public Prod forman1_id;
        @AuraEnabled
        public Prod forman2_id;
        @AuraEnabled
        public Prod forman3_id;
        @AuraEnabled
        public Prod forman4_id;
        @AuraEnabled
        public Prod forman5_id; 
        @AuraEnabled 
		public string validation_image_uri;
        @AuraEnabled 
		public boolean validation_pic_required;
    }
    
    public class Data {
        @AuraEnabled
        public String department_id;
        @AuraEnabled
        public Boolean has_discrepancy;
        @AuraEnabled
        public List<Prod> prod_supervisor;
        @AuraEnabled
        public List<Qc> qc;
        @AuraEnabled
        public List<Workcenter> workcenter;
        /*@AuraEnabled
        public String department_id; */
        @AuraEnabled
        public List<Discrepancylog> discrepancylog;
        @AuraEnabled
        public List<Department> department;
        
        
    }

    public class Department {
		public string department_id;
		public Boolean has_discrepancy;
		public List<Prod> prod_supervisor;
		public List<Qc> qc;
		public List<Workcenter> workcenter;
	}
    
    @AuraEnabled
    public Data data;
    
    
    public static BuildStationMappingWrapper parse(String json) {
        return (BuildStationMappingWrapper) System.JSON.deserialize(json, BuildStationMappingWrapper.class);
    }
}