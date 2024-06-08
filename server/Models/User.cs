using MongoDB.Bson.Serialization.Attributes;
using System.ComponentModel.DataAnnotations;

namespace server.Models {
    public class User {
        [BsonId]
        public string? id { get; set; }

        [BsonElement("username")]
        [Required(ErrorMessage = "Nazwa użytkownika jest wymagana!")]
        [StringLength(20, MinimumLength = 4, ErrorMessage = "Nazwa użytkownika musi się składać od 4 do 20 znaków.")]
        public string username { get; set; }

        [BsonElement("email")]
        [Required(ErrorMessage = "Adres email jest wymagany!")]
        [EmailAddress(ErrorMessage = "Niepoprawny email")]
        public string email { get; set; }

        [BsonElement("password")]
        [Required(ErrorMessage = "Hasło jest wymagane")]
        [StringLength(20, MinimumLength = 4, ErrorMessage = "Hasło powinno składać się od 4 do 20 znaków!")]
        public string password { get; set; }
    }
}
