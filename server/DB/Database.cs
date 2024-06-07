using MongoDB.Driver;

namespace server.DB {
    public class Database : IDatabase {
        private readonly IMongoDatabase _database;
        private readonly IConfiguration _configuration;
        public Database(IConfiguration configuration) {
            _configuration = configuration;
            //var client = new MongoDB.Driver.MongoClient(config);
            var client = new MongoDB.Driver.MongoClient(_configuration["MongoDBSettings:ConnectionString"]);
            _database = client.GetDatabase(_configuration["MongoDBSettings:DatabaseName"]);
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
