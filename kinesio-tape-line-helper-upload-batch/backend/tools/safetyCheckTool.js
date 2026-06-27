const DANGER_KEYWORDS = [
  "骨折",
  "不能走",
  "無法走",
  "動不了",
  "麻",
  "無力",
  "流血",
  "傷口",
  "變形",
  "劇痛",
  "胸痛",
  "呼吸困難",
  "昏倒",
  "感染",
  "紅腫熱痛很明顯",
  "嚴重紅腫熱痛",
  "明顯紅腫熱痛"
];

const POST_TAPE_URGENT_KEYWORDS = [
  "貼完腳麻",
  "貼完手麻",
  "貼後腳麻",
  "貼後手麻",
  "貼完麻",
  "貼後麻",
  "貼完刺痛",
  "貼後刺痛"
];

function normalizeText(value) {
  return String(value || "").trim();
}

function safetyCheckTool(userMessage) {
  const normalizedMessage = normalizeText(userMessage);

  const matchedPostTapeKeywords = POST_TAPE_URGENT_KEYWORDS.filter((keyword) =>
    normalizedMessage.includes(keyword)
  );

  if (matchedPostTapeKeywords.length > 0) {
    return {
      isSafe: false,
      matchedKeywords: matchedPostTapeKeywords,
      level: "post_tape_urgent",
      shouldRemoveTapeImmediately: true
    };
  }

  const matchedKeywords = DANGER_KEYWORDS.filter((keyword) =>
    normalizedMessage.includes(keyword)
  );

  return {
    isSafe: matchedKeywords.length === 0,
    matchedKeywords,
    level: matchedKeywords.length > 0 ? "urgent_medical" : "safe",
    shouldRemoveTapeImmediately: false
  };
}

module.exports = {
  DANGER_KEYWORDS,
  POST_TAPE_URGENT_KEYWORDS,
  normalizeText,
  safetyCheckTool
};
