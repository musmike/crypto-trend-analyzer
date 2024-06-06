using Microsoft.IdentityModel.Tokens;
using MongoDB.Driver;
using server.DB;
using server.Models;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace server.Auth {
    public class Auth : IAuth{
        private readonly IMongoCollection<User> _users;
        private readonly IConfiguration _configuration;

        public Auth(IDatabase database, IConfiguration configuration) {
            _users = database.GetUsers();
            _configuration = configuration;
        }
        
        public async Task<bool> RegisterAsync(User user) {
            var exist = await _users.Find(u=>u.username == user.username).FirstOrDefaultAsync();
            if (exist == null) { 
                await _users.InsertOneAsync(user);
                return true;
            }
            return false;
        }

        public async Task<string> LoginAsync(User user) {
            var exist = await _users.Find(u=>u.username == user.username && u.password == user.password).FirstOrDefaultAsync();
            if (exist == null) {
                return null;
            }

            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.ASCII.GetBytes(_configuration["Token:key"]);
            var tokenDescriptor = new SecurityTokenDescriptor {
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
