using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using System.ComponentModel.DataAnnotations;

namespace server.Models {
    public class User {
        [BsonId]
        public ObjectId? id { get; set; }

        [BsonElement("username")]
        [Required(ErrorMessage = "Username is required.")]
        [StringLength(20, MinimumLength = 4, ErrorMessage = "Username must be between 4 and 20 characters.")]
        public string username { get; set; } = string.Empty;

        [BsonElement("email")]
        [RegularExpression(@"^[^\s@]+@[^\s@]+\.[^\s@]+$", ErrorMessage = "Invalid email address format.")]
        public string? email { get; set; }

        [BsonElement("password")]
        [Required(ErrorMessage = "Password is required.")]
        [StringLength(20, MinimumLength = 4, ErrorMessage = "Password must be between 4 and 20 characters.")]
        public string password { get; set; } = string.Empty;
    }
}