public class DepartmentData {
	@AuraEnabled
	public List<Data> data;

	public class Data {
        @AuraEnabled
		public String created_date;
        @AuraEnabled
		public string createdby_id;
        @AuraEnabled
		public Integer department_id;
        @AuraEnabled
		public String department_name;
        @AuraEnabled
		public string factory_id;
        @AuraEnabled
		public String guid;
        @AuraEnabled
		public string modified_date;
        @AuraEnabled
		public string modifiedby_id;
        @AuraEnabled
		public cordinates cordinates;
        @AuraEnabled
		public dimension dimension;
        // For factory api
        @AuraEnabled
        public string factory_name;
        // For Workcentre api
        @AuraEnabled
        public string workcenter_code;
        @AuraEnabled
        public string workcenter_id;
        @AuraEnabled
        public string workcenter_name;
        // for Fleet
         @AuraEnabled
        public string fleet_id;
         @AuraEnabled
        public string fleet_name;
        // For Build Station
        @AuraEnabled
        public string buildstation_code;
        @AuraEnabled
        public string buildstation_id;
        @AuraEnabled
        public string operation;
        
        
	} 
    
    public class dimension{
        @AuraEnabled
        public integer height;
        @AuraEnabled
        public integer width;
    }

    public class cordinates{
        @AuraEnabled
        public integer x;
        @AuraEnabled
        public integer y;
    }
	public static DepartmentData parse(String json) {
		return (DepartmentData) System.JSON.deserialize(json, DepartmentData.class);
	}
}