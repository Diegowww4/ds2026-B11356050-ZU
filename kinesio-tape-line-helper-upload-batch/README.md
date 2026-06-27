# kinesio-tape-line-helper

以 LINE 官方帳號為主要互動入口的肌貼輔助教學系統。後端使用 Express，資料可存到 Supabase，安全範圍內的肌貼文字整理會交給 OpenAI API 產生適合 LINE 顯示的繁體中文回覆。

## 目前流程

1. 使用者在 LINE 輸入症狀，例如 `膝蓋痛`、`腳踝扭到`、`肩膀痠痛`。
2. `POST /api/line/webhook` 收到訊息後，交給 `backend/agents/kinesioTapeAgent.js`。
3. Agent 先做 `safetyCheckTool` 危險症狀判斷。
4. 若文字包含 `骨折`、`不能走`、`無法走`、`麻`、`無力`、`流血`、`傷口`、`變形`、`劇痛`、`胸痛`、`呼吸困難`、`昏倒`，直接回覆就醫建議，不提供肌貼貼法。
5. 若不屬於肌貼適用範圍，回覆不建議使用肌貼並提供建議科別。
6. 若安全且屬於肌貼適用範圍，才會做 RAG：
   - 先嘗試用 Supabase RPC `match_tape_guides` 做向量檢索
   - 若 RPC 尚未配置，會回退為 `tape_guides` 資料表與本地 seed 的關鍵字比對
7. 安全範圍內再交由 OpenAI API 生成 LINE 回覆。

## 回覆規則

- 使用繁體中文
- 語氣簡單、保守、清楚
- 不能說「診斷為」
- 只能說「可能是」、「可參考」、「建議」
- 不可編造醫療結論
- 若 RAG 資料不足，要明確建議就醫或詢問專業人員
- 每次回覆都要包含：
  - 可能情況
  - 肌貼貼法
  - 注意事項
  - 何時需要就醫
  - 建議科別
  - 操作影片連結
  - 醫療免責聲明

固定醫療免責聲明：

`本系統僅供肌貼教學與初步參考，不能取代醫師診斷。`

## 專案結構

```text
kinesio-tape-line-helper/
├─ frontend/
├─ backend/
│  ├─ agents/
│  │  └─ kinesioTapeAgent.js
│  ├─ data/
│  │  ├─ knowledgeSeed.js
│  │  └─ tapeRules.js
│  ├─ routes/
│  │  ├─ consultation.js
│  │  └─ lineWebhook.js
│  ├─ services/
│  │  ├─ diagnosisService.js
│  │  ├─ lineService.js
│  │  ├─ openaiService.js
│  │  ├─ ragService.js
│  │  └─ supabaseClient.js
│  ├─ .env.example
│  ├─ package.json
│  └─ server.js
└─ supabase/
   └─ migrations/
      └─ init.sql
```

## 環境變數

`backend/.env.example`

```env
PORT=3000

SUPABASE_URL=
SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

LINE_CHANNEL_ACCESS_TOKEN=
LINE_CHANNEL_SECRET=

FRONTEND_URL=
LIFF_ID=

PUSH_RESULT_TO_LINE=false

OPENAI_API_KEY=
OPENAI_MODEL=gpt-4.1-mini
```

## 後端啟動

在 `backend/` 目錄執行：

```bash
npm install
npm run dev
```

健康檢查：

```text
http://localhost:3000/api/health
```

## LINE Webhook

Webhook URL：

```text
https://你的後端網址/api/line/webhook
```

LINE 文字訊息範例：

- `膝蓋痛`
- `腳踝扭到`
- `肩膀痠痛`
- `腰痛`
- `手腕痛`
- `小腿拉傷`

## Supabase

目前資料表包含：

- `consultation_records`
- `tape_guides`
- `line_messages`

若要完整使用 pgvector RAG，建議另外在 Supabase 建立向量欄位、嵌入流程與 `match_tape_guides` RPC。若尚未完成，系統會先用現有 `tape_guides` 與本地 seed 做保守的回退搜尋。
