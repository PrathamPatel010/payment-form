﻿namespace api.DTO.Response
{
    public class RazorPayOrderCreatedRes
    {
        public string Id { get; set; } = string.Empty;
        public long Amount { get; set; }
        public string Currency { get; set; } = string.Empty;
    }
}
