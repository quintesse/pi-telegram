# pi-telegram

pi-telegram is a fork of [pitgram](https://github.com/raghavbali/pitgram).

pi-telegram is a custom Pi extension that bridges Telegram chats with your Pi agent. It is a derivative of the original `pi-telegram` extension, extended with remote session management commands.

## Screenshots

![Telegram Chat Overview](https://raw.githubusercontent.com/raghavbali/pitgram/main/assets/screenshot1.png)
*Checking status, retrieving settings summary, and interacting with Pi via Telegram.*

![Reasoning & Thinking Updates](https://raw.githubusercontent.com/raghavbali/pitgram/main/assets/screenshot2.png)
*Changing reasoning thinking levels remotely and receiving detailed responses.*

![Remote Session Management](https://raw.githubusercontent.com/raghavbali/pitgram/main/assets/screenshot3.png)
*Creating and managing sessions remotely using /new.*

## Features
- **Remote Polling Loop**: Continues running seamlessly across session swaps.
- **Typing Indicators & Draft Previews**: Sends typing status updates and real-time draft edits to Telegram.
- **Attachment Support**: Forwards media attachments from Telegram and allows queuing local system files to send back via `telegram_attach`.
- **Session Management**: List, switch, create, and fork agent sessions remotely.
- **Model & Reasoning Control**: Inspect and switch LLM models and thinking levels dynamically over Telegram.

## Setup Instructions

### 1. Creating a Telegram Bot
Before using pi-telegram, you need to create a Telegram Bot and obtain an API token:
1. Open Telegram and search for [@BotFather](https://t.me/BotFather).
2. Send `/newbot` to BotFather and follow the prompts to choose a display name and unique username for your bot.
3. BotFather will reply with an API token (e.g., `123456789:ABCdefGhIJKlmNoPQRsTUVwxyZ`). Copy this token.

### 2. Installation & Configuration
Install pi-telegram globally in your Pi setup:
```bash
pi package add npm:pi-telegram
```

Alternatively, for local development or testing from source, load the extension path directly:
```bash
pi -e <path-to-pi-telegram>
```

### 3. Pairing your Bot
1. Start Pi in interactive mode (`pi`).
2. Run the `telegram-setup` command in the Pi console and enter your Telegram Bot API token when prompted.
3. Open Telegram, find your bot, and send `/start` to pair your Telegram account with the active Pi bridge.

## Sending messages and attachments

### Send text

Send any message in the bot DM. It is forwarded into pi with a `[telegram]` prefix.

### Send images, voice notes, and files

Send images, voice notes, albums, or files in the DM.

The extension:
- downloads them to `~/.pi/agent/tmp/telegram`
- includes local file paths in the prompt
- forwards inbound images as image inputs to pi
- forwards voice/audio attachments so pi can transcribe them with a tool such as `transcribe_audio`

To make voice notes work well, install a local transcription extension such as `pi-whisper`, then reload pi.

### Ask for files back

If you ask pi for a file or generated artifact, pi should call the `telegram_attach` tool. The extension then sends those files with the next Telegram reply.

## Commands

### Telegram Bot Commands
Send these commands directly to your paired Telegram bot:
- `/sessions` - List all sessions in the agent's current working directory.
- `/switch <index|path|id>` - Switch active session (resolved by index from `/sessions` or by direct path/ID).
- `/new [name]` - Create and switch to a new session (optionally named).
- `/fork` (or `/clone`) - Fork the active session at the current leaf index.
- `/model [index|name]` - Show available models or switch the active LLM model.
- `/thinking [level]` - Show available thinking levels or set the reasoning level (e.g., off, minimal, low, medium, high, xhigh).
- `/settings` - Show current session settings (active model, thinking level, enabled tools, working directory).
- `/status` - Retrieve context window size, tokens, and billing cost stats.
- `/compact` - Manually trigger context compaction.
- `stop` (or `/stop`) - Abort the active agent reasoning turn.

### Local TUI Commands
Type these commands in the local Pi console:
- `telegram-setup` - Configure your bot token interactively.
- `telegram-status` - Print connection details, paired user, and queue status.
- `telegram-connect` - Start or restart the Telegram polling bridge in the active session.
- `telegram-disconnect` - Disconnect the Telegram polling bridge.

## Acknowledgements
This extension is based on and extends the original `pi-telegram` bridge (originally developed by Mario Zechner as [`badlogic/pi-telegram`](https://github.com/badlogic/pi-telegram)). I gratefully acknowledge the original project's architecture and design for connecting Pi agents to the Telegram bot API.
