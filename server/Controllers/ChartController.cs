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

        // GET: /view/all - Returns all cryptocurrency historical data and events
        [HttpGet("all")]
        public async Task<IActionResult> GetAllChartData() {
            var cryptocurrencies = await _database.GetAllCoins();
            var events = await _database.GetEvents();
            return Ok(new { cryptocurrencies, events });
        }

        // GET: /view/coin/{symbol} - Returns data for a single asset (e.g. /view/coin/BTC)
        [HttpGet("coin/{symbol}")]
        public async Task<IActionResult> GetChartDataSingle(string symbol) {
            var cryptocurrencies = await _database.GetCoin(symbol);
            var events = await _database.GetEvents();
            return Ok(new { cryptocurrencies, events });
        }

        // GET: /view/compare?a=BTC&b=ETH - Standard RESTful comparison endpoint
        [HttpGet("compare")]
        public async Task<IActionResult> GetChartDataComparison([FromQuery] string a, [FromQuery] string b) {
            if (string.IsNullOrWhiteSpace(a) || string.IsNullOrWhiteSpace(b)) {
                return BadRequest("Both 'a' and 'b' query parameters are required for comparison.");
            }

            var cryptocurrencies = await _database.GetCoins(a, b);
            var events = await _database.GetEvents();
            return Ok(new { cryptocurrencies, events });
        }
    }
}