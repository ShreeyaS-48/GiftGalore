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

const app = express();

//json body
app.use(express.json());

//cookie-parser

//cors
app.use(cors(
    {
        origin: [
            "http://localhost:3000",
            "https://giftgalore.netlify.app"
          ],
        credentials: true  
    }
));
app.use(cookieParser())
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
