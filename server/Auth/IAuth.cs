using server.Models;
using System.Threading.Tasks;

namespace server.Auth {
    public interface IAuth {
        Task<bool> RegisterAsync(User user);
        Task<string> LoginAsync(User user); 
    }
}
