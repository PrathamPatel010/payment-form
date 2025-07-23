using System.ComponentModel;
using System.ComponentModel.DataAnnotations;

namespace api.DTO.Request
{
    public class CreateOrderReqDto
    {
        [Required]
        public string Name { get; set; } = string.Empty;

        [EmailAddress]
        public string Email { get; set; } = string.Empty;

        [Phone]
        public string Phone { get; set; } = string.Empty;

        [Required]
        public long Amount { get; set; }
        
        [Required]
        public long Tip { get; set; }

        [Required]
        public bool Anonymous { get; set; } = false;

        [Required]
        public string Address { get; set; } = string.Empty;
    }
}
