namespace api.DTO.Request
{
    public class RazorPayVerifyRequest
    {
        public string RazorPay_Payment_Id {get; set;} = string.Empty;
        public string Razorpay_Order_Id{get; set;} = string.Empty;
        public string RazorPay_Signature{get; set;} = string.Empty;
    }
}