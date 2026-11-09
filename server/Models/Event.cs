using MongoDB.Bson.Serialization.Attributes;

namespace server.Models {
    public class Event {
        [BsonId]
        [BsonRepresentation(MongoDB.Bson.BsonType.ObjectId)]
        public string? id { get; set; }

        [BsonElement("name")]
        public string name { get; set; } = string.Empty;

        [BsonElement("date")]
        public string date { get; set; } = string.Empty;

        [BsonElement("type")]
        public string type { get; set; } = string.Empty;
    }
}