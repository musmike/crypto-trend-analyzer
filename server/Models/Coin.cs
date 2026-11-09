using MongoDB.Bson.Serialization.Attributes;

namespace server.Models {
    public class Coin {
        [BsonId]
        [BsonRepresentation(MongoDB.Bson.BsonType.ObjectId)]
        public string? id { get; set; }

        [BsonElement("date")]
        public string date { get; set; } = string.Empty;

        [BsonElement("value")]
        public double value { get; set; }

        [BsonElement("coin")]
        public string coin { get; set; } = string.Empty;
    }
}