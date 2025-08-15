import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { notFound } from "./Middleware/error.middleware.js";
import registerRouter from "./routes/register.js"; 
import loginRouter from "./routes/auth.js"; 
import refreshRouter from "./routes/refresh.js"; 
import logoutRouter from "./routes/logout.js"
import verifyJWT from "./Middleware/verifyJWT.js";
import usersApiRouter from "./routes/api/users.js";
import productsApiRouter from "./routes/api/products.js";
import cartApiRouter from "./routes/api/cart.js";
import orderApiRouter from "./routes/api/orders.js";
import chatApiRouter from "./routes/api/chat.js";
const allowedOrigins = [
    "http://localhost:3000",
    "https://giftgalore.netlify.app",
]

const app = express();

//json body
app.use(express.json())
app.use(express.urlencoded({ extended: true }));;

//cookie-parser
app.use(cookieParser())
//cors

app.use(cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (like mobile apps or curl requests)
      if (!origin) return callback(null, true);
  
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      } else {
        return callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
    allowedHeaders: ["Content-Type","Authorization"],
    methods: ["GET","POST","PUT","PATCH","DELETE","OPTIONS"]
  }));
//routes
app.use('/register', registerRouter);
app.use('/auth', loginRouter);
app.use('/refresh', refreshRouter);
app.use('/products', productsApiRouter);
app.use("/chat", chatApiRouter);

app.use(verifyJWT) // below routes are verified
app.use('/logout', logoutRouter);
app.use('/cart', cartApiRouter);
app.use('/orders', orderApiRouter);
app.use('/admin', usersApiRouter);


//error handler middleware
app.use(notFound);

export default app;
