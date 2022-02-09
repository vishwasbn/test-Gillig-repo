public class InspectionResponseWrapper {
    public Data data;
	public class Data {
		public String chassis_no;	//197402
		public String upload_status;	//unsuccessful as corresponding Ecard_id not found
	}
	public static InspectionResponseWrapper parse(String json){
		return (InspectionResponseWrapper) System.JSON.deserialize(json, InspectionResponseWrapper.class);
	}
}