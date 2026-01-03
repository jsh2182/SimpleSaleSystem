using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using SimpleSaleSystem.Common;
using SimpleSaleSystem.Common.Exceptions;
using SimpleSaleSystem.Data;
using SimpleSaleSystem.Data.Repositories;
using SimpleSaleSystem.Services;
using SimpleSaleSystem.WebFramework.Filters;
using System.Net;
using System.Security.Claims;
using System.Text;

namespace SimpleSaleSystem.WebFramework.Configuration
{
    public static class ServiceCollectionExtensions
    {
        public static void AddJwtAuthentication(this IServiceCollection services, JwtSettings jwtSettings)
        {
            services.AddAuthentication(options =>
            {
                options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
                options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
                options.DefaultScheme = JwtBearerDefaults.AuthenticationScheme;
            }).AddJwtBearer(options =>
            {
                var secretkey = Encoding.UTF8.GetBytes(jwtSettings.SecretKey);
                var encryptionkey = Encoding.UTF8.GetBytes(jwtSettings.Encryptkey);

                var validationParameters = new TokenValidationParameters
                {
                    ClockSkew = TimeSpan.Zero, // default: 5 min
                    RequireSignedTokens = true,

                    ValidateIssuerSigningKey = true,
                    IssuerSigningKey = new SymmetricSecurityKey(secretkey),

                    RequireExpirationTime = true,
                    ValidateLifetime = true,

                    ValidateAudience = true, //default : false
                    ValidAudience = jwtSettings.Audience,

                    ValidateIssuer = true, //default : false
                    ValidIssuer = jwtSettings.Issuer,

                    TokenDecryptionKey = new SymmetricSecurityKey(encryptionkey)
                };

                options.RequireHttpsMetadata = false;
                options.SaveToken = true;
                options.TokenValidationParameters = validationParameters;
                options.Events = new JwtBearerEvents
                {
                    OnAuthenticationFailed = context =>
                    {
                        if (context.Exception != null)
                        {
                            //var ex= new AppException(ApiResultStatusCode.UnAuthorized, TranslateMessage("Authentication Failed."), HttpStatusCode.Unauthorized, context.Exception);
                            //throw ex;
                            context.Fail(TranslateMessage("Authentication Failed."));
                        }

                        return Task.CompletedTask;
                    },
                    OnTokenValidated = async context =>
                    {
                        IUserRepository userRepo = context.HttpContext.RequestServices.GetRequiredService<IUserRepository>();

                        var claimsIdentity = context.Principal?.Identity as ClaimsIdentity;
                        if (claimsIdentity?.Claims?.Any() != true)
                        {
                            context.Fail("This Token Has No Claims.");
                        }
                        int userID = claimsIdentity?.GetUserId<int>() ?? 0;
                        bool isValid = await userRepo.UserIsValid(userID, context.HttpContext.RequestAborted);

                        if (!isValid)
                        {
                            //کاربر درخواست کننده معتبر نیست
                            context.Fail("The Requesting User Is Invalid.");
                        }
                        #region Check Permission
                        var endpoint = context.HttpContext.GetEndpoint();
                        
                            PageAttribute? pageAttribute = endpoint?.Metadata?.GetMetadata<PageAttribute>();

                            if (pageAttribute != null)
                            {
                                IPagePermissionRepository permissionRepo = context.HttpContext.RequestServices.GetRequiredService<IPagePermissionRepository>();
                                short pageID = GlobalItems.AllPages?.FirstOrDefault(p => p.PageName == pageAttribute.PageName)?.ID ?? 0;
                                bool hasPermission = await PermissionManagement.HasPagePermission(userID, pageAttribute.PageName, permissionRepo, pageAttribute.ActionType, context.HttpContext.RequestAborted);
                                if (!hasPermission)
                                {
                                    context.Fail("Access Denied");
                                }
                            }
                        

                        #endregion
                    },
                    OnChallenge = context =>
                    {
                        if (context.AuthenticateFailure != null)
                        {
                            throw new AppException(ApiResultStatusCode.UnAuthorized, TranslateMessage(context.AuthenticateFailure.Message), HttpStatusCode.Unauthorized, context.AuthenticateFailure, null);
                        }
                        throw new AppException(ApiResultStatusCode.UnAuthorized, TranslateMessage("You Are Unauthorized To Access This Resource."), HttpStatusCode.Unauthorized);
                    }
                };
            });
        }

        public static void RegisterAllRepositories(this IServiceCollection services, Type RepositoryInterfaceBaseType, Type RepositoryClassBaseType)
        {
            var assembly = RepositoryClassBaseType.Assembly;
            foreach (Type repo in assembly.GetExportedTypes())
            {
                if (repo.IsClass && !repo.IsAbstract && repo.BaseType?.Assembly == RepositoryClassBaseType.Assembly && repo.BaseType.Name == RepositoryClassBaseType.Name && !repo.IsGenericType)
                {
                    Type[]? baseInterfaces = repo.GetInterfaces();
                    if (baseInterfaces?.Length > 0)
                    {
                        Type? baseInterface = baseInterfaces.FirstOrDefault(b => b.GetInterfaces().Any(i => i.Assembly == RepositoryInterfaceBaseType.Assembly && i.Name == RepositoryInterfaceBaseType.Name));
                        if (baseInterface != null)
                        {
                            services.AddScoped(baseInterface, repo);
                        }
                    }
                }
            }
        }

        private static string TranslateMessage(string? message)
        {
            if (string.IsNullOrWhiteSpace(message))
            {
                return "";
            }
            message = message.ToLower() ;
            return message switch
            {
                "access denied" => "دسترسی مجاز نیست.",
                "the requesting user is invalid." => "کاربر درخواست کننده معتبر نیست.",
                "the requesting company's authorization has expired." => "اعتبار شرکت درخواست کننده به پایان رسیده است.",
                "the requesting company is invalid." => "شرکت درخواست کننده معتبر نیستو",
                "this token has no claims." => "توکن ارسالی معتبر نیست.",
                "authentication failed." => "اشکال در احراز هویت",
                "you are unauthorized to access this resource." => "دسترسی مجاز نیست.",
                _ => message,
            };
        }
    }
}
