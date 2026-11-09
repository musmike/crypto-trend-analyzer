using Microsoft.AspNetCore.Mvc;
using Moq;
using server.Auth;
using server.Controllers;
using server.Models;
using System.ComponentModel.DataAnnotations;
using Xunit;

namespace server.Tests {
    public class AuthControllerTests {
        private readonly Mock<IAuth> _mockAuth;
        private readonly AuthController _controller;

        public AuthControllerTests() {
            _mockAuth = new Mock<IAuth>();
            _controller = new AuthController(_mockAuth.Object);
        }

        [Fact]
        public async Task Login_ReturnsUnauthorized_WhenCredentialsAreInvalid() {
            // Arrange
            var user = new User { username = "wrong", password = "wrongpassword" };
            _mockAuth.Setup(a => a.LoginAsync(user)).ReturnsAsync((string?)null);

            // Act
            var result = await _controller.Login(user);

            // Assert
            Assert.IsType<UnauthorizedObjectResult>(result);
        }

        [Fact]
        public async Task Login_ReturnsOkWithToken_WhenCredentialsAreValid() {
            // Arrange
            var user = new User { username = "demo", password = "demo123" };
            _mockAuth.Setup(a => a.LoginAsync(user)).ReturnsAsync("sample.jwt.token");

            // Act
            var result = await _controller.Login(user);

            // Assert
            var okResult = Assert.IsType<OkObjectResult>(result);
            Assert.NotNull(okResult.Value);
        }

        [Fact]
        public async Task Register_ReturnsOk_WhenUserIsValid() {
            // Arrange
            var user = new User { username = "newuser", email = "new@example.com", password = "password123" };
            _mockAuth.Setup(a => a.RegisterAsync(user)).ReturnsAsync(true);

            // Act
            var result = await _controller.Register(user);

            // Assert
            Assert.IsType<OkObjectResult>(result);
        }

        [Fact]
        public async Task Register_ReturnsBadRequest_OnValidationException() {
            // Arrange
            var user = new User { username = "u", email = "invalid", password = "123" };
            _mockAuth.Setup(a => a.RegisterAsync(user))
                     .ThrowsAsync(new ValidationException("Validation error"));

            // Act
            var result = await _controller.Register(user);

            // Assert
            Assert.IsType<BadRequestObjectResult>(result);
        }
    }
}