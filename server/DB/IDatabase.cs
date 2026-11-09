using MongoDB.Driver;

namespace server.DB {
    public interface IDatabase {
        Task<IEnumerable<Models.Coin>> GetCoin(string a);
        Task<IEnumerable<Models.Coin>>GetCoins(string a, string b);
        Task<IEnumerable<Models.Coin>> GetAllCoins();
        Task<IEnumerable<Models.Event>> GetEvents();
        IMongoCollection<Models.User> GetUsers();
        Task SeedInitialDataAsync();
    }
}
