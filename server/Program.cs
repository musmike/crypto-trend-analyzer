using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using server.Auth;
using server.DB;
using System.Text;

var builder = WebApplication.CreateBuilder(args);
var config = builder.Configuration;

// Register database and authentication services
builder.Services.AddSingleton<IDatabase, Database>();
builder.Services.AddScoped<IAuth, Auth>();

// Configure Cross-Origin Resource Sharing (CORS)
builder.Services.AddCors(options => {
    options.AddPolicy("AllowAll", policy => {
        policy.AllowAnyOrigin().AllowAnyMethod().AllowAnyHeader();
    });
});

builder.Services.AddControllers();

// Configure JWT bearer authentication
var jwtKey = config["Token:Key"] 
    ?? throw new InvalidOperationException("JWT Token Key is not configured.");
var key = Encoding.ASCII.GetBytes(jwtKey);

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options => {
        options.TokenValidationParameters = new TokenValidationParameters {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = config["Token:Issuer"],
            ValidAudience = config["Token:Audience"],
            IssuerSigningKey = new SymmetricSecurityKey(key)
        };
        options.Events = new JwtBearerEvents {
            OnAuthenticationFailed = context => {
                Console.WriteLine("Authentication failed: " + context.Exception.Message);
                return Task.CompletedTask;
            },
            OnTokenValidated = context => {
                Console.WriteLine("Token successfully validated: " + context.SecurityToken);
                return Task.CompletedTask;
            }
        };
    });

builder.Logging.ClearProviders();
builder.Logging.AddConsole();   

var app = builder.Build();

app.UseRouting();
app.UseCors("AllowAll");
app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

// Execute automated database seeding on application startup
using (var scope = app.Services.CreateScope()) {
    var database = scope.ServiceProvider.GetRequiredService<IDatabase>();
    await database.SeedInitialDataAsync();
}

app.Run();