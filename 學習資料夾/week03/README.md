# Week03 - WSL、Docker、Supabase 練習

## 安裝心得
這次在安裝 WSL 與 Docker 的過程中，我有遇到環境設定問題。
一開始有遇到指令無法執行、Docker 無法正常啟動等情況，
後來透過重新檢查安裝步驟、重新啟動電腦，以及確認 WSL 2 是否正常啟用後解決。

## 遇到的 Bug 與解法
- WSL 指令無法正常使用  
  我重新確認 Windows 功能是否啟用，並重新安裝 WSL。
- Docker 無法正常啟動  
  我重新啟動 Docker Desktop，並確認 WSL 2 已經正常運作。
- git push 過程中如果出現錯誤  
  先看最後兩行訊息，再依提示修正。

## Docker 練習
本次在 `week03/docker-compose.yml` 中建立了一個簡單的 Nginx 服務，
可以使用 Docker Compose 一鍵啟動環境。

## Supabase 專案資訊
Project URL：
https://ehaxxgcwgalwzkwxtxdc.supabase.co

已建立的資料表：
- students

## JSON 練習
已建立 `week03/config.json`，內容包含：
- project_name
- region
- features

## 資安習慣
本次有建立 `.env` 存放敏感資訊，
並建立 `.env.example` 提供欄位範例，
同時將 `.env` 加入 `.gitignore`，避免敏感資訊上傳到 GitHub。

### Week 03 任務完成清單
- [x] WSL 2 環境運作正常
- [x] Docker 能成功啟動 `docker-compose.yml` 中的服務
- [x] Supabase 雲端專案已建立
- [x] 成功編輯 `config.json` 且格式正確
- [x] 已設定 `.gitignore` 保護敏感資訊
