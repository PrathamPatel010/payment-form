using api.Constants;
using api.Extensions;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddNLogLogger();
builder.Services.AddControllers();
builder.Services.AddHttpClient();
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowSpecifiedOrigin", policy =>
    {
        policy.WithOrigins(builder.Configuration[AppSettings.AllowedOrigin]!)
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});
builder.Services.AddEndpointsApiExplorer();

var app = builder.Build();

app.UseCors("AllowSpecifiedOrigin");
app.MapControllers();
app.Run();
