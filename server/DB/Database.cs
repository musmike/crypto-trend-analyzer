using MongoDB.Driver;

namespace server.DB {
    public class Database : IDatabase {
        private readonly IMongoDatabase _database;
        public Database() {
            //var client = new MongoDB.Driver.MongoClient(config);
            var client = new MongoDB.Driver.MongoClient("mongodb://localhost:27017");
            _database = client.GetDatabase("coin");
            }
        public async Task<IEnumerable<Models.Coin>>GetCoins(string a, string b) {
            var filter = Builders<Models.Coin>.Filter.In(c => c.coin, new[] { a, b });
            var coins = _database.GetCollection<Models.Coin>("coins");
            return await coins.Find(filter).ToListAsync();
        }
        public async Task<IEnumerable<Models.Event>> GetEvents() {
            var events = _database.GetCollection<Models.Event>("events");
            return await events.Find(_ => true).ToListAsync();
        }
        public IMongoCollection<Models.User> GetUsers() { 
            return _database.GetCollection<Models.User>("users");
        }
        public async Task<IEnumerable<Models.Coin>> GetAllCoins() {
            var coins = _database.GetCollection<Models.Coin>("coins");
            return await coins.Find(_ => true).ToListAsync();
        }
    }
}
