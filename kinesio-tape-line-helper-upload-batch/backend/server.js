const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

const consultationRouter = require("./routes/consultation");
const lineWebhookRouter = require("./routes/lineWebhook");
const { tapingKnowledge, categoryOrder } = require("./data/tapingKnowledge");

const app = express();
const port = process.env.PORT || 3000;

app.use(
  cors({
    origin: process.env.FRONTEND_URL ? [process.env.FRONTEND_URL] : "*"
  })
);
app.use(express.json());

app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    message: "Kinesio Tape LINE Helper API is running"
  });
});

app.get("/api/taping-knowledge", (req, res) => {
  const groupedKnowledge = categoryOrder.map((category) => ({
    category,
    items: tapingKnowledge.filter((item) => item.category === category)
  }));

  res.json({
    success: true,
    data: groupedKnowledge
  });
});

app.use("/api/consultation", consultationRouter);
app.use("/api/line/webhook", lineWebhookRouter);

app.use((err, req, res, next) => {
  console.error("Unhandled error:", err);
  res.status(500).json({
    success: false,
    message: "系統發生錯誤，請稍後再試。"
  });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
