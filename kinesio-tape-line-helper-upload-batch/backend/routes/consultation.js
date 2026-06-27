const express = require("express");
const { analyzeConsultation } = require("../services/diagnosisService");
const { supabase, isSupabaseEnabled } = require("../services/supabaseClient");
const { pushMessage } = require("../services/lineService");

const router = express.Router();

router.post("/", async (req, res, next) => {
  try {
    const payload = req.body || {};

    if (!payload.pain_area || !payload.pain_reason || !payload.pain_level) {
      return res.status(400).json({
        success: false,
        message: "請至少填寫疼痛部位、疼痛原因與疼痛程度。"
      });
    }

    const analysis = analyzeConsultation(payload);

    if (isSupabaseEnabled) {
      const record = {
        ...payload,
        result_type: analysis.result_type,
        can_use_tape: analysis.can_use_tape,
        suggestion: analysis.suggestion,
        tape_method: analysis.tape_method,
        warning: analysis.warning,
        recommended_department: analysis.recommended_department
      };

      const { error } = await supabase.from("consultation_records").insert(record);

      if (error) {
        console.error("Supabase insert consultation_records failed:", error);
      }
    }

    if (
      payload.line_user_id &&
      process.env.PUSH_RESULT_TO_LINE === "true"
    ) {
      const pushText = [
        "肌貼輔助諮詢結果",
        `判斷結果：${analysis.title}`,
        `建議內容：${analysis.suggestion}`,
        analysis.tape_method ? `肌貼貼法：${analysis.tape_method}` : "肌貼貼法：此情況不建議自行使用肌貼。",
        `注意事項：${analysis.warning}`,
        `建議科別：${analysis.recommended_department}`
      ].join("\n");

      await pushMessage(payload.line_user_id, pushText);
    }

    return res.json({
      success: true,
      data: analysis
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
