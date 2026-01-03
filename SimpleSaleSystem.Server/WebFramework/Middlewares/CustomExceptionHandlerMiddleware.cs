using Microsoft.IdentityModel.Tokens;
using Newtonsoft.Json;
using SimpleSaleSystem.Common;
using SimpleSaleSystem.Common.Exceptions;
using SimpleSaleSystem.Common.Utilities;
using SimpleSaleSystem.WebFramework.Api;
using System.Net;
using System.Text.RegularExpressions;

namespace SimpleSaleSystem.WebFramework.Middlewares
{
    public static class CustomExceptionHandlerMiddlewareExtensions
    {
        public static IApplicationBuilder UseCustomExceptionHandler(this IApplicationBuilder builder)
        {
            return builder.UseMiddleware<CustomExceptionHandlerMiddleware>();
        }
    }

    public class CustomExceptionHandlerMiddleware(RequestDelegate next,  IWebHostEnvironment env, ILogger<CustomExceptionHandlerMiddleware> logger)
    {
        private readonly RequestDelegate _next = next;
        private readonly IWebHostEnvironment _env = env;
        private readonly ILogger<CustomExceptionHandlerMiddleware> _logger = logger;

        public async Task Invoke(HttpContext context)
        {
            string? message = null;
            HttpStatusCode httpStatusCode = HttpStatusCode.InternalServerError;
            ApiResultStatusCode apiStatusCode = ApiResultStatusCode.ServerError;

            try
            {
                await _next(context);
            }
            catch (AppException exception)
            {
                _logger.LogError(exception, exception.Message);
                httpStatusCode = exception.HttpStatusCode;
                apiStatusCode = exception.ApiStatusCode;

                if (_env.IsDevelopment())
                {
                    var dic = new Dictionary<string, string>
                    {
                        
                        ["Exception"] = exception.Message,
                        ["StackTrace"] = exception.StackTrace ?? "",
                    };
                    if (exception.InnerException != null)
                    {
                        message = exception.InnerException.Message;
                        dic.Add("InnerException.Exception", message);
                        dic.Add("InnerException.StackTrace", exception.InnerException.StackTrace ?? "");
                    }
                    if (exception.AdditionalData != null)
                        dic.Add("AdditionalData", JsonConvert.SerializeObject(exception.AdditionalData));

                    message = JsonConvert.SerializeObject(dic);
                }
                else
                {
                    message = exception.Message;
                }
                await WriteToResponseAsync();
            }
            catch (SecurityTokenExpiredException exception)
            {
                _logger.LogError(exception, exception.Message);
                SetUnAuthorizeResponse(exception);
                await WriteToResponseAsync();
            }
            catch (UnauthorizedAccessException exception)
            {
                _logger.LogError(exception, exception.Message);
                SetUnAuthorizeResponse(exception);
                await WriteToResponseAsync();
            }
            catch (Exception exception)
            {
                string msg = "";
                Exception tmpEx = exception;
                message = tmpEx.Message;
                while (true)
                {
                    if (!tmpEx.Message.Contains("See the inner exception for details"))
                    {
                        msg += tmpEx.Message;
                    }

                    if (tmpEx.InnerException == null)
                    {
                        break;
                    }

                    tmpEx = tmpEx.InnerException;
                }
                if (exception.StackTrace != null)
                {
                    string[] stackArray = Regex.Split(exception.StackTrace, @"(?= in )");
                    string stackTrace = "";
                    foreach (string item in stackArray)
                    {
                        if (!item.Contains("in") || !item.Contains(" at ") || item.Contains("CustomExceptionHandlerMiddleware"))
                        {
                            continue;
                        }
                        string tmp = item.Split(" at ")[0];
                        if (tmp.Contains('\\'))
                        {
                            string[] tmpArray = tmp.Split("\\");
                            stackTrace += " in " + tmpArray[^1];
                        }
                        else if(tmp.HasValue())
                        {
                            stackTrace += tmp;
                        }
                    }
                    msg += " " + stackTrace;
                }
                _logger.LogError(exception, msg);

                if (_env.IsDevelopment())
                {
                    //var dic = new Dictionary<string, string>
                    //{
                    //    ["Exception"] = exception.Message,
                    //    ["StackTrace"] = exception.StackTrace ?? "",
                    //};
                    message = JsonConvert.SerializeObject(new {Exception = msg});
                    //message = msg;
                }
                await WriteToResponseAsync();
            }

            async Task WriteToResponseAsync()
            {
                if (context.Response.HasStarted)
                    throw new InvalidOperationException("The response has already started, the http status code middleware will not be executed.");

                var result = new ApiResult(false, apiStatusCode, message);
                var json = JsonConvert.SerializeObject(result);

                context.Response.StatusCode = (int)httpStatusCode;
                context.Response.ContentType = "application/json";
                await context.Response.WriteAsync(json);
            }

            void SetUnAuthorizeResponse(Exception exception)
            {
                httpStatusCode = HttpStatusCode.Unauthorized;
                apiStatusCode = ApiResultStatusCode.UnAuthorized;

                if (_env.IsDevelopment())
                {
                    var dic = new Dictionary<string, string>
                    {
                        ["Exception"] = exception.Message,
                        ["StackTrace"] = exception.StackTrace ?? ""
                    };
                    if (exception is SecurityTokenExpiredException tokenException)
                        dic.Add("Expires", tokenException.Expires.ToString());

                    message = JsonConvert.SerializeObject(dic);
                }
            }
        }
    }
}
