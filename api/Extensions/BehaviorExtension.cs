using Microsoft.AspNetCore.Mvc;

namespace api.Extensions
{
    public static class BehaviorExtension
    {
        public static void ConfigureApiBehaviorForValidationError(this IServiceCollection services)
        {
            services.Configure<ApiBehaviorOptions>(options =>
            {
                options.InvalidModelStateResponseFactory = context =>
                {
                    var errors = context.ModelState
                        .Where(e => e.Value?.Errors.Count > 0)
                        .SelectMany(x => x.Value!.Errors)
                        .Select(e => e.ErrorMessage)
                        .ToList();

                    var errorResponse = new
                    {
                        messages = errors
                    };

                    return new BadRequestObjectResult(errorResponse);
                };
            });
        }
    }
}