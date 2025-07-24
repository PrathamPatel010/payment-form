using api.DTO.Request;
using Microsoft.AspNetCore.Mvc;
using System.Text.Json;
using System.Net.Http.Headers;
using System.Text;
using api.Constants;
using api.DTO.Response;
using System.Security.Cryptography;

namespace api.Controllers
{
    [ApiController]
    public class OrderController(IHttpClientFactory httpClientFactory, IConfiguration configuration) : ControllerBase
    {
        public const string RAZORPAY_ORDER_API_URL = "https://api.razorpay.com/v1/orders";
        [HttpPost("create-order")]
        public async Task<IActionResult> CreateOrder(CreateOrderReqDto createOrderReq)
        {
            var currency = "INR"; // Assuming INR for simplicity

            var apiKeyId = configuration[AppSettings.RazorPayApiKeyId];
            var apiKeySecret = configuration[AppSettings.RazorPayApiKeySecret];

            var client = httpClientFactory.CreateClient();

            var authBytes = Encoding.UTF8.GetBytes($"{apiKeyId}:{apiKeySecret}");
            client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Basic", Convert.ToBase64String(authBytes));

            var baseAmount = createOrderReq.Amount;
            var tipAmount = Math.Round(baseAmount * (createOrderReq.Tip / 100.0),MidpointRounding.AwayFromZero);
            var totalPayable = baseAmount + tipAmount;

            var orderPayload = new
            {
                amount = (int)(totalPayable * 100), // Razorpay needs paise
                currency = "INR"
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
                Amount = (int)Math.Round(totalPayable * 100,MidpointRounding.AwayFromZero),
                Currency = currency,
                Key = apiKeyId!,
                Name = "Pratham Patel"
            };
            return Ok(resJson);
        }

        [HttpPost("verify-payment")]
        public IActionResult VerifyPayment(RazorPayVerifyRequest req)
        {
            string payload = $"{req.Razorpay_Order_Id}|{req.RazorPay_Payment_Id}";
            string secret = configuration[AppSettings.RazorPayApiKeySecret]!;

            using var hmac = new HMACSHA256(Encoding.UTF8.GetBytes(secret));
            var hash = Convert.ToHexString(hmac.ComputeHash(Encoding.UTF8.GetBytes(payload))).ToLower();

            if (string.Equals(hash, req.RazorPay_Signature, StringComparison.OrdinalIgnoreCase))
            {
                return Ok();
            }
            return BadRequest("Invalid signature");
        }
    }
}
