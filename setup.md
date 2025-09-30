# Setup Guide for Gift Galore

## Prerequisites

- Node.js (>= 18.x)
- npm or yarn
- MongoDB (local or Atlas cluster)
- Python 3.9+ (for ML features)
- Stripe account (for payments)
- Groq API key (for chatbot)
- Cloudinary API key (for images)

## Clone the Repository

```bash
git clone https://github.com/ShreeyaS-48/GiftGalore.git
cd GiftGalore

```

## Backend Setup

```bash
cd Backend
npm install

```

Create a .env file in /Backend with:

```bash

PORT=8000
MONGO_URI=your_mongo_connection_string
ACCESS_TOKEN_SECRET=your_jwt_secret
REFRESH_TOKEN_SECRET=your_refresh_jwt_secret
STRIPE_SECRET_KEY=your_stripe_secret
GROQ_API_KEY=your_groq_key

```

## Run Backend

```bash
npm start

```

### Frontend Setup

```bash
cd ../Frontend
npm install
```

### Run Frontend

```bash
npm start
```

### ML Services

```bash
cd DataJobs
pip install -r requirements.txt
python app.py
```

### Demo Accounts

- Admin login:
  - Username: ABCD
  - Password: abc123ABC
- Test user:
  - Username: Test
  - Password: abc123ABC

### Stripe Test Payments

- Card Number: 5555 5555 5555 4444
- Expiry: Any date in future
- CVC: Any 3 digit number
