using Microsoft.AspNetCore.Mvc;
using server.Auth;
using server.Models;
using System.ComponentModel.DataAnnotations;

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
            try {
                var result = await _auth.RegisterAsync(user);
                if (result) {
                    return Ok("Rejestracja udana!");
                }
                return BadRequest("Błąd rejestracji");

                }
            catch (ValidationException e){
                return BadRequest(e.Message);
            }
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login(User user) {
            var token = await _auth.LoginAsync(user);
            if (token == null) {
                return Unauthorized("Niepoprawne dane");
            }
            return Ok(new { token });
        }

        [HttpGet("hello")]
        public async Task<IActionResult> Hello()
        {
            return Ok("Hello, World!");
        }
    }
}
