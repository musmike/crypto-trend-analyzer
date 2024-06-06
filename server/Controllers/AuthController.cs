using Microsoft.AspNetCore.Mvc;
using server.Auth;
using server.Models;

namespace server.Controllers {
    [ApiController]
    [Route("[controller]")]
    public class AuthController : Controller {
        private readonly IAuth _auth;
        public AuthController(IAuth auth) { 
            _auth = auth;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register(User user) {
            var result = await _auth.RegisterAsync(user);
            if (result) {
                return Ok("Succesful registration");
            }
            return BadRequest("Failed registration");
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login(User user) {
            var token = await _auth.LoginAsync(user);
            if (token == null) {
                return Unauthorized("Invalid credentials");
            }
            return Ok(new { token });
        }
    }
}
