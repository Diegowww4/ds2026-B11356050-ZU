# ADR-002 Hybrid + Parent-Document Retrieval

## Status

accepted

## Context

肌內效貼法查詢具有三種同時存在的訊號：

- 症狀與動作限制的語義訊號
- 醫學專有名詞與部位名稱的詞面訊號
- 連續步驟與禁忌條文的父文件脈絡

若只使用向量檢索，容易：

- 漏掉明確詞面匹配
- 找到相似症狀但錯部位
- 只抓到步驟片段，失去完整 protocol

## Decision

採用 `Hybrid Search + Parent-Document Retrieval + Reranking`。

## Consequences

正面：

- 提升 recall，避免只靠單一向量鄰近
- 可把片段召回恢復成完整貼紮步驟與禁忌說明
- reranking 可把安全性與相關性一起納入排序

負面：

- pipeline 較複雜
- latency 高於單一 dense retrieval
- 需要維護更多索引與 metadata

## Why Not GraphRAG

GraphRAG 很適合處理因果鏈與知識圖譜推理，但本專案第一階段重點是：

- 教學型症狀分流
- protocol 召回完整度
- 禁忌與紅旗防呆

在資料量與時間有限的課程作業中，Hybrid + Parent Retrieval 的性價比更高，且更容易展示可解釋性。

## Follow-up

- 第二階段可將 `symptom -> suspected_condition -> taping_goal -> contraindication` 建成知識圖，評估是否需要升級 GraphRAG
