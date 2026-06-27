const faqKnowledge = require("../data/faqKnowledge");
const { tapingKnowledge } = require("../data/tapingKnowledge");
const {
  safetyCheckTool,
  normalizeText
} = require("../tools/safetyCheckTool");
const {
  normalizeComparableText,
  buildEmptyReply,
  buildComparisonReply,
  buildLargePartGuideReply,
  buildUrgentReply,
  buildPostTapeUrgentReply,
  buildFaqReply,
  buildKnowledgeReply,
  buildAnkleSprainReply,
  buildNonTapingMedicalFallbackReply,
  buildGeneralChatFallbackReply
} = require("../tools/responseBuilderTool");
const {
  generateKinesioReply,
  generateGeneralReply,
  generateUrgentMedicalAdvice,
  generateNonTapingMedicalAdvice,
  isMockAgentEnabled,
  REQUIRED_DISCLAIMER
} = require("../services/openaiService");
const {
  getRecentMessages,
  buildConversationContext
} = require("../services/conversationMemoryService");

const TAPE_COMPARISON_KEYWORDS = [
  "白貼和肌貼差別",
  "白貼跟肌貼差在哪",
  "白貼肌貼",
  "athletictape",
  "kinesiologytape"
];

const TAPING_TOPIC_KEYWORDS = [
  "白貼",
  "肌貼",
  "貼紮",
  "貼布",
  "腳踝扭到",
  "腳踝扭傷",
  "小腿拉傷",
  "網球肘",
  "下背痛",
  "手指吃蘿蔔",
  "貼後皮膚癢",
  "貼多久",
  "流汗可以繼續貼嗎",
  "膚貼",
  "支撐",
  "穩定",
  "貼很緊",
  "張力"
];

const NON_TAPING_MEDICAL_BODY_PARTS = [
  "雞雞",
  "陰莖",
  "睪丸",
  "尿尿",
  "排尿",
  "肚子",
  "頭",
  "牙",
  "眼睛",
  "耳朵",
  "皮膚",
  "喉嚨",
  "胸口"
];

const NON_TAPING_MEDICAL_SYMPTOMS = [
  "痛",
  "發燒",
  "咳嗽",
  "胸悶",
  "過敏",
  "紅腫",
  "分泌物",
  "腫",
  "灼熱",
  "癢"
];

const GENERAL_CHAT_KEYWORDS = [
  "你好",
  "哈囉",
  "謝謝",
  "你是誰",
  "今天好累",
  "晚餐吃什麼",
  "我想聊天"
];

const SYSTEM_INTRO_KEYWORDS = [
  "你是什麼系統",
  "你是誰",
  "介紹一下",
  "這是什麼",
  "你可以做什麼",
  "叫什麼名字"
];

const LARGE_PART_GUIDES = {
  腿: {
    title: "腿",
    options: [
      "1. 大腿前側：股四頭肌",
      "2. 大腿後側：大腿後側肌群",
      "3. 大腿內側：內收肌",
      "4. 小腿後側：小腿肌群",
      "5. 膝蓋後側：膕肌",
      "6. 膝蓋內側：內側副韌帶、鵝掌肌肌腱",
      "7. 腳踝內側：脛後肌附近",
      "8. 足底或腳跟"
    ],
    examples: ["大腿前側痛", "小腿拉傷", "膝蓋後側痛", "腳踝內側痛", "腳跟痛"]
  },
  手: {
    title: "手",
    options: [
      "1. 手指：手指挫傷、吃蘿蔔",
      "2. 拇指：拇指挫傷或固定",
      "3. 手腕：手腕穩定、腕隧道症候群",
      "4. 前臂：前臂肌肉或網球肘附近"
    ],
    examples: ["手指吃蘿蔔", "拇指挫傷", "手腕痛", "前臂痠痛", "網球肘"]
  },
  背: {
    title: "背",
    options: [
      "1. 下背：下背痛",
      "2. 側腹或核心：腹斜肌",
      "3. 上背肩頸交界：斜方肌、提肩胛肌"
    ],
    examples: ["下背痛", "側腹痛", "肩頸痠痛", "落枕"]
  },
  肩: {
    title: "肩",
    options: [
      "1. 肩膀外側：三角肌",
      "2. 肩關節：肩關節穩定",
      "3. 肩後側或姿勢問題：旋轉肌群、圓肩"
    ],
    examples: ["肩膀痛", "舉手肩膀痛", "肩關節不穩", "圓肩"]
  },
  腳: {
    title: "腳",
    options: [
      "1. 腳踝：扭傷固定或穩定",
      "2. 腳踝內側：脛後肌",
      "3. 足底：足底支撐",
      "4. 腳跟：腳跟痛"
    ],
    examples: ["腳踝扭到", "腳踝內側痛", "足底痛", "腳跟痛"]
  },
  手臂: {
    title: "手臂",
    options: [
      "1. 前臂：前臂肌肉",
      "2. 手肘外側：網球肘",
      "3. 手腕：手腕穩定",
      "4. 肩膀連接處：肩關節穩定或三角肌"
    ],
    examples: ["前臂痠痛", "網球肘", "手腕痛", "肩膀痛"]
  },
  大腿: {
    title: "大腿",
    options: [
      "1. 大腿前側：股四頭肌",
      "2. 大腿後側：大腿後側肌群",
      "3. 大腿內側：內收肌"
    ],
    examples: ["大腿前側痛", "大腿後側拉傷", "大腿內側痛"]
  },
  小腿: {
    title: "小腿",
    options: [
      "1. 小腿後側：小腿肌群",
      "2. 靠近膝蓋後方：膕肌",
      "3. 靠近腳踝內側：脛後肌"
    ],
    examples: ["小腿拉傷", "膝蓋後側痛", "腳踝內側痛"]
  }
};

const CONTEXT_REFERENCE_KEYWORDS = [
  "那",
  "這個",
  "这个",
  "剛剛",
  "刚刚",
  "它",
  "可以嗎",
  "可以吗",
  "多久",
  "會比較",
  "会比较",
  "有用嗎",
  "有用吗"
];

function extractPainLevel(userMessage) {
  const matchedLevel = normalizeText(userMessage).match(/\b(10|[0-9])\b/);
  if (!matchedLevel) {
    return null;
  }

  const painLevel = Number(matchedLevel[1]);
  return Number.isFinite(painLevel) ? painLevel : null;
}

function needsConversationContext(userMessage) {
  const normalized = normalizeText(userMessage);
  if (!normalized) {
    return false;
  }

  return CONTEXT_REFERENCE_KEYWORDS.some((keyword) => normalized.includes(keyword));
}

function getLastUserTopic(recentMessages, currentMessage) {
  if (!Array.isArray(recentMessages) || recentMessages.length === 0) {
    return "";
  }

  const normalizedCurrentMessage = normalizeText(currentMessage);

  for (let index = recentMessages.length - 1; index >= 0; index -= 1) {
    const candidate = normalizeText(recentMessages[index]?.user_message);
    if (!candidate || candidate === normalizedCurrentMessage) {
      continue;
    }

    return candidate;
  }

  return "";
}

function buildRoutingMessage(normalizedMessage, recentMessages) {
  if (!needsConversationContext(normalizedMessage)) {
    return normalizedMessage;
  }

  const lastUserTopic = getLastUserTopic(recentMessages, normalizedMessage);
  if (!lastUserTopic) {
    return normalizedMessage;
  }

  return `${lastUserTopic}。${normalizedMessage}`;
}

function isTapeComparisonQuery(userMessage) {
  const compactMessage = normalizeComparableText(userMessage);
  return (
    compactMessage === "白貼" ||
    compactMessage === "肌貼" ||
    TAPE_COMPARISON_KEYWORDS.some((keyword) =>
      compactMessage.includes(normalizeComparableText(keyword))
    ) ||
    (compactMessage.includes("白貼") && compactMessage.includes("肌貼"))
  );
}

function getLargePartGuide(userMessage) {
  return LARGE_PART_GUIDES[normalizeText(userMessage)] || null;
}

function isAnkleSprainQuery(userMessage) {
  const compactMessage = normalizeComparableText(userMessage);
  return (
    compactMessage.includes("腳踝扭到") ||
    compactMessage.includes("腳踝扭傷") ||
    compactMessage.includes("扭到腳踝")
  );
}

function scoreKnowledgeItem(userMessage, item) {
  const compactMessage = normalizeComparableText(userMessage);
  const candidates = [
    item.title,
    item.subPart,
    item.tapingType,
    item.purpose,
    item.description,
    ...(Array.isArray(item.keywords) ? item.keywords : [])
  ]
    .filter(Boolean)
    .map((value) => normalizeComparableText(value));

  return candidates.reduce((score, keyword) => {
    if (!keyword) {
      return score;
    }
    if (compactMessage === keyword) {
      return score + 10;
    }
    if (compactMessage.includes(keyword)) {
      return score + 6;
    }
    if (keyword.includes(compactMessage)) {
      return score + 3;
    }
    return score;
  }, 0);
}

function searchTapingKnowledge(userMessage, limit = 3) {
  return tapingKnowledge
    .map((item) => ({
      ...item,
      similarity: scoreKnowledgeItem(userMessage, item)
    }))
    .filter((item) => item.similarity > 0)
    .sort((a, b) => b.similarity - a.similarity)
    .slice(0, limit);
}

function searchFaqKnowledge(userMessage) {
  const compactMessage = normalizeComparableText(userMessage);

  const scored = faqKnowledge
    .map((item) => {
      const score = (item.keywords || []).reduce((total, keyword) => {
        const compactKeyword = normalizeComparableText(keyword);
        if (compactMessage === compactKeyword) {
          return total + 10;
        }
        if (
          compactMessage.includes(compactKeyword) ||
          compactKeyword.includes(compactMessage)
        ) {
          return total + 6;
        }
        return total;
      }, 0);

      return { item, score };
    })
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score);

  return scored[0]?.item || null;
}

function isTapingRelated(userMessage, faqItem, matchedKnowledge) {
  const compactMessage = normalizeComparableText(userMessage);
  if (faqItem || matchedKnowledge.length > 0) {
    return true;
  }
  return TAPING_TOPIC_KEYWORDS.some((keyword) =>
    compactMessage.includes(normalizeComparableText(keyword))
  );
}

function isNonTapingMedicalProblem(userMessage) {
  const compactMessage = normalizeComparableText(userMessage);
  const hasBodyPart = NON_TAPING_MEDICAL_BODY_PARTS.some((keyword) =>
    compactMessage.includes(normalizeComparableText(keyword))
  );
  const hasSymptom = NON_TAPING_MEDICAL_SYMPTOMS.some((keyword) =>
    compactMessage.includes(normalizeComparableText(keyword))
  );
  return hasBodyPart || hasSymptom;
}

function isGeneralChat(userMessage) {
  const compactMessage = normalizeComparableText(userMessage);
  return GENERAL_CHAT_KEYWORDS.some((keyword) =>
    compactMessage.includes(normalizeComparableText(keyword))
  );
}

function isSystemIntroQuery(userMessage) {
  const compactMessage = normalizeComparableText(userMessage);
  return SYSTEM_INTRO_KEYWORDS.some((keyword) =>
    compactMessage.includes(normalizeComparableText(keyword))
  );
}

function buildSystemIntroReply({ painLevel, safetyResult }) {
  return {
    replyText: [
      "我是「貼得好輔助系統」的 LINE 小助手。",
      "",
      "本系統主要提供白貼、肌貼與貼紮教學的初步參考，協助你查詢：",
      "",
      "・白貼與肌貼的差別",
      "・常見部位貼紮教學",
      "・腳踝扭傷、手指吃蘿蔔、小腿拉傷、網球肘、下背痛等貼紮影片",
      "・貼布使用注意事項",
      "・貼後皮膚癢、紅疹、不舒服等狀況提醒",
      "・非貼紮適用情況的建議就醫科別",
      "",
      "你可以直接輸入：",
      "「白貼和肌貼差別」",
      "「腳踝扭到」",
      "「小腿拉傷」",
      "「手指吃蘿蔔」",
      "「貼後皮膚癢」",
      "「肌貼可以貼多久」",
      "",
      "提醒：",
      "本系統僅供貼紮教學與初步參考，不能取代醫師、物理治療師或防護員的專業判斷。"
    ].join("\n"),
    metadata: {
      resultType: "system_intro",
      canUseTape: false,
      painArea: null,
      painLevel,
      suggestion: "提供系統介紹",
      tapeMethod: null,
      warning: REQUIRED_DISCLAIMER,
      recommendedDepartment: null,
      videoUrl: null,
      ragResults: [],
      safetyResult
    }
  };
}

async function buildTapingRelatedReply({
  normalizedMessage,
  conversationContext = "",
  painLevel,
  faqItem,
  matchedKnowledge,
  safetyResult
}) {
  if (!isMockAgentEnabled() && matchedKnowledge.length > 0 && !faqItem) {
    return buildKnowledgeReply(matchedKnowledge[0], matchedKnowledge);
  }

  if (isMockAgentEnabled()) {
    if (faqItem) {
      return buildFaqReply(faqItem);
    }

    if (matchedKnowledge.length > 0) {
      return buildKnowledgeReply(matchedKnowledge[0], matchedKnowledge);
    }

    return {
      replyText: buildGeneralChatFallbackReply(),
      metadata: {
        resultType: "taping_related",
        canUseTape: false,
        painArea: null,
        painLevel,
        suggestion: "提供貼紮相關保守回覆",
        tapeMethod: null,
        warning: REQUIRED_DISCLAIMER,
        recommendedDepartment: "若症狀持續或加劇，請就醫或詢問專業人員",
        videoUrl: null,
        ragResults: [],
        safetyResult
      }
    };
  }

  const fallbackReply = faqItem
    ? faqItem.replyText
    : matchedKnowledge.length > 0
      ? buildKnowledgeReply(matchedKnowledge[0], matchedKnowledge).replyText
      : buildGeneralChatFallbackReply();

  const replyText = await generateKinesioReply({
    userMessage: normalizedMessage,
    conversationContext,
    knowledge: [...matchedKnowledge, ...(faqItem ? [faqItem] : [])],
    topicHint: "貼紮相關問題",
    fallbackReply
  });

  return {
    replyText,
    metadata: {
      resultType: "taping_related",
      canUseTape: matchedKnowledge.length > 0,
      painArea: matchedKnowledge[0]?.subPart || null,
      painLevel,
      suggestion: faqItem?.title || matchedKnowledge[0]?.purpose || "提供貼紮相關說明",
      tapeMethod: matchedKnowledge[0]?.tapingType || null,
      warning: REQUIRED_DISCLAIMER,
      recommendedDepartment: "若症狀持續或加劇，請就醫或詢問專業人員",
      videoUrl: matchedKnowledge[0]?.videoUrl || null,
      ragResults: matchedKnowledge,
      safetyResult
    }
  };
}

async function buildUrgentMedicalReply({
  normalizedMessage,
  conversationContext = "",
  safetyResult
}) {
  const fixedReply = buildUrgentReply(
    safetyResult.matchedKeywords,
    safetyResult
  );

  if (isMockAgentEnabled()) {
    return fixedReply;
  }

  const replyText = await generateUrgentMedicalAdvice(
    normalizedMessage,
    conversationContext,
    {
      matchedKeywords: safetyResult.matchedKeywords,
      fallbackReply: fixedReply.replyText
    }
  );

  return {
    replyText,
    metadata: fixedReply.metadata
  };
}

async function buildNonTapingMedicalReply({
  normalizedMessage,
  conversationContext = "",
  painLevel,
  safetyResult
}) {
  const fallbackReply = buildNonTapingMedicalFallbackReply();

  if (isMockAgentEnabled()) {
    return {
      replyText: fallbackReply,
      metadata: {
        resultType: "non_taping_medical",
        canUseTape: false,
        painArea: null,
        painLevel,
        suggestion: "這不是白貼或肌貼適合處理的範圍",
        tapeMethod: null,
        warning: REQUIRED_DISCLAIMER,
        recommendedDepartment: "建議依症狀考慮家醫科、內科或相關專科",
        videoUrl: null,
        ragResults: [],
        safetyResult
      }
    };
  }

  const replyText = await generateNonTapingMedicalAdvice(
    normalizedMessage,
    conversationContext,
    fallbackReply
  );

  return {
    replyText,
    metadata: {
      resultType: "non_taping_medical",
      canUseTape: false,
      painArea: null,
      painLevel,
      suggestion: "提供非貼紮醫療初步提醒",
      tapeMethod: null,
      warning: REQUIRED_DISCLAIMER,
      recommendedDepartment: "建議依症狀考慮家醫科、內科或相關專科",
      videoUrl: null,
      ragResults: [],
      safetyResult
    }
  };
}

async function buildGeneralChatReply({
  normalizedMessage,
  conversationContext = "",
  painLevel,
  safetyResult
}) {
  const fallbackReply = buildGeneralChatFallbackReply();

  if (isMockAgentEnabled()) {
    return {
      replyText: fallbackReply,
      metadata: {
        resultType: "general_chat",
        canUseTape: false,
        painArea: null,
        painLevel,
        suggestion: "一般聊天回覆",
        tapeMethod: null,
        warning: REQUIRED_DISCLAIMER,
        recommendedDepartment: null,
        videoUrl: null,
        ragResults: [],
        safetyResult
      }
    };
  }

  const replyText = await generateGeneralReply(normalizedMessage, conversationContext, {
    fallbackReply,
    topicHint: "一般聊天"
  });

  return {
    replyText,
    metadata: {
      resultType: "general_chat",
      canUseTape: false,
      painArea: null,
      painLevel,
      suggestion: "一般聊天回覆",
      tapeMethod: null,
      warning: REQUIRED_DISCLAIMER,
      recommendedDepartment: null,
      videoUrl: null,
      ragResults: [],
      safetyResult
    }
  };
}

async function handleKinesioTapeMessage(input) {
  const request =
    typeof input === "string"
      ? { userMessage: input, lineUserId: "", displayName: "" }
      : input || {};

  const userMessage = request.userMessage || "";
  const lineUserId = request.lineUserId || "";
  const normalizedMessage = normalizeText(userMessage);
  const painLevel = extractPainLevel(normalizedMessage);

  if (!normalizedMessage) {
    return buildEmptyReply(painLevel);
  }

  const recentMessages = await getRecentMessages(lineUserId, 6);
  const conversationContext = buildConversationContext(recentMessages);
  const routingMessage = buildRoutingMessage(normalizedMessage, recentMessages);

  const safetyResult = safetyCheckTool(normalizedMessage);

  if (safetyResult.level === "post_tape_urgent") {
    return buildPostTapeUrgentReply(safetyResult.matchedKeywords, safetyResult);
  }

  if (safetyResult.level === "urgent_medical") {
    return buildUrgentMedicalReply({
      normalizedMessage,
      conversationContext,
      safetyResult
    });
  }

  if (isTapeComparisonQuery(normalizedMessage)) {
    return buildComparisonReply();
  }

  const largePartGuide = getLargePartGuide(normalizedMessage);
  if (largePartGuide) {
    return buildLargePartGuideReply(largePartGuide);
  }

  if (isAnkleSprainQuery(routingMessage)) {
    const ankleItem = tapingKnowledge.find(
      (item) => item.id === "white-ankle-sprain-fixation"
    );
    return buildAnkleSprainReply(ankleItem);
  }

  const faqItem = searchFaqKnowledge(routingMessage);
  const matchedKnowledge = searchTapingKnowledge(routingMessage, 3);

  if (isTapingRelated(routingMessage, faqItem, matchedKnowledge)) {
    return buildTapingRelatedReply({
      normalizedMessage,
      conversationContext,
      painLevel,
      faqItem,
      matchedKnowledge,
      safetyResult
    });
  }

  if (isSystemIntroQuery(normalizedMessage)) {
    return buildSystemIntroReply({
      painLevel,
      safetyResult
    });
  }

  if (isNonTapingMedicalProblem(normalizedMessage)) {
    return buildNonTapingMedicalReply({
      normalizedMessage,
      conversationContext,
      painLevel,
      safetyResult
    });
  }

  return buildGeneralChatReply({
    normalizedMessage,
    conversationContext,
    painLevel,
    safetyResult
  });
}

module.exports = {
  handleKinesioTapeMessage,
  safetyCheckTool
};
