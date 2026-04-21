# Kinesio RAG Whitepaper

## Abstract

本白皮書提出一套面向醫療診斷輔助的 RAG 系統，主題聚焦於肌內效貼法。系統不追求自動下診斷，而是將肌肉骨骼症狀、貼紮目的、禁忌條件、證據等級與程序知識轉化為可檢索、可排序、可引用的數位表徵。本文主張，在醫療場景中，RAG 的核心難點不只是 retrieval accuracy，而是如何把「有限證據、語意含混、程序完整性、風險邊界」同時編碼進知識表示與生成約束。

## 1. Domain Difficulty

肌內效貼法是典型的跨層級知識領域：

- 症狀層：痛、緊、腫、麻、無力、活動受限
- 推測層：可能涉及組織、動作模式、功能失衡
- 介入層：貼紮目的是減痛、支撐、促進覺察、循環輔助
- 風險層：皮膚敏感、循環問題、急性創傷、神經學紅旗
- 證據層：不同部位與情境的研究結論異質性很高

這使得知識不能只被表達成單一向量。若直接把所有資料丟進向量庫，系統可能學到「語意近似」，卻忽略「禁忌優先」與「程序完整」。

## 2. Representation Challenge

### 2.1 同一術語的多重角色

例如「shoulder pain」可能同時是：

- 主訴
- 檢索條件
- 不夠精確的候選問題描述

而「decompression taping」可能是：

- 介入目的
- 貼法名稱
- 某一 protocol 的局部步驟

因此，系統必須把文本拆成不同型別的 knowledge atom，而不是只保留原始段落。

### 2.2 程序知識的不可切碎性

一般 RAG 常使用固定長度 chunk，但肌內效貼法包含：

- anchor placement
- direction
- tension range
- end position
- skin check

任一步驟錯置都會破壞可用性。這表示貼紮 protocol 需要 parent-document retrieval 或 procedure-preserving chunking。

### 2.3 證據異質性

文獻對肌內效貼法的效果並不一致。PubMed 上多篇系統性回顧指出，某些情境下可能有短期疼痛或 proprioception 改善，但長期效果與跨情境外推有限。這代表生成模型必須能表達：

- 可能有效於短期緩解
- 不等於證實對所有病況有效
- 不應被誇大為正式診斷或治療替代

## 3. Why RAG Instead of Fine-Tuning Only

本題更適合 RAG 而不是單純 fine-tuning，原因如下：

- 醫療資料需可追溯來源
- 課程作業需要展示可解釋性
- 禁忌與最新文獻可能更新，RAG 維護成本較低
- 使用者需要看到「為什麼這樣建議」，不是只看一句答案

## 4. Hallucination Control

本系統用四種方式降低 hallucination：

1. Triage before retrieval  
   先判斷是否根本不應進入貼紮建議流程。

2. Retrieval before generation  
   沒有高信心證據就不生成具體 protocol。

3. Citation contract  
   每個答案都要有來源，且來源要能回到父文件。

4. Uncertainty-first template  
   模板中保留「證據有限」「需專業評估」「僅作教學輔助」等欄位。

## 5. Cold Start And Terminology Alignment

醫療與運動防護場景常見 cold start 問題：

- 新個案描述很口語
- 中英夾雜
- 同一部位有多種說法
- 學生與臨床人員用詞不同

解法：

- 建立 ontology alias table  
  例如 `膝前痛`, `anterior knee pain`, `PFPS-like pain`
- 保留雙語 metadata
- 在 query understanding 階段先做 entity normalization
- 在少資料情境下先從教學型高品質 protocol 與系統性回顧建立 seed corpus

## 6. Innovation

本系統的創新點不在於宣稱「AI 會貼布」，而在於：

- 把肌內效貼法從教學文字轉為可驗證的知識原子
- 把紅旗與禁忌放在檢索與生成之前
- 把 evidence level 與 uncertainty 變成一級輸出
- 把 protocol 完整性視為 retrieval 設計的一部分

## 7. Conclusion

醫療診斷輔助型 RAG 的價值，不是生成更像專家的語氣，而是讓每一步推理都更可追溯、更可反駁、更安全。以肌內效貼法為主題的專案，非常適合作為課程展示，因為它同時具備：

- 專有名詞多
- 文本與程序混合
- 證據異質性高
- 幻覺成本明確

也因此，它能很好地展示一個高品質 RAG 系統在 representation、retrieval、reranking 與 safety 上的完整思考。

## References

1. Mostafavifar M, Wertz J, Borchers J. A systematic review of the effectiveness of kinesio taping for musculoskeletal injury. PubMed: https://pubmed.ncbi.nlm.nih.gov/23306413/
2. Montalvo AM, Le Cara E, Myer GD. Effect of kinesiology taping on pain in individuals with musculoskeletal injuries: systematic review and meta-analysis. PubMed: https://pubmed.ncbi.nlm.nih.gov/24875972/
3. Ager AL, et al. Effects of elastic kinesiology taping on shoulder proprioception: a systematic review. PubMed: https://pubmed.ncbi.nlm.nih.gov/37224618/
