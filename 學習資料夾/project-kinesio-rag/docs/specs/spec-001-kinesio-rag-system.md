# Spec-001 Kinesio RAG System

## Status

Draft

## Scope

本系統提供「醫療診斷輔助」而非「醫療診斷自動化」。範圍限定為：

- 常見肌肉骨骼症狀描述的教學型分流
- 肌內效貼法的知識檢索與建議生成
- 紅旗徵象辨識與禁忌提醒

不包含：

- 影像判讀
- 真實處方或醫囑
- 自動下最終診斷
- 高風險急症處置建議

## Problem Statement

肌內效貼法的教學資料往往散落在講義、教科書、臨床筆記與研究摘要中。單純向量搜尋容易把：

- 症狀描述
- 疑似問題類型
- 貼紮目的
- 禁忌條件
- 證據等級

混成一段模糊答案，導致使用者無法理解建議依據，也無法判斷何時不應貼紮。

## Functional Requirements

- FR-001: 系統必須先做紅旗徵象偵測，再進入貼紮建議流程。
- FR-002: 系統必須支援輸入症狀、疼痛部位、誘發動作、功能限制與使用者問題。
- FR-003: 系統必須將查詢對齊到結構化 ontology，包括 `body_part`, `symptom`, `taping_goal`, `contraindication`。
- FR-004: 系統必須採用 hybrid retrieval，而非單一 dense retrieval。
- FR-005: 系統必須支援 parent-document retrieval，以回收完整 protocol 上下文。
- FR-006: 系統必須在生成前執行 reranking。
- FR-007: 系統輸出必須附帶 citations。
- FR-008: 系統必須在證據不足時明確說明不確定性。
- FR-009: 系統必須將禁忌症與轉介條件列為一級輸出，而不是附註。
- FR-010: 系統必須可被 RAGAS 或 TruLens 量化評估。

## Data Specification

### Knowledge Atom Types

- `symptom`
- `functional_limit`
- `special_test`
- `suspected_condition`
- `taping_goal`
- `taping_protocol`
- `contraindication`
- `red_flag`
- `evidence_summary`
- `citation`
- `case_summary`

### Chunking Strategy

本專案採混合式 chunking：

1. `Markdown / heading aware split`
   - 保留章節標題與程序段落
2. `Semantic split`
   - 長段研究摘要按語意斷點分割
3. `Procedure-preserving split`
   - 貼紮步驟 1 到 N 不可任意拆散

建議 chunk 規格：

- target size: 350-600 tokens
- overlap: 60-90 tokens
- procedure block: 允許超出一般長度，但必須完整保留步驟序列

### Metadata Fields

- `source_id`
- `source_type`
- `source_title`
- `language`
- `body_part`
- `suspected_condition`
- `taping_goal`
- `contraindications`
- `evidence_level`
- `review_status`
- `parent_doc_id`
- `section_path`

## Performance Targets

- Retrieval latency p95: `< 800 ms`
- End-to-end response latency p95: `< 4 s`
- Top-K retrieval accuracy:
  - Top-5 hit rate `>= 0.80`
  - Top-10 hit rate `>= 0.90`
- Citation coverage: `>= 95%` of final answers must include at least 2 evidence items
- Red-flag recall: `>= 0.95`

## Retrieval Pipeline

1. Query intake
2. Red-flag detection
3. Entity extraction
4. Ontology mapping
5. Dense retrieval
6. BM25 retrieval
7. Merge and deduplicate
8. Parent-document expansion
9. Reranking
10. Grounded generation
11. Safety post-check

## Evaluation Plan

### RAGAS

使用 RAGAS 評估：

- Faithfulness
- Answer Relevancy
- Context Precision
- Context Recall

最低標準：

- Faithfulness `>= 0.85`
- Answer Relevancy `>= 0.85`
- Context Precision `>= 0.80`

### TruLens

使用 TruLens 補充：

- Groundedness
- Safety refusal correctness
- Citation-use consistency

### Custom Domain Evaluation

建立 30-50 題教學型 evaluation set，覆蓋：

- 肩部
- 膝部
- 下背
- 足踝
- 水腫與循環輔助情境
- 禁忌與紅旗案例

每題標註：

- 預期分流結果
- 必要召回文件
- 不應出現的危險建議
- 是否允許貼紮

## Risks

- 風險 1：把貼布建議誤當成正式診斷
- 風險 2：研究證據異質性高，模型容易過度總結
- 風險 3：專有名詞中英混雜，召回偏差
- 風險 4：procedure chunk 被切碎後導致步驟錯序

## Mitigations

- 明確 safety boundary
- rule-based triage before generation
- parent-document retrieval
- evidence-level metadata filtering
- uncertainty-first answer template
