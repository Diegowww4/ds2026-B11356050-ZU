# project-kinesio-rag

醫療診斷輔助 RAG 系統，聚焦於肌肉骨骼不適情境下的「症狀分流、禁忌檢查、肌內效貼法建議與證據引用」。

本專案不是自動診斷器，也不是醫囑替代品。系統定位是：

- 協助整理症狀與功能受限描述
- 檢索可追溯的復健與貼紮知識
- 產生附帶引用、風險標記與不確定性說明的建議

## 題目定義

知識領域：醫療診斷輔助  
子領域：肌內效貼法（kinesiology taping）與常見肌肉骨骼症狀分流

核心使用者：

- 物理治療學生
- 運動防護相關學習者
- 復健科／骨科門診的教學展示情境

核心問題：

1. 使用者輸入症狀、疼痛位置、動作受限與誘發動作後，系統如何先做風險分流？
2. 在排除紅旗徵象後，系統如何召回合適的貼布目的、貼紮方式、張力範圍與禁忌？
3. 系統如何避免把證據不足的貼法說成確定有效？

## Repository 結構

```text
project-kinesio-rag/
├── docs/
│   ├── architecture/
│   │   └── kinesio-rag-architecture.md
│   ├── specs/
│   │   ├── README.md
│   │   └── spec-001-kinesio-rag-system.md
│   ├── adr/
│   │   ├── README.md
│   │   ├── ADR-001-embedding-model.md
│   │   ├── ADR-002-retrieval-strategy.md
│   │   └── ADR-003-medical-safety-boundary.md
│   └── whitepaper/
│       └── kinesio-rag-whitepaper.md
└── schemas/
    └── knowledge-atom.schema.json
```

## 對應老師要求

- Architecture: [docs/architecture/kinesio-rag-architecture.md](c:\Users\NewUsername\OneDrive\桌面\資料科學\project-kinesio-rag\docs\architecture\kinesio-rag-architecture.md)
- Specs: [docs/specs/spec-001-kinesio-rag-system.md](c:\Users\NewUsername\OneDrive\桌面\資料科學\project-kinesio-rag\docs\specs\spec-001-kinesio-rag-system.md)
- ADR: [docs/adr/README.md](c:\Users\NewUsername\OneDrive\桌面\資料科學\project-kinesio-rag\docs\adr\README.md)
- Whitepaper: [docs/whitepaper/kinesio-rag-whitepaper.md](c:\Users\NewUsername\OneDrive\桌面\資料科學\project-kinesio-rag\docs\whitepaper\kinesio-rag-whitepaper.md)

## 系統主張

- Explainable first：所有建議都必須回連到知識片段、臨床規則或禁忌條目
- Retrieval before generation：先分流、再檢索、最後生成
- Safety over fluency：遇到紅旗症狀、資料不足、證據衝突時，優先輸出轉介或不確定性

## 建議 demo 情境

- 肩夾擠疑似個案：肩外展疼痛、夜間痛、過肩活動受限
- 下背痛個案：久坐後疼痛、前彎加劇、無神經學紅旗
- 膝前痛個案：上下樓加劇、髕股疼痛疑似、運動貼紮輔助

## 參考風格

本專案的文件結構參考 `project-destiny` 與 `project-diagnosis` 的做法：

- `project-destiny` 強調規則先行、Grounded Generation、ADR 完整化
- `project-diagnosis` 強調 ontology-first、hybrid retrieval、白皮書導向

## 參考文獻

- PubMed: A systematic review of the effectiveness of kinesio taping for musculoskeletal injury  
  https://pubmed.ncbi.nlm.nih.gov/23306413/
- PubMed: Effect of kinesiology taping on pain in individuals with musculoskeletal injuries  
  https://pubmed.ncbi.nlm.nih.gov/24875972/
- PubMed: Effects of elastic kinesiology taping on shoulder proprioception  
  https://pubmed.ncbi.nlm.nih.gov/37224618/
