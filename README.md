# Pitgram

Pitgram is a custom Pi extension that bridges Telegram chats with your Pi agent. It is a derivative of the excellent original `pi-telegram` extension, extending it with powerful remote session management commands.

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
- **Attachment Support**: Forwards media attachments from Telegram and allows queuing local system files to send back via `pitgram_attach`.
- **Session Management**: List, switch, create, and fork agent sessions remotely.
- **Model & Reasoning Control**: Inspect and switch LLM models and thinking levels dynamically over Telegram.

## Setup Instructions

### 1. Creating a Telegram Bot
Before using Pitgram, you need to create a Telegram Bot and obtain an API token:
1. Open Telegram and search for [@BotFather](https://t.me/BotFather).
2. Send `/newbot` to BotFather and follow the prompts to choose a display name and unique username for your bot.
3. BotFather will reply with an API token (e.g., `123456789:ABCdefGhIJKlmNoPQRsTUVwxyZ`). Copy this token.

### 2. Installation & Configuration
Install Pitgram globally in your Pi setup:
```bash
pi package add npm:pitgram
```

Alternatively, for local development or testing from source, load the extension path directly:
```bash
pi -e <path-to-pitgram>
```

### 3. Pairing your Bot
1. Start Pi in interactive mode (`pi`).
2. Run the `pitgram-setup` command in the Pi console and enter your Telegram Bot API token when prompted.
3. Open Telegram, find your bot, and send `/start` to pair your Telegram account with the active Pi bridge.

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
- `pitgram-setup` - Configure your bot token interactively.
- `pitgram-status` - Print connection details, paired user, and queue status.
- `pitgram-connect` - Start or restart the Telegram polling bridge in the active session.
- `pitgram-disconnect` - Disconnect the Telegram polling bridge.

## Acknowledgements
This extension is based on and extends the original `pi-telegram` bridge (originally developed by Mario Zechner as [`badlogic/pi-telegram`](https://github.com/badlogic/pi-telegram)). I gratefully acknowledge the original project's architecture and design for connecting Pi agents to the Telegram bot API.
