# Gift Galore

MERN-based ML-Enhanced E-Commerce Platform for Gifting Products

## Overview

Gift Galore is a **full-stack e-commerce platform** built with the **MERN stack**, designed for a personalized and seamless gifting experience. The platform integrates **machine learning** and **AI-powered features** to enhance user experience, optimize business insights, and provide intelligent product recommendations.

This project is developed to showcase how **cutting-edge technology** can transform traditional e-commerce into an **intelligent, user-focused marketplace**.

## Features

### Core E-Commerce Features

- Category-wise product browsing (Cakes, Chocolates, Bouquets, Plants, Combos).
- Role-based access for **admins** and **users**.
- Secure **JWT-based authentication & authorization**.
- Cart management with dynamic total calculations.
- Order tracking with status updates.
- Automated **email notifications** (via Node Cron).
- **Stripe integration** for secure payments.

### AI & ML Enhancements

- **AI Chatbot** (Groq’s LLaMA 3) for personalized customer support.
- **Market Basket Analysis (Apriori)** to recommend frequently bought-together items.
- **Sentiment analysis** on product reviews to summarize customer feedback.
- **Sales analytics dashboard**:

  - Daily, monthly, yearly sales trends.
  - Category wise sales distribution.
  - Revenue growth charts.
  - Order status distribution (pie chart).
  - Average order value tracking.

### UI/UX

- Responsive, mobile-first design.
- Modern and intuitive user interface.
- Best-seller tags based on product performance.

## Tech Stack

- **Frontend:** React.js, CSS, HTML5
- **Backend:** Node.js, Express.js
- **Database:** MongoDB , Mongoose models
- **Authentication:** JSON Web Tokens (JWT)
- **Payments:** Stripe API
- **Machine Learning:** Python
- **Chatbot:** Groq’s LLaMA 3 integrated with Node backend
- **Other:** Node-Cron for scheduled tasks

## Screenshots

### Home Page

![Home Page](Screenshots/HomePage.png)

### Login

![Sign In](Screenshots/SignIn.png)

### Browsing

![Browsing](Screenshots/Browsing.png)

### Shopping Cart

![Cart](Screenshots/Cart.png)

### Payment

![Payment](Screenshots/Payment.png)

### Order Tracking

![Order Tracking](<Screenshots/Order Tracking.png>)

### Admin Dashboard

![Admin Dashboard](<Screenshots/Admin Dashboard.png>)

### Order Analytics

![Order Analytics](<Screenshots/Order Analytics.png>)

### Market Basket Analysis

![Market Basket Analysis](<Screenshots/Market Basket Analysis.png>)

### Chat Bot

![ChatBot](Screenshots/ChatBot.png)

## Demo

### Demo Video

- **Link to Demo:** (https://www.youtube.com/watch?v=Pyq0wUSaLoE)

### Live Deployment

- **Frontend:** Netlify
- **Backend:** Render
- **Link to Website:** (https://giftgalore.netlify.app/)

### Demo accounts

- Admin login:
  - Username: ABCD
  - Password: abc123ABC
- Test user:
  - Username: ABCDE
  - Password: abc123ABC

### Stripe Test Payments

- Card Number: 5555 5555 5555 5555
- Expiry: Any date in future
- CVC: Any 3 digit number
