using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using server.DB;


namespace server.Controllers {
    
    [ApiController]
    [Route("view")]
    public class ChartController : Controller {
        private readonly IDatabase _database;

        public ChartController(IDatabase database) {
            _database = database;
        }

        [HttpGet("{a};{b}")]
        [Authorize]
        public async Task<IActionResult>GetChartData(string a, string b) {
            var cryptocurrencies = await _database.GetCoins(a, b);
            var events = await _database.GetEvents();

            return Ok(new {cryptocurrencies, events});
        }
        [HttpGet("all")]
        [Authorize]
        public async Task<IActionResult> GetChartData() {
            var cryptocurrencies = await _database.GetAllCoins();
            var events = await _database.GetEvents();
            return Ok(new { cryptocurrencies, events });
        }

        [HttpGet("tst")]
        public async Task<IActionResult> GetTest() {
            return Ok();
        }

        [HttpGet("tstdb")]
        public async Task<IActionResult> GetDBTest() {
            var test = await _database.GetAllCoins();
            return Ok();
        }
    }
}
