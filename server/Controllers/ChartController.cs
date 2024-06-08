using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using server.DB;


namespace server.Controllers {
    [Authorize]
    [ApiController]
    [Route("view")]
    public class ChartController : Controller {
        private readonly IDatabase _database;

        public ChartController(IDatabase database) {
            _database = database;
        }

        [HttpGet("{a}")]
        public async Task<IActionResult> GetChartDataSingle(string a) {
            var cryptocurrencies = await _database.GetCoin(a);
            var events = await _database.GetEvents();

            return Ok(new { cryptocurrencies, events });
        }

        [HttpGet("{a};{b}")]
        public async Task<IActionResult>GetChartData(string a, string b) {
            var cryptocurrencies = await _database.GetCoins(a, b);
            var events = await _database.GetEvents();

            return Ok(new {cryptocurrencies, events});
        }
        [HttpGet("all")]
        public async Task<IActionResult> GetChartData() {
            var cryptocurrencies = await _database.GetAllCoins();
            var events = await _database.GetEvents();
            return Ok(new { cryptocurrencies, events });
        }
    }
}
