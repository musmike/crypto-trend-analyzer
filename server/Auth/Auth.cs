using Microsoft.IdentityModel.Tokens;
using MongoDB.Driver;
using server.DB;
using server.Models;
using System.ComponentModel.DataAnnotations;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using MongoDB.Bson;

namespace server.Auth {
    public class Auth : IAuth {
        private readonly IMongoCollection<User> _users;
        private readonly IConfiguration _configuration;

        public Auth(IDatabase database, IConfiguration configuration) {
            _users = database.GetUsers();
            _configuration = configuration;
        }
        
        public async Task<bool> RegisterAsync(User user) {
            var validationResults = new List<ValidationResult>();
            var validationContext = new ValidationContext(user, null, null);

            if (!Validator.TryValidateObject(user, validationContext, validationResults, true)) {
                var errors = validationResults.Select(r => r.ErrorMessage).ToList();
                throw new ValidationException(string.Join("; ", errors));
            }

            if (string.IsNullOrEmpty(user.email)) {
                throw new ValidationException("Email address is required.");
            }

            var existingUser = await _users.Find(u => u.username == user.username || u.email == user.email).FirstOrDefaultAsync();
            if (existingUser != null) {
                throw new ValidationException("A user with this username or email already exists.");
            }

            user.password = BCrypt.Net.BCrypt.HashPassword(user.password);
            user.id = ObjectId.GenerateNewId();
            await _users.InsertOneAsync(user);

            return true;
        }

        public async Task<string?> LoginAsync(User user) {
            var existingUser = await _users.Find(u => u.username == user.username).FirstOrDefaultAsync();

            if (existingUser == null || !BCrypt.Net.BCrypt.Verify(user.password, existingUser.password)) {
                return null;
            }

            var jwtKey = _configuration["Token:Key"] 
                ?? throw new InvalidOperationException("JWT Key is not configured.");

            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.ASCII.GetBytes(jwtKey);

            var tokenDescriptor = new SecurityTokenDescriptor {
                Subject = new ClaimsIdentity(new[] {
                    new Claim(ClaimTypes.Name, existingUser.username)
                }),
                Expires = DateTime.UtcNow.AddHours(2),
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature),
                Issuer = _configuration["Token:Issuer"],
                Audience = _configuration["Token:Audience"]
            };

            var token = tokenHandler.CreateToken(tokenDescriptor);
            return tokenHandler.WriteToken(token);
        }
    }
}