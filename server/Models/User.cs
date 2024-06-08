using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using System.ComponentModel.DataAnnotations;

namespace server.Models {
    public class User {
        [BsonId]
        public ObjectId? id { get; set; }
        [BsonElement("username")]
        [StringLength(20, MinimumLength = 4, ErrorMessage ="Invalid Username")]
        public string username { get; set; }
        [BsonElement("email")]
        [EmailAddress(ErrorMessage ="Invalid Email")]
        public string? email { get; set; }
        [BsonElement("password")]
        [StringLength(20, MinimumLength =4, ErrorMessage ="Invalid Password")]
        public string password { get; set; }
    }
}
