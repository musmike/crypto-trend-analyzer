using MongoDB.Bson.Serialization.Attributes;

namespace server.Models {
    public class User {
        [BsonId]
        public string? id { get; set; }
        [BsonElement("username")]
        public string username { get; set; }
        [BsonElement("email")]
        public string email { get; set; }
        [BsonElement("password")]
        public string password { get; set; }
    }
}
