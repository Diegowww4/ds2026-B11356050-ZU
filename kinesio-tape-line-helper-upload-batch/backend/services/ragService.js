const knowledgeSeed = require("../data/knowledgeSeed");
const { supabase, isSupabaseEnabled } = require("./supabaseClient");

function normalizeText(value) {
  return String(value || "").trim().toLowerCase();
}

function scoreKnowledgeItem(query, item) {
  const normalizedQuery = normalizeText(query);
  if (!normalizedQuery) {
    return 0;
  }

  const keywords = [
    ...(Array.isArray(item.symptomKeywords) ? item.symptomKeywords : []),
    item.bodyPart,
    item.searchText
  ]
    .filter(Boolean)
    .map((value) => String(value).toLowerCase());

  return keywords.reduce((score, keyword) => {
    return normalizedQuery.includes(keyword) ? score + 2 : score;
  }, 0);
}

function mapSeedRecord(item, score) {
  return {
    bodyPart: item.bodyPart,
    possibleCondition: item.possibleCondition,
    tapeMethod: item.tapeMethod,
    precautions: item.precautions,
    recommendedDepartment: item.recommendedDepartment,
    videoUrl: item.videoUrl,
    source: "knowledgeSeed",
    similarity: score
  };
}

function mapSupabaseRecord(row, score) {
  const matchedSeed = knowledgeSeed.find((item) => item.bodyPart === row.body_part);

  return {
    bodyPart: row.body_part,
    possibleCondition: row.possible_condition,
    tapeMethod: row.tape_method,
    precautions: row.warning,
    recommendedDepartment: row.recommended_department || matchedSeed?.recommendedDepartment,
    videoUrl: row.video_url || matchedSeed?.videoUrl || "",
    source: "supabase",
    similarity: typeof row.similarity === "number" ? row.similarity : score
  };
}

function searchSeedKnowledge(query, limit = 3) {
  return knowledgeSeed
    .map((item) => ({ item, score: scoreKnowledgeItem(query, item) }))
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(({ item, score }) => mapSeedRecord(item, score));
}

async function searchSupabaseKnowledge(query, limit = 3) {
  if (!isSupabaseEnabled || !supabase) {
    return [];
  }

  const rpcName = process.env.SUPABASE_VECTOR_SEARCH_RPC || "match_tape_guides";

  try {
    const rpcResponse = await supabase.rpc(rpcName, {
      query_text: query,
      match_count: limit
    });

    if (!rpcResponse.error && Array.isArray(rpcResponse.data) && rpcResponse.data.length > 0) {
      return rpcResponse.data.map((row) => mapSupabaseRecord(row, row.similarity || 0));
    }
  } catch (error) {
    console.warn(`Supabase RPC ${rpcName} failed, fallback to table scan.`, error.message);
  }

  const { data, error } = await supabase.from("tape_guides").select("*").limit(50);
  if (error || !Array.isArray(data)) {
    if (error) {
      console.error("Supabase select tape_guides failed:", error);
    }
    return [];
  }

  return data
    .map((row) => {
      const matchedSeed = knowledgeSeed.find((item) => item.bodyPart === row.body_part);
      const score = scoreKnowledgeItem(query, {
        bodyPart: row.body_part,
        symptomKeywords: matchedSeed?.symptomKeywords || [],
        searchText: [
          row.possible_condition,
          row.tape_method,
          row.warning,
          row.recommended_department
        ]
          .filter(Boolean)
          .join(" ")
      });

      return { row, score };
    })
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(({ row, score }) => mapSupabaseRecord(row, score));
}

async function searchKinesioKnowledge(query, options = {}) {
  const limit = Number(options.limit || 3);
  const supabaseResults = await searchSupabaseKnowledge(query, limit);

  if (supabaseResults.length > 0) {
    return supabaseResults;
  }

  return searchSeedKnowledge(query, limit);
}

module.exports = {
  searchKinesioKnowledge
};
