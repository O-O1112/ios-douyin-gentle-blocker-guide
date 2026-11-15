# iOS 抖音柔和封鎖器｜視覺化設定引導

純本地端、免家長驗證、不強制鎖死的 iOS「捷徑」自動化視覺化引導網站，附帶即時 iPhone 互動模擬器與勸退語錄客製化工具。

## 專案結構

- `src/index.html`：主頁面與互動模擬器結構
- `src/styles.css`：iOS 風格深色響應式樣式
- `src/app.js`：步驟切換、語錄編輯與 iPhone 模擬器邏輯
- `tests/smoke.test.mjs`：基礎單元與檔案檢查測試
- `docker-compose.yml`：使用 Nginx 提供靜態網站服務

## 本機執行

### 方式一：直接用瀏覽器開啟
直接雙擊開啟 `src/index.html`，或使用任何靜態伺服器（例如 `npx serve src`）。

### 方式二：Docker 啟動
```bash
cp .env.example .env
docker compose up -d
```
開啟 `http://localhost:8080`。

## 執行測試

```bash
node --test tests/smoke.test.mjs
```
