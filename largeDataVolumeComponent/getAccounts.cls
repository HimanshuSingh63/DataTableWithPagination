public class getAccounts {
    @AuraEnabled
    public static Map<String, Object> getRecords(Integer pageSize, Integer pageNumber, String searchTerm) {
    String query = 'SELECT Id, Name, CustomEmail__c FROM Account';
    String countQuery = 'SELECT COUNT() FROM Account';
    
    if (String.isNotBlank(searchTerm)) {
        String liketerm = '%' + String.escapeSingleQuotes(searchTerm) + '%';
        String whereClause = ' WHERE (Name LIKE :liketerm OR CustomEmail__c LIKE :liketerm)';
        query += whereClause;
        countQuery += whereClause;
    }
    
    query += ' ORDER BY Name LIMIT :pageSize OFFSET :offset';

    Integer offset = (pageNumber - 1) * pageSize;
    List<Account> records = Database.query(query);

    Integer totalRecords = Database.countQuery(countQuery);

    return new Map<String, Object>{
        'records' => records,
        'totalRecords' => totalRecords
    };
}
}