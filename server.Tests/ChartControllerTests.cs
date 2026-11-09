using Microsoft.AspNetCore.Mvc;
using Moq;
using server.Controllers;
using server.DB;
using server.Models;
using Xunit;

namespace server.Tests {
    public class ChartControllerTests {
        private readonly Mock<IDatabase> _mockDb;
        private readonly ChartController _controller;

        public ChartControllerTests() {
            _mockDb = new Mock<IDatabase>();
            _controller = new ChartController(_mockDb.Object);
        }

        [Fact]
        public async Task GetAllChartData_ReturnsOkResult_WithCoinsAndEvents() {
            // Arrange
            _mockDb.Setup(db => db.GetAllCoins()).ReturnsAsync(new List<Coin> {
                new Coin { coin = "BTC", date = "2023-01-01", value = 16500 }
            });
            _mockDb.Setup(db => db.GetEvents()).ReturnsAsync(new List<Event> {
                new Event { name = "Test Event", date = "2023-01-01", type = "Economy" }
            });

            // Act
            var result = await _controller.GetAllChartData();

            // Assert
            var okResult = Assert.IsType<OkObjectResult>(result);
            Assert.NotNull(okResult.Value);
        }

        [Fact]
        public async Task GetChartDataSingle_ReturnsOkResult_ForValidCoin() {
            // Arrange
            _mockDb.Setup(db => db.GetCoin("BTC")).ReturnsAsync(new List<Coin> {
                new Coin { coin = "BTC", date = "2023-01-01", value = 16500 }
            });
            _mockDb.Setup(db => db.GetEvents()).ReturnsAsync(new List<Event>());

            // Act
            var result = await _controller.GetChartDataSingle("BTC");

            // Assert
            Assert.IsType<OkObjectResult>(result);
        }

        [Fact]
        public async Task GetChartDataComparison_ReturnsBadRequest_WhenQueryParamsAreEmpty() {
            // Act
            var result = await _controller.GetChartDataComparison("", "ETH");

            // Assert
            Assert.IsType<BadRequestObjectResult>(result);
        }

        [Fact]
        public async Task GetChartDataComparison_ReturnsOkResult_WhenBothCoinsProvided() {
            // Arrange
            _mockDb.Setup(db => db.GetCoins("BTC", "ETH")).ReturnsAsync(new List<Coin>());
            _mockDb.Setup(db => db.GetEvents()).ReturnsAsync(new List<Event>());

            // Act
            var result = await _controller.GetChartDataComparison("BTC", "ETH");

            // Assert
            Assert.IsType<OkObjectResult>(result);
        }
    }
}