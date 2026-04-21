# ADR-003 Medical Safety Boundary

## Status

accepted

## Context

醫療領域的 hallucination 代價高。肌內效貼法雖屬低侵入輔助工具，但若把：

- 神經學紅旗
- 急性外傷
- 循環問題
- 皮膚禁忌

誤判為一般可貼紮情境，可能導致延誤就醫或不當建議。

## Decision

系統明確定位為「診斷輔助與教學檢索」，不提供最終診斷，不提供醫囑，不覆蓋紅旗情境。

先做 rule-based / ontology-based triage，再允許進入 RAG 與生成。

## Consequences

正面：

- 能清楚說明系統邊界，降低醫療風險
- 更容易設計 guardrails 與評估題
- 有助於提高 faithfulness 與 refusal correctness

負面：

- 系統看起來比一般聊天機器人保守
- 有些邊界案例會被拒答，降低表面上的「好聊程度」

## Non-Negotiable Rules

- 命中紅旗徵象時，不生成貼紮步驟
- 沒有 citation 時，不輸出具體建議
- 證據衝突時，必須顯示不確定性
- 一律附上「非診斷、需專業評估」聲明

## Follow-up

- 建立紅旗詞表與禁忌 ontology
- 在 TruLens 中加入 refusal correctness 與 groundedness 評估
