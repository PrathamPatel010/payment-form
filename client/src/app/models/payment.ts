export interface PaymentVerificationReq {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
}
