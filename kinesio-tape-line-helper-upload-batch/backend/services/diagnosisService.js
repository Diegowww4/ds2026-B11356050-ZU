const tapeRules = require("../data/tapeRules");

const MEDICAL_REMINDER =
  "本系統僅供肌貼教學與初步參考，不能取代醫師診斷。若疼痛嚴重、持續惡化、明顯腫脹、變形、麻木、無法承重、開放性傷口、疑似骨折，請立即就醫。";

const NOT_FOR_TAPE_KEYWORDS = [
  "胸痛",
  "呼吸困難",
  "發燒",
  "腹痛",
  "頭暈",
  "感染",
  "流血",
  "傷口",
  "過敏",
  "骨折"
];

function normalizeText(value) {
  return String(value || "").trim();
}

function containsNotForTapeKeyword(text) {
  return NOT_FOR_TAPE_KEYWORDS.some((keyword) => text.includes(keyword));
}

function isUrgentCase(data) {
  const painLevel = Number(data.pain_level || 0);

  return (
    painLevel >= 8 ||
    data.suspected_fracture === true ||
    data.unable_to_walk === true ||
    data.wound === true ||
    data.numbness === true ||
    data.weakness === true ||
    (data.swelling === true && painLevel >= 7)
  );
}

function getRecommendedDepartment(data) {
  const painReason = normalizeText(data.pain_reason);
  const combinedText = `${normalizeText(data.pain_area)} ${painReason} ${normalizeText(data.duration)}`;

  if (
    data.suspected_fracture ||
    data.unable_to_walk ||
    Number(data.pain_level || 0) >= 8
  ) {
    return "急診或骨科";
  }

  if (
    combinedText.includes("胸痛") ||
    combinedText.includes("呼吸困難")
  ) {
    return "急診、心臟內科或胸腔內科";
  }

  if (combinedText.includes("腹痛")) {
    return "腸胃科或家醫科";
  }

  if (combinedText.includes("發燒") || combinedText.includes("感染")) {
    return "家醫科、感染科或急診";
  }

  if (data.wound || combinedText.includes("傷口") || combinedText.includes("過敏")) {
    return "皮膚科或家醫科";
  }

  if (data.numbness || data.weakness || combinedText.includes("刺痛") || combinedText.includes("神經")) {
    return "神經內科、骨科或復健科";
  }

  if (painReason.includes("扭傷") || combinedText.includes("關節")) {
    return "骨科";
  }

  if (
    painReason.includes("拉傷") ||
    painReason.includes("運動") ||
    painReason.includes("姿勢不良") ||
    painReason.includes("搬重物")
  ) {
    return "復健科或骨科";
  }

  return "家醫科、骨科或復健科";
}

function buildWarning(baseWarning) {
  return `${baseWarning} ${MEDICAL_REMINDER}`;
}

function analyzeConsultation(data) {
  const safeData = {
    pain_area: normalizeText(data.pain_area),
    pain_reason: normalizeText(data.pain_reason),
    pain_level: Number(data.pain_level || 0),
    swelling: Boolean(data.swelling),
    bruise: Boolean(data.bruise),
    numbness: Boolean(data.numbness),
    weakness: Boolean(data.weakness),
    unable_to_walk: Boolean(data.unable_to_walk),
    wound: Boolean(data.wound),
    suspected_fracture: Boolean(data.suspected_fracture),
    duration: normalizeText(data.duration)
  };

  if (isUrgentCase(safeData)) {
    return {
      result_type: "urgent_medical",
      can_use_tape: false,
      title: "建議先就醫檢查",
      suggestion: "你的情況可能不適合自行使用肌貼，建議先就醫檢查。",
      tape_method: "",
      warning: buildWarning("請勿只依靠肌貼處理，若疼痛嚴重或持續惡化，請立即就醫。"),
      recommended_department: "依症狀建議骨科、復健科、神經內科或急診"
    };
  }

  const combinedText = `${safeData.pain_area} ${safeData.pain_reason} ${safeData.duration}`;

  if (
    safeData.pain_area === "其他" ||
    containsNotForTapeKeyword(combinedText)
  ) {
    return {
      result_type: "not_for_tape",
      can_use_tape: false,
      title: "此情況不建議使用肌貼",
      suggestion: "此情況不建議使用肌貼處理，建議尋求專業醫療協助。",
      tape_method: "",
      warning: buildWarning("若症狀嚴重、快速惡化或不確定原因，請立即就醫。"),
      recommended_department: "請依症狀選擇家醫科、骨科、復健科、皮膚科、腸胃科、胸腔內科或急診"
    };
  }

  const rule = tapeRules[safeData.pain_area];

  if (!rule) {
    return {
      result_type: "not_for_tape",
      can_use_tape: false,
      title: "暫時無法提供此部位的肌貼建議",
      suggestion: "目前系統沒有這個部位的安全規則，建議先由專業人員評估。",
      tape_method: "",
      warning: buildWarning("若症狀持續或惡化，請就醫確認原因。"),
      recommended_department: getRecommendedDepartment(safeData)
    };
  }

  return {
    result_type: "tape_available",
    can_use_tape: true,
    title: "可參考肌貼貼法",
    suggestion: rule.possible_condition,
    tape_method: rule.tape_method,
    warning: buildWarning(rule.warning),
    recommended_department: rule.recommended_department || getRecommendedDepartment(safeData)
  };
}

module.exports = {
  analyzeConsultation,
  getRecommendedDepartment,
  MEDICAL_REMINDER
};
