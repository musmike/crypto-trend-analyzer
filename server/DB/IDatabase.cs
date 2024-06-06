using MongoDB.Driver;

namespace server.DB {
    public interface IDatabase {
        Task<IEnumerable<Models.Coin>>GetCoins(string a, string b);
        Task<IEnumerable<Models.Event>> GetEvents();
        IMongoCollection<Models.User> GetUsers();
    }
}
