using Microsoft.AspNetCore.Mvc;

namespace api.Controllers
{
    [Route("razorpay")]
    [ApiController]
    public class RazorpayController(ILogger<RazorpayController> logger) : ControllerBase
    {
        [HttpPost("webhook")]
        public async Task<IActionResult> Webhook()
        {
            // webhook setup, so later if we want we can do some operation, maybe integrate signalR if required
            logger.LogInformation("Razorpay Webhook Response Received");
            var jsonBody = await new StreamReader(Request.Body).ReadToEndAsync();
            logger.LogInformation($"Payload: {jsonBody}");
            return Ok();
        }
    }
}