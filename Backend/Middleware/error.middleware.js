import dotenv from "dotenv";

dotenv.config();

const notFound = (req, res, next) => {
    const err = new Error (`Not found ${req.originalUrl}`);
    res.sendStatus(404);
    next(err)
}

//custom error handler

  
  export { notFound };