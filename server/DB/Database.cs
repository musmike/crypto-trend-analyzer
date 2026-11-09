using MongoDB.Driver;
using MongoDB.Bson.Serialization;
using server.Models;

namespace server.DB {
    public class Database : IDatabase {
        private readonly IMongoDatabase _database;
        private readonly IConfiguration _configuration;

        public Database(IConfiguration configuration) {
            _configuration = configuration;
            var client = new MongoClient(_configuration["MongoDBSettings:ConnectionString"]);
            _database = client.GetDatabase(_configuration["MongoDBSettings:DatabaseName"]);
        }

        public async Task<IEnumerable<Coin>> GetCoin(string a) {
            var filter = Builders<Coin>.Filter.Eq(c => c.coin, a);
            var coin = _database.GetCollection<Coin>("coins");
            return await coin.Find(filter).ToListAsync();
        }

        public async Task<IEnumerable<Coin>> GetCoins(string a, string b) {
            var filter = Builders<Coin>.Filter.In(c => c.coin, new[] { a, b });
            var coins = _database.GetCollection<Coin>("coins");
            return await coins.Find(filter).ToListAsync();
        }

        public async Task<IEnumerable<Event>> GetEvents() {
            var events = _database.GetCollection<Event>("events");
            return await events.Find(_ => true).ToListAsync();
        }

        public IMongoCollection<User> GetUsers() { 
            return _database.GetCollection<User>("users");
        }

        public async Task<IEnumerable<Coin>> GetAllCoins() {
            var coins = _database.GetCollection<Coin>("coins");
            return await coins.Find(_ => true).ToListAsync();
        }

        public async Task SeedInitialDataAsync() {
            try {
                // 1. Seed events collection
                var eventsCollection = _database.GetCollection<Event>("events");
                if (await eventsCollection.CountDocumentsAsync(_ => true) == 0) {
                    var eventsPath = Path.Combine(AppContext.BaseDirectory, "Data", "events.json");
                    if (File.Exists(eventsPath)) {
                        var json = await File.ReadAllTextAsync(eventsPath);
                        var events = BsonSerializer.Deserialize<List<Event>>(json);
                        await eventsCollection.InsertManyAsync(events);
                        Console.WriteLine("--> [SEED] Successfully imported events.json");
                    }
                }

                // 2. Seed coins collection
                var coinsCollection = _database.GetCollection<Coin>("coins");
                if (await coinsCollection.CountDocumentsAsync(_ => true) == 0) {
                    var coinsPath = Path.Combine(AppContext.BaseDirectory, "Data", "coins.json");
                    if (File.Exists(coinsPath)) {
                        var json = await File.ReadAllTextAsync(coinsPath);
                        var coins = BsonSerializer.Deserialize<List<Coin>>(json);
                        await coinsCollection.InsertManyAsync(coins);
                        Console.WriteLine("--> [SEED] Successfully imported coins.json");
                    }
                }

                // 3. Provision default demonstration user from environment configuration
                var demoUsername = _configuration["DemoUser:Username"] ?? "demo";
                var demoEmail = _configuration["DemoUser:Email"] ?? "demo@example.com";
                var demoPassword = _configuration["DemoUser:Password"];

                if (!string.IsNullOrWhiteSpace(demoPassword)) {
                    var usersCollection = GetUsers();
                    var existingDemoUser = await usersCollection.Find(u => u.username == demoUsername).FirstOrDefaultAsync();
                    if (existingDemoUser == null) {
                        await usersCollection.InsertOneAsync(new User {
                            id = MongoDB.Bson.ObjectId.GenerateNewId(),
                            username = demoUsername,
                            email = demoEmail,
                            password = BCrypt.Net.BCrypt.HashPassword(demoPassword)
                        });
                        Console.WriteLine($"--> [SEED] Created demo user account: {demoUsername}");
                    }
                }
            }
            catch (Exception ex) {
                Console.WriteLine($"--> [SEED ERROR] Database initialization failed: {ex.Message}");
            }
        }
    }
}