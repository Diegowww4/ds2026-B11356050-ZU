const dotenv = require("dotenv");

dotenv.config();

const channelAccessToken = process.env.LINE_CHANNEL_ACCESS_TOKEN;
const frontendUrl =
  process.env.FRONTEND_URL || "https://diegowww4.github.io/KinesioTape/";

const websiteFooter = [
  "",
  "也可以透過下方網頁填表查相關內容：",
  frontendUrl
].join("\n");

function formatLineReplyText(input) {
  const text = String(input || "").trim();
  if (!text) {
    return "";
  }

  if (text.includes(frontendUrl)) {
    return text;
  }

  return `${text}\n${websiteFooter}`.trim();
}

function toTextMessages(input) {
  const values = Array.isArray(input) ? input : [input];

  return values
    .map((value) => formatLineReplyText(value))
    .filter(Boolean)
    .slice(0, 5)
    .map((text) => ({
      type: "text",
      text
    }));
}

async function sendLineRequest(endpoint, payload) {
  if (!channelAccessToken) {
    console.warn("LINE_CHANNEL_ACCESS_TOKEN is not set. Skip LINE API request.");
    return;
  }

  const response = await fetch(`https://api.line.me/v2/bot/message/${endpoint}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${channelAccessToken}`
    },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`LINE API error: ${response.status} ${errorText}`);
  }
}

async function replyMessage(replyToken, input) {
  if (!replyToken) {
    return;
  }

  const messages = toTextMessages(input);
  if (messages.length === 0) {
    return;
  }

  await sendLineRequest("reply", {
    replyToken,
    messages
  });
}

async function pushMessage(userId, input) {
  if (!userId) {
    return;
  }

  const messages = toTextMessages(input);
  if (messages.length === 0) {
    return;
  }

  await sendLineRequest("push", {
    to: userId,
    messages
  });
}

function generateLineReply(userMessage) {
  const text = String(userMessage || "").trim();
  const lowerText = text.toLowerCase();

  let shortHint =
    "可以直接告訴我你的疼痛部位、症狀或想查的貼紮主題，我會先提供基本方向與風險提醒。";

  if (text.includes("膝") || lowerText.includes("knee")) {
    shortHint =
      "如果是膝蓋不適，建議先分清楚是扭傷、拉傷、還是不穩，再看對應的貼紮教學與注意事項。";
  } else if (text.includes("腳踝") || text.includes("扭傷")) {
    shortHint =
      "腳踝扭傷時，若已經無法走路、腫脹明顯或懷疑骨折，就不要先靠貼紮處理，應先就醫。";
  } else if (text.includes("腰") || text.includes("下背")) {
    shortHint =
      "下背不適常見於久坐、姿勢不良或肌肉緊繃，但如果合併腿麻、無力或劇痛，請先就醫。";
  } else if (text.includes("肌貼") || text.includes("白貼")) {
    shortHint =
      "肌貼偏向輔助與動作提醒，白貼偏向固定；先分清楚你的狀況，再選擇合適的貼布類型。";
  }

  return [
    "這裡是肌貼與白貼教學助手。",
    "",
    shortHint,
    "",
    "也可以透過下方網頁填表查相關內容：",
    frontendUrl,
    "",
    "提醒：本系統僅供貼紮教學與初步參考，不能取代正式醫療判斷。"
  ].join("\n");
}

module.exports = {
  replyMessage,
  pushMessage,
  generateLineReply,
  formatLineReplyText
};
