using Microsoft.AspNetCore.Mvc;

namespace api.Controllers
{
    [Route("")]
    [ApiController]
    public class TestController : ControllerBase
    {
        [HttpGet]
        public ActionResult ReturnOk()
        {
            return Ok("API is running");
        }
    }
}