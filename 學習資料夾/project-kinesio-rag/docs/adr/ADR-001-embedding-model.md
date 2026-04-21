# ADR-001 Embedding Model Selection

## Status

accepted

## Context

本專案需要處理：

- 中英文混雜的醫療與運動防護術語
- 短查詢，如「肩外展痛、夜間痛、能不能貼」
- 長文件，如 protocol、研究摘要、禁忌條款

候選方案：

- `BGE-M3`
- `text-embedding-3-large`
- `text-embedding-3-small`

## Decision

預設選擇 `BGE-M3` 作為本地優先的 embedding model；若 demo 環境以 API 為主，則改用 `text-embedding-3-large`。

## Consequences

正面：

- `BGE-M3` 對多語與檢索任務友善，適合中英混合專有名詞
- 可減少完全依賴雲端 API 的成本與可用性風險
- 保留日後切換到純本地部署的彈性

負面：

- 本地模型需要額外推論資源
- 與雲端 embedding 比較時需自行做 benchmark
- 若教學 demo 時間有限，部署與維運複雜度較高

## Why Not The Alternatives

- `text-embedding-3-small`
  - 成本較低，但預期在專有詞與細粒度症狀對齊上較弱
- `text-embedding-3-large`
  - 品質強，但 API 依賴與成本較高

## Follow-up

- 建立 30 題 retrieval benchmark，比較 Top-5 hit rate 與 latency
- 若 `BGE-M3` 在中英混雜術語上表現不足，切換到 `text-embedding-3-large`
