# Claude Code SDK on Discord Bot

Claude Code SDKと連携し、DiscordチャンネルでAIを活用したコード支援を提供するDiscord Botです。

## 機能

- **コード解析**: DiscordメッセージでClaude Code SDKとやり取り
- **ファイル操作**: ワークスペース内のファイルの読み込み、一覧表示、解析
- **リアルタイム更新**: ツール実行の進捗をライブメッセージ更新で表示
- **権限管理**: ファイル編集の設定可能な権限モード

## 前提条件

- [Deno](https://deno.land/) ランタイム
- Discord Bot Token
- Claude Code SDK へのアクセス

## セットアップ

1. **リポジトリをクローン**
   ```bash
   git clone git@github.com:nozomi-hiragi/claude-code-sdk-on-discord-bot.git
   cd claude-code-sdk-on-discord-bot
   ```

2. **環境変数の設定**
   プロジェクトルートに `.env` ファイルを作成:
   ```env
   BOT_TOKEN=your_discord_bot_token
   APPLICATION_ID=your_discord_application_id  # オプション
   ```

3. **Discord アプリケーションの作成**
   - [Discord Developer Portal](https://discord.com/developers/applications) にアクセス
   - 新しいアプリケーションを作成
   - 「Bot」セクションに移動してBotを作成
   - Bot tokenを `.env` ファイルにコピー
   - 必要なBot権限とインテントを有効化

## 使用方法

### Botの起動

```bash
# 開発モード
deno task dev

# 本番モード  
deno task start
```

### Bot との対話

BotがDiscordサーバーに追加され実行されると、Botがアクセス可能なチャンネルでメッセージを送信できます。Botは以下の処理を行います：

1. メッセージをClaude Code SDKへのプロンプトとして処理
2. ツール実行の進捗をリアルタイムで表示
3. 結果とレスポンスを返却

対話例:
- "main.tsファイルを読んで"
- "現在のディレクトリのファイル一覧を表示"
- "コード構造を解析して"

## プロジェクト構造

```
claude-code-sdk-on-discord-bot/
├── main.ts           # BotエントリーポイントとDiscordクライアント設定
├── config.ts         # 環境変数の設定ローダー
├── messageParser.ts  # メッセージ処理とClaude Code SDK連携
├── deno.json        # Deno設定と依存関係
└── README.md        # このファイル
```

## 設定

### Bot権限

BotにはDiscordで以下のインテントが必要です：
- `Guilds` - ギルド情報へのアクセス
- `GuildMessages` - ギルド内メッセージの読み取り
- `MessageContent` - メッセージ内容へのアクセス
- `DirectMessages` - ダイレクトメッセージの処理

### Claude Code SDK オプション

Botは以下のSDK設定を使用します：
- `permissionMode: "acceptEdits"` - ファイル編集操作を許可
- リクエスト管理用のカスタムアボートコントローラー

## 依存関係

- **discord.js** (v14.21.0) - Discord APIラッパー
- **@anthropic-ai/claude-code** (v1.0.35) - Claude Code SDK
- **@std/dotenv** - 環境変数読み込み

## 開発

### テスト実行

```bash
deno test --allow-net --allow-env --allow-read
```

### コードフォーマット

```bash
deno fmt
```

### 型チェック

```bash
deno check main.ts
```

## コントリビューション

1. リポジトリをフォーク
2. 機能ブランチを作成
3. 変更を実装
4. 十分にテスト
5. プルリクエストを提出

## ライセンス

このプロジェクトは [Apache License 2.0](LICENSE) の下でライセンスされています。詳細については、LICENSEファイルをご確認ください。
