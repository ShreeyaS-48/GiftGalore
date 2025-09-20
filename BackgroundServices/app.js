import express from "express";
import cron from "node-cron";
import sendWelcomeEmail from "./EmailServices/sendWelcomeEmail.js";

const app = express();

const services = () => {
  cron.schedule("* * * * * *", () => {
    sendWelcomeEmail();
  });
};
services();
export default app;
