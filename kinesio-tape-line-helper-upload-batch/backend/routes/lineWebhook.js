const express = require("express");
const { replyMessage, formatLineReplyText } = require("../services/lineService");
const { handleKinesioTapeMessage } = require("../agents/kinesioTapeAgent");
const { supabase, isSupabaseEnabled } = require("../services/supabaseClient");
const {
  NOTICE_TYPES,
  hasNoticeBeenSent,
  markNoticeSent,
  buildDailyNoticeMessage,
  buildFollowWelcomeMessage
} = require("../services/noticeService");

const router = express.Router();

function normalizeNullableValue(value) {
  if (value === undefined || value === null || value === "") {
    return null;
  }

  return value;
}

function buildStoredReply(messages) {
  return (Array.isArray(messages) ? messages : [messages])
    .map((message) => formatLineReplyText(message))
    .filter(Boolean)
    .join("\n\n");
}

async function insertLineMessage(lineUserId, userMessage, botReply) {
  if (!isSupabaseEnabled || !supabase) {
    return;
  }

  try {
    const { error } = await supabase.from("line_messages").insert({
      line_user_id: normalizeNullableValue(lineUserId),
      user_message: normalizeNullableValue(userMessage),
      bot_reply: normalizeNullableValue(botReply)
    });

    if (error) {
      console.error("Supabase insert line_messages failed:", error);
    }
  } catch (error) {
    console.error("insertLineMessage failed:", error);
  }
}

async function insertConsultationRecord({
  lineDisplayName,
  lineUserId,
  userMessage,
  metadata
}) {
  if (!isSupabaseEnabled || !supabase) {
    return;
  }

  try {
    const { error } = await supabase.from("consultation_records").insert({
      name: lineDisplayName || "LINE使用者",
      pain_area: normalizeNullableValue(metadata?.painArea),
      pain_reason: normalizeNullableValue(userMessage),
      pain_level: metadata?.painLevel ?? null,
      line_user_id: normalizeNullableValue(lineUserId),
      line_display_name: normalizeNullableValue(lineDisplayName),
      result_type: normalizeNullableValue(metadata?.resultType),
      can_use_tape:
        typeof metadata?.canUseTape === "boolean" ? metadata.canUseTape : null,
      suggestion: normalizeNullableValue(metadata?.suggestion),
      tape_method: normalizeNullableValue(metadata?.tapeMethod),
      warning: normalizeNullableValue(metadata?.warning),
      recommended_department: normalizeNullableValue(metadata?.recommendedDepartment)
    });

    if (error) {
      console.error("Supabase insert consultation_records failed:", error);
    }
  } catch (error) {
    console.error("insertConsultationRecord failed:", error);
  }
}

async function handleFollowEvent(event) {
  const lineUserId = event.source?.userId || "";
  const frontendUrl = process.env.FRONTEND_URL || "目前尚未設定";
  const welcomeMessage = buildFollowWelcomeMessage(frontendUrl);
  const replyMessages = [welcomeMessage];

  if (event.replyToken) {
    try {
      await replyMessage(event.replyToken, replyMessages);
    } catch (error) {
      console.error("LINE replyMessage failed on follow event:", error);
    }
  }

  await insertLineMessage(lineUserId, "[follow event]", buildStoredReply(replyMessages));

  const markWelcomeResult = await markNoticeSent(
    lineUserId,
    NOTICE_TYPES.FOLLOW_WELCOME
  );
  if (!markWelcomeResult) {
    console.error("markNoticeSent failed for follow_welcome:", lineUserId);
  }

  const markDailyResult = await markNoticeSent(lineUserId, NOTICE_TYPES.DAILY_NOTICE);
  if (!markDailyResult) {
    console.error("markNoticeSent failed for daily_notice after follow:", lineUserId);
  }
}

async function handleMessageEvent(event) {
  const userMessage = event.message?.text || "";
  const lineUserId = event.source?.userId || "";
  const lineDisplayName = event.source?.displayName || "LINE使用者";

  const { replyText, metadata } = await handleKinesioTapeMessage({
    lineUserId,
    userMessage,
    displayName: lineDisplayName
  });
  const replyMessages = [];

  let hasDailyNotice = false;
  try {
    hasDailyNotice = await hasNoticeBeenSent(
      lineUserId,
      NOTICE_TYPES.DAILY_NOTICE
    );
  } catch (error) {
    console.error("hasNoticeBeenSent failed:", error);
  }

  if (!hasDailyNotice) {
    replyMessages.push(buildDailyNoticeMessage());
    const markResult = await markNoticeSent(lineUserId, NOTICE_TYPES.DAILY_NOTICE);
    if (!markResult) {
      console.error("markNoticeSent failed for daily_notice:", lineUserId);
    }
  }

  replyMessages.push(replyText);

  await insertConsultationRecord({
    lineDisplayName,
    lineUserId,
    userMessage,
    metadata
  });

  await insertLineMessage(lineUserId, userMessage, buildStoredReply(replyMessages));

  if (event.replyToken) {
    try {
      await replyMessage(event.replyToken, replyMessages);
    } catch (error) {
      console.error("LINE replyMessage failed:", error);
    }
  }
}

router.post("/", async (req, res) => {
  const events = Array.isArray(req.body?.events) ? req.body.events : [];

  for (const event of events) {
    try {
      if (event.type === "follow") {
        await handleFollowEvent(event);
        continue;
      }

      if (event.type === "message" && event.message?.type === "text") {
        await handleMessageEvent(event);
      }
    } catch (error) {
      console.error("lineWebhook event handling failed:", error);
    }
  }

  res.json({ success: true });
});

module.exports = router;
