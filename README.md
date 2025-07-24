# 🧾 Payment Form with Razorpay Integration

A full-stack application that allows users to make payments using Razorpay.

---

## 🚀 Tech Stack

- **Frontend**: Angular 18
- **Backend**: ASP.NET Core Web API
- **Payment Gateway**: Razorpay
- **Deployment**:

  - Frontend → Vercel
  - Backend → Render

---

## ⚙️ Setup Instructions for Development

---

> ⚠️ **Note:** These instructions are for local development only. For deployment, additional steps are required (like configuring `.env`, updating `build` command in `package.json`, etc.).

---

### 1. Clone the Repository

```bash
git clone https://github.com/PrathamPatel010/payment-form.git
```

---

### 2. Configure Backend

```bash
cd api/
dotnet restore
```

Create a file `appsettings.Development.json`:

```json
{
  "Logging": {
    "LogLevel": {
      "Default": "Information",
      "Microsoft.AspNetCore": "Warning"
    }
  },
  "Secrets": {
    "ApiKeyId": "yourapikeyid",
    "ApiKeySecret": "yourapikeysecret"
  },
  "Cors": {
    "AllowedOrigin": "frontendorigin"
  }
}
```

---

### 3. Run Backend in watch mode

```bash
dotnet watch run
```

---

### 4. Configure Frontend

```bash
cd client/
npm install
```

---

### 5. Run Frontend

```bash
ng serve
```

Frontend runs on: `http://localhost:4200`

---

### 6. Configure environment

Create a new file `environment.development.ts` inside `src/environments`

```typescript
export const environment = {
  API_URL: "http://localhost:5000", // or whatever port your backend runs on
};
```

---

## 📦 API Endpoints

### ✅ `POST /create-order`

Creates a Razorpay order.

#### Request

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "9876543210",
  "amount": 2500,
  "tip": 18,
  "anonymous": false,
  "address": "New Delhi"
}
```

#### Response

```json
{
  "orderId": "order_LKf32Jek3nfseH",
  "amount": 295000,
  "currency": "INR",
  "key": "YOUR_RAZORPAY_KEY_ID",
  "name": "Your Org Name"
}
```

---

### 🔐 `POST /verify-payment`

Verifies Razorpay signature after successful payment.

#### Request

```json
{
  "razorpay_payment_id": "pay_LKf2SDj34k...",
  "razorpay_order_id": "order_LKf32Jek3nf...",
  "razorpay_signature": "3044ba4d..."
}
```

#### Response

```json
200 OK
```

---

### 📬 `POST /webhook`

Razorpay webhook to capture events (e.g., `payment.captured`, `payment.failed`)
Logs event payload to backend logs.

---
