public class AuthorisationData {
	@AuraEnabled
    public Data data;
    
    public class User {
        @AuraEnabled
        public Integer approle_id;
        @AuraEnabled
        public Integer appuser_id;
        @AuraEnabled
        public String appuser_name;
        @AuraEnabled
        public String first_name;
        @AuraEnabled
        public String last_name;
        @AuraEnabled
        public String user_type;
        @AuraEnabled
        public String department_code;
        @AuraEnabled
        public String department_id;
        
    }
    
    public class Token {
        @AuraEnabled
        public String access_token;
        @AuraEnabled
        public string expiry_token;
        @AuraEnabled
        public String refresh_token;
    }
    
    public class Data {
        @AuraEnabled
        public Token token;
        @AuraEnabled
        public User user;
    }
}