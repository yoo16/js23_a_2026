
## モジュールインストール
### dependencies
```bash
npm i dotenv 
npm i express
```

## package.json修正
### 起動スクリプト
```json
"scripts": {
  "dev": "node --watch server.js"
},
```

### モジュール方式(ESM)
-  "type": "module", を追加

```json
{
  "name": "xxxxxxx",
  ...
  "type": "module",
  "scripts": {
    ...
  },
  ...
}
```

## サーバ起動
```bash
npm run dev
```

## cURLコマンド(POST)
### macOS, Linux
```bash
curl -X POST http://localhost:3000/save
```

### Windows (PowerShell):
```bash
curl.exe -X POST http://localhost:3000/save
```

```bash
Invoke-RestMethod -Method Post -Uri http://localhost:3000/save
```

### データつき
#### x-www-form-urlencoded
```bash
curl -X POST http://localhost:3000/save \
     -d "name=Alice&age=23"
```

#### application/json
```bash
curl -X POST http://localhost:3000/save \
  -H "Content-Type: application/json" \
  -d "{\"name\":\"Alice\",\"age\":23}"
```
