const { supabase, isSupabaseEnabled } = require("./supabaseClient");

async function getRecentMessages(lineUserId, limit = 6) {
  if (!isSupabaseEnabled || !supabase || !lineUserId) {
    return [];
  }

  try {
    const { data, error } = await supabase
      .from("line_messages")
      .select("user_message, bot_reply, created_at")
      .eq("line_user_id", lineUserId)
      .order("created_at", { ascending: false })
      .limit(limit);

    if (error) {
      console.error("Supabase getRecentMessages failed:", error);
      return [];
    }

    return Array.isArray(data) ? [...data].reverse() : [];
  } catch (error) {
    console.error("getRecentMessages failed:", error);
    return [];
  }
}

function buildConversationContext(messages) {
  if (!Array.isArray(messages) || messages.length === 0) {
    return "";
  }

  const lines = [];

  for (const message of messages) {
    const userMessage = String(message?.user_message || "").trim();
    const botReply = String(message?.bot_reply || "").trim();

    if (userMessage) {
      lines.push(`使用者：${userMessage}`);
    }

    if (botReply) {
      lines.push(`助理：${botReply}`);
    }
  }

  return lines.join("\n");
}

module.exports = {
  getRecentMessages,
  buildConversationContext
};
