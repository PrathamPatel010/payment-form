using api.DTO.Request;
using Microsoft.AspNetCore.Mvc;
using System.Text.Json;
using System.Net.Http.Headers;
using System.Text;
using api.Constants;
using api.DTO.Response;

namespace api.Controllers
{
    [Route("create-order")]
    [ApiController]
    public class OrderController(IHttpClientFactory httpClientFactory, IConfiguration configuration) : ControllerBase
    {
        public const string RAZORPAY_ORDER_API_URL = "https://api.razorpay.com/v1/orders";
        
        [HttpPost]
        public async Task<ActionResult> CreateOrder(CreateOrderReqDto createOrderReq)
        {
            var amount = createOrderReq.Amount + createOrderReq.Tip;
            var currency = "INR"; // Assuming INR for simplicity

            var apiKeyId = configuration[AppSettings.RazorPayApiKeyId];
            var apiKeySecret = configuration[AppSettings.RazorPayApiKeySecret];

            var client = httpClientFactory.CreateClient();

            var authBytes = Encoding.UTF8.GetBytes($"{apiKeyId}:{apiKeySecret}");
            client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Basic", Convert.ToBase64String(authBytes));

            var orderPayload = new
            {
                amount = (int)(createOrderReq.Amount + createOrderReq.Tip),
                currency
            };

            var response = await client.PostAsync(
                RAZORPAY_ORDER_API_URL,
                new StringContent(JsonSerializer.Serialize(orderPayload), Encoding.UTF8, ResponseTypes.Json)
            );

            if (!response.IsSuccessStatusCode)
            {
                var error = await response.Content.ReadAsStringAsync();
                return StatusCode((int)response.StatusCode, error);
            }

            var content = await response.Content.ReadAsStringAsync();
            var json = JsonSerializer.Deserialize<RazorPayOrderCreatedRes>(content,new JsonSerializerOptions
            {
                PropertyNameCaseInsensitive=true,
            });
            var resJson = new CreateOrderResDto
            {
                OrderId = json!.Id ?? string.Empty,
                Amount = createOrderReq.Amount,
                Currency = currency,
                Key = apiKeyId!,
                Name = createOrderReq.Name
            };
            return Ok(resJson);
        }
    }
}
