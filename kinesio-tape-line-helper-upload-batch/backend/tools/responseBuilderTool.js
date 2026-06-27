const { REQUIRED_DISCLAIMER } = require("../services/openaiService");

function normalizeComparableText(value) {
  return String(value || "").trim().toLowerCase().replace(/\s+/g, "");
}

function buildAnalysisResult({
  resultType,
  canUseTape,
  painArea = null,
  painLevel = null,
  suggestion = null,
  tapeMethod = null,
  warning = null,
  recommendedDepartment = null,
  videoUrl = null,
  ragResults = [],
  safetyResult = { isSafe: true, matchedKeywords: [], level: "safe" },
  replyText
}) {
  return {
    replyText,
    metadata: {
      resultType,
      canUseTape,
      painArea,
      painLevel,
      suggestion,
      tapeMethod,
      warning,
      recommendedDepartment,
      videoUrl,
      ragResults,
      safetyResult
    }
  };
}

function buildEmptyReply(painLevel) {
  return buildAnalysisResult({
    resultType: "empty_message",
    canUseTape: false,
    painLevel,
    suggestion: "請輸入想查詢的部位與症狀",
    warning: REQUIRED_DISCLAIMER,
    recommendedDepartment: "請先補充更明確的部位描述",
    replyText: [
      "請先輸入想查詢的部位與症狀，例如：",
      "「腳踝扭到」",
      "「小腿拉傷」",
      "「網球肘」",
      "「下背痛」",
      "",
      `提醒：${REQUIRED_DISCLAIMER}`
    ].join("\n")
  });
}

function buildComparisonReply() {
  return buildAnalysisResult({
    resultType: "tape_comparison",
    canUseTape: false,
    suggestion: "提供白貼與肌貼差異說明",
    warning: REQUIRED_DISCLAIMER,
    replyText: [
      "白貼與肌貼都屬於物理性輔助貼紮，本身不含藥物。",
      "",
      "【白貼】",
      "主要用於短時間固定、限制活動、保護關節與減少二次傷害。",
      "常用於腳踝扭傷、手腕穩定、手指挫傷等。",
      "通常需要搭配膚貼使用，不建議久貼，約 1～3 小時為主。",
      "若疼痛嚴重、明顯腫脹、無法活動或疑似骨折，請不要只依靠白貼，應尋求專業醫療協助。",
      "",
      "【肌貼】",
      "主要用於輔助肌肉活動、提供輕度支撐、穩定、防護、放鬆與姿勢提醒。",
      "常用於肌肉痠痛、輕微拉傷、瘀青引流、水腫輔助、肩頸痠痛、下背痛等。",
      "不建議長時間久貼，若大量流汗或皮膚不適，應盡快拆除。",
      "如果貼後出現紅疹、搔癢、刺痛或灼熱感，請立即停止使用。",
      "",
      "提醒：",
      REQUIRED_DISCLAIMER
    ].join("\n")
  });
}

function buildLargePartGuideReply(guide) {
  return buildAnalysisResult({
    resultType: "large_part_guidance",
    canUseTape: false,
    painArea: guide.title,
    suggestion: "請補充更精準的位置",
    warning: "若疼痛嚴重、無法行走、麻木、疑似骨折或有傷口，請立即就醫。",
    recommendedDepartment: "請先補充更明確的部位與症狀",
    replyText: [
      `你輸入的是大部位「${guide.title}」，請再選擇更精準的位置，這樣系統才能提供較接近的貼紮教學。`,
      "",
      `${guide.title}部可能包含：`,
      ...guide.options,
      "",
      "你可以改成輸入：",
      ...guide.examples.map((example) => `「${example}」`),
      "",
      "若疼痛嚴重、無法行走、麻木、疑似骨折或有傷口，請立即就醫。"
    ].join("\n")
  });
}

function buildUrgentReply(matchedKeywords, safetyResult) {
  return buildAnalysisResult({
    resultType: "urgent_medical",
    canUseTape: false,
    suggestion: "請優先就醫評估",
    warning: "你描述的內容涉及需要優先排除的危險訊號，請先就醫，不建議只依靠貼布處理。",
    recommendedDepartment: "骨科、復健科、急診或其他合適醫療單位",
    safetyResult,
    replyText: [
      `你提到的症狀包含：${matchedKeywords.join("、")}。`,
      "這些情況不適合先提供貼紮教學，建議盡快到骨科、復健科、急診或其他合適醫療單位評估。",
      "若有無法承重、明顯變形、持續流血、胸痛、呼吸困難或昏倒，請立即就醫。",
      "",
      `提醒：${REQUIRED_DISCLAIMER}`
    ].join("\n")
  });
}

function buildPostTapeUrgentReply(matchedKeywords, safetyResult) {
  return buildAnalysisResult({
    resultType: "post_tape_urgent",
    canUseTape: false,
    suggestion: "請立即拆除貼布並評估是否就醫",
    warning: "貼完出現麻木、刺痛或異常感時，不建議繼續貼著活動。",
    recommendedDepartment: "骨科、復健科或其他合適醫療單位",
    safetyResult,
    replyText: [
      `你提到的情況包含：${matchedKeywords.join("、")}。`,
      "如果貼完後出現腳麻、手麻、明顯刺痛、無力或動作不自然，建議立即拆除貼布。",
      "這可能代表貼布太緊、貼法不適合，或已經影響到局部循環與神經感覺。",
      "若拆除後仍持續麻木、疼痛加劇、無力或活動受限，請盡快就醫或諮詢專業人員。",
      "",
      `提醒：${REQUIRED_DISCLAIMER}`
    ].join("\n")
  });
}

function buildFaqReply(faqItem) {
  return buildAnalysisResult({
    resultType: "faq_knowledge",
    canUseTape: false,
    suggestion: faqItem.title,
    warning: REQUIRED_DISCLAIMER,
    recommendedDepartment: "若症狀持續或加劇，請就醫或詢問專業人員",
    replyText: faqItem.replyText
  });
}

function buildKnowledgeReply(item, relatedItems) {
  const extraVideos = relatedItems
    .filter((relatedItem) => relatedItem.id !== item.id)
    .slice(0, 2)
    .map(
      (relatedItem) =>
        `- ${relatedItem.title}（${relatedItem.tapingType}）：${relatedItem.videoUrl}`
    );

  const replyLines = [
    `【${item.title}】`,
    "",
    `類型：${item.tapingType}`,
    `部位：${item.subPart}`,
    `用途：${item.purpose}`,
    "",
    "簡要說明：",
    item.description,
    "",
    "影片教學：",
    item.videoUrl
  ];

  if (extraVideos.length > 0) {
    replyLines.push("", "補充參考：", ...extraVideos);
  }

  replyLines.push(
    "",
    "提醒：",
    "本系統僅供貼紮教學與初步參考，不能取代醫師、物理治療師或防護員的專業判斷。若疼痛持續加劇、明顯腫脹、麻木無力或懷疑嚴重受傷，請盡快就醫。"
  );

  return buildAnalysisResult({
    resultType: "tape_knowledge",
    canUseTape: true,
    painArea: item.subPart,
    suggestion: item.purpose,
    tapeMethod: item.tapingType,
    warning:
      "若疼痛持續加劇、明顯腫脹、麻木無力或懷疑嚴重受傷，請盡快就醫。",
    recommendedDepartment: "若症狀持續或加劇，請到骨科或復健科評估",
    videoUrl: item.videoUrl,
    ragResults: relatedItems,
    replyText: replyLines.join("\n")
  });
}

function buildAnkleSprainReply(matchedItem) {
  return buildAnalysisResult({
    resultType: "ankle_sprain_white_tape",
    canUseTape: true,
    painArea: "腳踝",
    suggestion: matchedItem.purpose,
    tapeMethod: matchedItem.tapingType,
    warning: "若無法踩地、明顯腫脹、瘀青嚴重、關節變形或懷疑骨折，請不要只貼白貼，應就醫檢查。",
    recommendedDepartment: "若症狀明顯請到骨科或復健科評估",
    videoUrl: matchedItem.videoUrl,
    ragResults: [matchedItem],
    replyText: [
      "【腳踝扭傷固定建議】",
      "",
      "類型：白貼",
      "部位：腳踝",
      "用途：短時間固定腳踝、減少二次傷害風險",
      "",
      "簡要說明：",
      "白貼適合腳踝扭傷後短時間固定，讓走路時比較穩定，減少因不穩造成二次傷害。白貼通常需要搭配膚貼使用，不建議長時間久貼。",
      "",
      "影片教學：",
      matchedItem.videoUrl,
      "",
      "注意事項：",
      "若無法踩地、明顯腫脹、瘀青嚴重、關節變形或懷疑骨折，請不要只貼白貼，應就醫檢查。",
      "",
      "提醒：",
      "本系統僅供貼紮教學與初步參考，不能取代專業醫療診斷。"
    ].join("\n")
  });
}

function buildNonTapingMedicalFallbackReply() {
  return [
    "【初步提醒】",
    "這種情況不屬於白貼或肌貼適合處理的範圍，建議不要自行用貼布處理。",
    "",
    "【建議就醫科別】",
    "依照描述，建議優先考慮家醫科、內科或與症狀相關的專科評估。",
    "",
    "【可以先注意】",
    "1. 先觀察症狀是否持續加重",
    "2. 避免自行亂用貼布或硬撐活動",
    "3. 若伴隨明顯惡化或其他危險訊號，請盡快就醫",
    "",
    "【何時需要急診】",
    "若出現劇痛、呼吸困難、昏倒、大量出血、意識不清、症狀快速惡化、嚴重腫脹、麻木無力或無法正常活動，請立即前往急診。",
    "",
    "【提醒】",
    "本系統僅供初步參考，不能取代醫師診斷。"
  ].join("\n");
}

function buildGeneralChatFallbackReply() {
  return [
    "我在這裡，可以陪你聊聊，也可以幫你整理白貼、肌貼與貼紮相關資訊。",
    "如果你想查貼紮教學，可以直接輸入像是「腳踝扭到」、「小腿拉傷」或「白貼和肌貼差別」。",
    "",
    `提醒：${REQUIRED_DISCLAIMER}`
  ].join("\n");
}

module.exports = {
  normalizeComparableText,
  buildAnalysisResult,
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
};
