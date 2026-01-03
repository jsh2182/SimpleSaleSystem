using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Authorization;
using Microsoft.EntityFrameworkCore;
using Microsoft.OpenApi.Models;
using Newtonsoft.Json;
using NLog;
using NLog.Web;
using SimpleSaleSystem.Common;
using SimpleSaleSystem.Data;
using SimpleSaleSystem.Data.Repositories;
using SimpleSaleSystem.Services;
using SimpleSaleSystem.WebFramework.Configuration;
using SimpleSaleSystem.WebFramework.CustomMapping;
using SimpleSaleSystem.WebFramework.Middlewares;
using Swashbuckle.AspNetCore.SwaggerUI;
using WebFramework.Filters;
var logger = LogManager.Setup().LoadConfigurationFromFile("nlog.config").GetCurrentClassLogger();
SiteSettings? _siteSettings;
logger.Debug("init main");
try
{
    var builder = WebApplication.CreateBuilder(args);
    builder.Services.AddControllers(opt =>
    {
        opt.Filters.Add(new AuthorizeFilter());
        opt.Filters.Add(new ApiResultFilterAttribute());
    }).AddNewtonsoftJson(options =>
        options.SerializerSettings.ReferenceLoopHandling = ReferenceLoopHandling.Ignore).ConfigureApiBehaviorOptions(options =>
        {
            options.InvalidModelStateResponseFactory = context =>
            {
                List<string> errors = [];
                foreach (var val in context.ModelState.Values)
                {
                    errors.Add(string.Join(',', val.Errors.Select(er => er.ErrorMessage)));
                }
                string errorMessage = string.Join(',', errors);
                var json = JsonConvert.SerializeObject(new { Error = errorMessage });
                return new BadRequestObjectResult(errorMessage);
            };
        }); ;
    _siteSettings = builder.Configuration.GetSection(nameof(SiteSettings)).Get<SiteSettings>();
    string allowedOrigins = "AllowedOrigins";
    if (_siteSettings?.AllowedCorsOrigins?.Length > 0)
    {
        string[] addressList = _siteSettings.AllowedCorsOrigins.Split(",");
        builder.Services.AddCors(options =>
        {
            options.AddPolicy(name: allowedOrigins, policy => { policy.WithOrigins(addressList); });
        });

    }
    builder.Services.Configure<SiteSettings>(builder.Configuration.GetSection(nameof(SiteSettings)));
    builder.Services.AddDbContext<ApplicationDbContext>(options =>
    {

        options.UseSqlServer(builder.Configuration.GetConnectionString("SimpleSaleSystemConnection"));
        options.EnableSensitiveDataLogging();
    });
    builder.Services.AddScoped(typeof(IRepository<>), typeof(Repository<>));
    builder.Services.RegisterAllRepositories(typeof(IRepository<>), typeof(Repository<>));
    builder.Logging.ClearProviders();
    builder.Host.UseNLog();
    builder.Services.AddScoped<IJwtService, JwtService>();
    if (_siteSettings == null)
    {
        throw new Exception("Site Settings Is Null. Check The Config File");
    }
    builder.Services.AddJwtAuthentication(_siteSettings.JwtSettings);
    builder.Services.AddAutoMapper(config => { }, typeof(UserMappingProfile).Assembly);
    builder.Services.AddEndpointsApiExplorer();
    builder.Services.AddSwaggerGen(config =>
    {
        config.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
        {
            Name = "Authorization",
            In = ParameterLocation.Header,
            Type = SecuritySchemeType.ApiKey,
            Scheme = "Bearer"
        });
        config.AddSecurityRequirement(new OpenApiSecurityRequirement
            {
                {
                    new OpenApiSecurityScheme
                    {
                        Reference = new OpenApiReference
                        {
                            Type = ReferenceType.SecurityScheme,
                            Id = "Bearer"
                        }
                    },
                    Array.Empty<string>()
                }
            });
    });

    var app = builder.Build();
    using (var scope = app.Services.CreateScope())
    {
        var db = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
        db.Database.Migrate();
    }
    app.UseDefaultFiles();
    app.UseStaticFiles();
    app.UseCustomExceptionHandler();
    // Configure the HTTP request pipeline.
    //if (app.Environment.IsDevelopment())
    //{
    app.UseSwagger(c =>
    {
        c.RouteTemplate = "api_docs/{documentName}/doc.json";
    });
    app.UseSwaggerUI(config =>
    {
        config.SwaggerEndpoint("/api_docs/v1/doc.json", "SimpleSaleSystem API V1");
        config.RoutePrefix = "api_docs";
        config.DocumentTitle = "SimpleSaleSystem";
        config.DocExpansion(DocExpansion.None);
        config.DefaultModelsExpandDepth(-1);
    });
    // }

    app.UseHttpsRedirection();
    if (_siteSettings?.AllowedCorsOrigins?.Length > 0)
    {
        app.UseCors(allowedOrigins);
    }
    app.UseAuthorization();

    app.MapControllers();

    app.MapFallbackToFile("/index.html");
    app.Run();

}
catch (Exception ex)
{

    logger.Error(ex, "Stopped Program");
    throw;
}
finally
{
    LogManager.Shutdown();
}