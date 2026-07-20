using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using Ocelot.Cache.CacheManager;
using Ocelot.DependencyInjection;
using Ocelot.Middleware;
using System.Text.Json;

namespace APIGateway
{
    public class Startup
    {
        public IConfiguration Configuration { get; }

        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public void ConfigureServices(IServiceCollection services)
        {
            services.AddCors();
            
            services.AddOcelot(Configuration)
                .AddCacheManager(x =>
                {
                    x.WithDictionaryHandle();
                });
        }

        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }

            // Global Exception Handler
            app.UseExceptionHandler(a => a.Run(async context =>
            {
                var exception = context.Features.Get<Microsoft.AspNetCore.Diagnostics.IExceptionHandlerPathFeature>()?.Error;
                if (exception != null)
                {
                    var logger = context.RequestServices.GetRequiredService<ILogger<Startup>>();
                    logger.LogError(exception.Message);
                    var result = JsonSerializer.Serialize(new { error = exception.Message });

                    context.Response.ContentType = "application/json";
                    await context.Response.WriteAsync(result);
                }
            }));

            // CORS Configuration
            app.UseCors(x => x
                .AllowAnyMethod()
                .AllowAnyHeader()
                .SetIsOriginAllowed(origin => true)
                .AllowCredentials());

            app.UseRouting();

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapGet("/info", async context =>
                {
                    await context.Response.WriteAsync("Ocelot APIGateway for Lab, running on " + context.Request.Host);
                });
            });

            // Ocelot Pipeline
            app.UseOcelot().Wait();
        }
    }
}
