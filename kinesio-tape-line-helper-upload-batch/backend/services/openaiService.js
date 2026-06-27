const REQUIRED_DISCLAIMER =
  "本系統僅供初步參考，不能取代醫師、物理治療師或防護員的專業判斷。";

function isMockAgentEnabled() {
  return String(process.env.MOCK_AGENT || "").toLowerCase() === "true";
}

function getClient() {
  if (isMockAgentEnabled() || !process.env.OPENAI_API_KEY) {
    return null;
  }

  const OpenAI = require("openai");

  return new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
  });
}

function buildConversationPrompt(userMessage, conversationContext = "") {
  return [
    "以下是使用者最近的對話紀錄，若本次訊息出現「那、這個、剛剛、它、可以嗎」等代詞，請根據上下文理解，但不要憑空補充不存在的內容。",
    "",
    "最近對話：",
    conversationContext || "無",
    "",
    "本次使用者訊息：",
    userMessage
  ].join("\n");
}

async function runOpenAiRequest({
  systemPrompt,
  payload,
  fallbackReply,
  startLog,
  successLog,
  failureLog
}) {
  const client = getClient();
  if (!client) {
    return fallbackReply;
  }

  try {
    console.log(startLog || "正在呼叫 OpenAI API...");
    console.log("OPENAI_MODEL =", process.env.OPENAI_MODEL);

    const response = await client.responses.create({
      model: process.env.OPENAI_MODEL || "gpt-4.1-mini",
      input: [
        {
          role: "system",
          content: systemPrompt
        },
        {
          role: "user",
          content: JSON.stringify(payload)
        }
      ]
    });

    console.log(successLog || "OpenAI API 呼叫成功");

    const outputText = String(response.output_text || "").trim();
    if (!outputText) {
      return fallbackReply;
    }

    return outputText.includes(REQUIRED_DISCLAIMER)
      ? outputText
      : `${outputText}\n\n【提醒】\n${REQUIRED_DISCLAIMER}`;
  } catch (error) {
    console.error(failureLog || "OpenAI API 呼叫失敗", error);
    return fallbackReply;
  }
}

async function generateKinesioReply({
  userMessage,
  conversationContext = "",
  knowledge = [],
  fallbackReply = "",
  topicHint = ""
}) {
  return runOpenAiRequest({
    systemPrompt:
      "你是 LINE 官方帳號中的貼紮教學助理。只能回答白貼、肌貼、貼紮安全提醒、使用方式、皮膚反應、活動建議、影片查詢與相關 FAQ。不可做正式醫療診斷，不可開藥，不可脫離貼紮主題。請使用繁體中文，語氣清楚、保守、簡短，最後附上免責提醒。",
    payload: {
      userMessage: buildConversationPrompt(userMessage, conversationContext),
      topicHint,
      knowledge,
      conversationContext
    },
    fallbackReply,
    startLog: "正在呼叫 OpenAI API：貼紮相關回覆",
    successLog: "OpenAI API 貼紮相關回覆呼叫成功",
    failureLog: "OpenAI API 貼紮相關回覆呼叫失敗"
  });
}

async function generateGeneralReply(
  userMessage,
  conversationContext = "",
  options = {}
) {
  const {
    context = [],
    fallbackReply = "",
    topicHint = "一般聊天"
  } = options;

  return runOpenAiRequest({
    systemPrompt:
      "你是 LINE 官方帳號中的健康安全提醒助理。面對一般聊天時，請用繁體中文簡短、友善回覆。你不是醫師，不要診斷，不要開藥。若使用者提到身體不適但資訊不足，可建議描述更清楚或就醫。若對話跟貼紮系統有關，可以提醒使用者詢問白貼、肌貼、貼紮教學、疼痛部位或安全注意事項。",
    payload: {
      userMessage: buildConversationPrompt(userMessage, conversationContext),
      topicHint,
      context,
      conversationContext
    },
    fallbackReply,
    startLog: "正在呼叫 OpenAI API：一般聊天回覆",
    successLog: "OpenAI API 一般聊天回覆呼叫成功",
    failureLog: "OpenAI API 一般聊天回覆呼叫失敗"
  });
}

async function generateUrgentMedicalAdvice(
  userMessage,
  conversationContext = "",
  options = {}
) {
  const {
    matchedKeywords = [],
    fallbackReply = ""
  } = options;

  return runOpenAiRequest({
    systemPrompt:
      "你是 LINE 官方帳號中的健康安全提醒助理，不是醫師。現在要處理的是高風險症狀。請使用繁體中文、語氣清楚、保守、簡短。你的任務是：1. 明確說明這些情況不適合只靠貼布處理 2. 建議盡快就醫 3. 可提到可能優先考慮的科別 4. 不做正式診斷 5. 不開藥 6. 不提供貼紮教學 7. 最後附上免責提醒。",
    payload: {
      userMessage: buildConversationPrompt(userMessage, conversationContext),
      matchedKeywords,
      conversationContext
    },
    fallbackReply,
    startLog: "正在呼叫 OpenAI API：緊急醫療提醒",
    successLog: "OpenAI API 緊急醫療提醒呼叫成功",
    failureLog: "OpenAI API 緊急醫療提醒呼叫失敗"
  });
}

async function generateNonTapingMedicalAdvice(
  userMessage,
  conversationContext = "",
  fallbackReply = ""
) {
  return runOpenAiRequest({
    systemPrompt:
      "你是 LINE 官方帳號中的健康安全提醒助理，不是醫師。使用者可能描述非白貼、非肌貼適合處理的身體不適。請使用繁體中文，語氣清楚、保守、簡短。你的任務不是診斷，而是：1. 說明這種情況不適合使用白貼或肌貼處理 2. 依照使用者描述建議可能就醫科別 3. 提供等待就醫或觀察時的安全注意事項 4. 提醒何時需要急診 5. 不開藥 6. 不做正式診斷 7. 不提供貼紮教學 8. 不要說『你是某某疾病』 9. 使用『可能』『建議』『若有』等保守說法。回覆格式固定為：【初步提醒】【建議就醫科別】【可以先注意】【何時需要急診】【提醒】。",
    payload: {
      userMessage: buildConversationPrompt(userMessage, conversationContext),
      conversationContext
    },
    fallbackReply,
    startLog: "正在呼叫 OpenAI API：非貼紮醫療建議",
    successLog: "OpenAI API 非貼紮醫療建議呼叫成功",
    failureLog: "OpenAI API 非貼紮醫療建議呼叫失敗"
  });
}

module.exports = {
  generateKinesioReply,
  generateGeneralReply,
  generateUrgentMedicalAdvice,
  generateNonTapingMedicalAdvice,
  isMockAgentEnabled,
  REQUIRED_DISCLAIMER
};
