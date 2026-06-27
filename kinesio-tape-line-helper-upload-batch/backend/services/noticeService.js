const { supabase, isSupabaseEnabled } = require("./supabaseClient");

const NOTICE_TYPES = {
  DAILY_NOTICE: "daily_notice",
  FOLLOW_WELCOME: "follow_welcome"
};

function getTodayTaipeiDate() {
  const formatter = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Taipei",
    year: "numeric",
    month: "2-digit",
    day: "2-digit"
  });

  const parts = formatter.formatToParts(new Date());
  const year = parts.find((part) => part.type === "year")?.value;
  const month = parts.find((part) => part.type === "month")?.value;
  const day = parts.find((part) => part.type === "day")?.value;

  return `${year}-${month}-${day}`;
}

async function hasNoticeBeenSent(lineUserId, noticeType) {
  if (!isSupabaseEnabled || !supabase || !lineUserId || !noticeType) {
    return false;
  }

  const noticeDate = getTodayTaipeiDate();

  try {
    const { data, error } = await supabase
      .from("line_user_notice_logs")
      .select("id")
      .eq("line_user_id", lineUserId)
      .eq("notice_date", noticeDate)
      .eq("notice_type", noticeType)
      .limit(1);

    if (error) {
      console.error("Supabase select line_user_notice_logs failed:", error);
      return false;
    }

    return Array.isArray(data) && data.length > 0;
  } catch (error) {
    console.error("hasNoticeBeenSent failed:", error);
    return false;
  }
}

async function markNoticeSent(lineUserId, noticeType) {
  if (!isSupabaseEnabled || !supabase || !lineUserId || !noticeType) {
    return false;
  }

  try {
    const { error } = await supabase.from("line_user_notice_logs").upsert(
      {
        line_user_id: lineUserId,
        notice_date: getTodayTaipeiDate(),
        notice_type: noticeType
      },
      {
        onConflict: "line_user_id,notice_date,notice_type",
        ignoreDuplicates: true
      }
    );

    if (error) {
      console.error("Supabase upsert line_user_notice_logs failed:", error);
      return false;
    }

    return true;
  } catch (error) {
    console.error("markNoticeSent failed:", error);
    return false;
  }
}

function buildDailyNoticeMessage() {
  return [
    "今日使用提醒：",
    "",
    "本系統僅供貼紮教學與初步參考，不能取代醫師、物理治療師或防護員的專業判斷。",
    "",
    "若疼痛嚴重、無法活動、疑似骨折、麻木、無力、傷口感染、胸痛、呼吸困難或症狀惡化，請立即就醫。",
    "",
    "使用貼布前請先檢查皮膚是否有傷口、紅腫或感染。",
    "使用後若出現紅疹、搔癢、刺痛、灼熱或不適，請立即拆除。",
    "運動大量流汗後，請盡快拆除貼布，避免皮膚悶住造成不適。",
    "",
    "使用方式：",
    "請先輸入簡單部位，例如：",
    "「腿」",
    "「腳踝扭到」",
    "「手腕痛」",
    "「小腿拉傷」",
    "「白貼和肌貼差別」",
    "",
    "如果只輸入大部位，系統會引導你選擇更精準的位置。"
  ].join("\n");
}

function buildFollowWelcomeMessage(frontendUrl) {
  const safeFrontendUrl = frontendUrl || "目前尚未設定";

  return [
    "歡迎使用「肌貼與白貼輔助教學系統」！",
    "",
    "本系統可以協助你查詢：",
    "・白貼與肌貼差異",
    "・常見部位貼紮教學",
    "・腳踝扭傷、手指吃蘿蔔、小腿拉傷、網球肘、下背痛等教學影片",
    "・依照疼痛部位提供貼紮參考與注意事項",
    "",
    "重要提醒：",
    "本系統僅供貼紮教學與初步參考，不能取代醫師、物理治療師或防護員的專業判斷。",
    "",
    "若出現以下情況，請不要自行貼紮，應盡快就醫：",
    "・疼痛嚴重",
    "・無法活動或無法行走",
    "・疑似骨折",
    "・關節明顯變形",
    "・麻木、無力、刺痛",
    "・傷口、流血、感染",
    "・胸痛、呼吸困難或昏倒",
    "・症狀持續惡化",
    "",
    "使用貼布前請先觀察皮膚是否有傷口、紅腫或感染。",
    "使用後若出現紅疹、搔癢、刺痛、灼熱或不適，請立即拆除。",
    "運動大量流汗後，請盡快拆除貼布，避免皮膚悶住造成不適。",
    "",
    "使用方式：",
    "請用簡單明瞭的方式輸入疼痛部位，例如：",
    "「腿」",
    "「腳踝扭到」",
    "「手腕痛」",
    "「肩膀痠」",
    "「小腿拉傷」",
    "「白貼和肌貼差別」",
    "",
    "如果你只知道大部位，例如「腿」、「手」、「背」，系統會引導你細分成更精準的位置。",
    "",
    "教學網頁：",
    safeFrontendUrl
  ].join("\n");
}

module.exports = {
  NOTICE_TYPES,
  getTodayTaipeiDate,
  hasNoticeBeenSent,
  markNoticeSent,
  buildDailyNoticeMessage,
  buildFollowWelcomeMessage
};
