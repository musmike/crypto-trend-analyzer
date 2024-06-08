using Microsoft.IdentityModel.Tokens;
using MongoDB.Driver;
using server.DB;
using server.Models;
using System.ComponentModel.DataAnnotations;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using BCrypt.Net;
using MongoDB.Bson;

namespace server.Auth {
    public class Auth : IAuth {
        private readonly IMongoCollection<User> _users;
        private readonly IConfiguration _configuration;

        public Auth(IDatabase database, IConfiguration configuration) {
            _users = database.GetUsers();
            _configuration = configuration;
        }

        public async Task<bool> RegisterAsync(User user)
        {
            var validationResults = new List<ValidationResult>();
            var validationContext = new ValidationContext(user);

            if (!Validator.TryValidateObject(user, validationContext, validationResults, true))
            {
                var errorMessages = validationResults.Select(vr => vr.ErrorMessage);
                throw new ValidationException(string.Join("; ", errorMessages));
            }

            var existingUser = await _users.Find(u => u.username == user.username || u.email == user.email).FirstOrDefaultAsync();
            if (existingUser != null)
            {
                throw new ValidationException("Uzytkownik o danej nazwie uzytkownika lub adresie email istnieje!");
            }

            var hashedPassword = BCrypt.Net.BCrypt.HashPassword(user.password);

            user.password = hashedPassword;
            user.id = ObjectId.GenerateNewId().ToString();
            await _users.InsertOneAsync(user);

            return true;
        }

        public async Task<string> LoginAsync(LoginUser user)
        {
            var exist = await _users.Find(u => u.username == user.username).FirstOrDefaultAsync();

            if (exist == null || !BCrypt.Net.BCrypt.Verify(user.password, exist.password))
            {
                return null;
            }

            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.ASCII.GetBytes(_configuration["Token:key"]);

            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(new Claim[]
                {
                    new Claim(ClaimTypes.Name, exist.username)
                }),
                Expires = DateTime.UtcNow.AddHours(2),
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature),
                Issuer = _configuration["Token:issuer"],
                Audience = _configuration["Token:audience"]
            };
            var token = tokenHandler.CreateToken(tokenDescriptor);

            return tokenHandler.WriteToken(token);
        }
    }
}
