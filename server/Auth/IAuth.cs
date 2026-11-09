using server.Models;

namespace server.Auth {
    public interface IAuth {
        Task<bool> RegisterAsync(User user);
        Task<string?> LoginAsync(User user); 
    }
}