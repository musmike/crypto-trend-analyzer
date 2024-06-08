using System.ComponentModel.DataAnnotations;

namespace server.Models
{
    public class LoginUser
    {
        [Required(ErrorMessage = "Nazwa użytkownika jest wymagana!")]
        public string username { get; set; }

        [Required(ErrorMessage = "Hasło jest wymagane")]
        public string password { get; set; }
    }
}
