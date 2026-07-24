import test from "node:test";
import assert from "node:assert/strict";
import {
	isTelegramPrompt,
	sanitizeFileName,
	guessExtensionFromMime,
	guessMediaType,
	isImageMimeType,
	formatTokens,
	chunkParagraphs,
	hasSessionCommands,
	resolveCommandContext,
} from "../dist/index.js";

test("isTelegramPrompt identifies telegram prompt prefix", () => {
	assert.equal(isTelegramPrompt("[telegram] hello world"), true);
	assert.equal(isTelegramPrompt("  [telegram]\nLine 2"), true);
	assert.equal(isTelegramPrompt("hello world"), false);
});

test("sanitizeFileName strips invalid characters", () => {
	assert.equal(sanitizeFileName("file name with spaces & special!chars?.png"), "file_name_with_spaces_special_chars_.png");
	assert.equal(sanitizeFileName("valid-file_123.jpg"), "valid-file_123.jpg");
});

test("guessExtensionFromMime maps MIME types to extensions", () => {
	assert.equal(guessExtensionFromMime("image/jpeg", ".dat"), ".jpg");
	assert.equal(guessExtensionFromMime("image/png", ".dat"), ".png");
	assert.equal(guessExtensionFromMime("audio/mpeg", ".dat"), ".mp3");
	assert.equal(guessExtensionFromMime("application/pdf", ".dat"), ".pdf");
	assert.equal(guessExtensionFromMime(undefined, ".txt"), ".txt");
});

test("guessMediaType identifies media types from paths", () => {
	assert.equal(guessMediaType("photo.jpg"), "image/jpeg");
	assert.equal(guessMediaType("IMAGE.PNG"), "image/png");
	assert.equal(guessMediaType("document.pdf"), undefined);
});

test("isImageMimeType correctly checks for image prefix", () => {
	assert.equal(isImageMimeType("image/webp"), true);
	assert.equal(isImageMimeType("application/json"), false);
	assert.equal(isImageMimeType(undefined), false);
});

test("formatTokens formats token counts into human readable strings", () => {
	assert.equal(formatTokens(500), "500");
	assert.equal(formatTokens(2500), "2.5k");
	assert.equal(formatTokens(45000), "45k");
	assert.equal(formatTokens(2500000), "2.5M");
});

test("chunkParagraphs splits large text blocks cleanly", () => {
	const shortText = "Hello world";
	assert.deepEqual(chunkParagraphs(shortText), ["Hello world"]);

	const paragraph1 = "A".repeat(2500);
	const paragraph2 = "B".repeat(2000);
	const combined = `${paragraph1}\n\n${paragraph2}`;
	const chunks = chunkParagraphs(combined);
	assert.equal(chunks.length, 2);
	assert.equal(chunks[0], paragraph1);
	assert.equal(chunks[1], paragraph2);
});

test("resolveCommandContext prefers the runner with command bindings", () => {
	const fallbackCtx: any = { source: "fallback" };
	const activeOnlyCtx: any = {
		source: "active",
		newSession: async () => ({ cancelled: false }),
		fork: async () => ({ cancelled: false }),
		switchSession: async () => ({ cancelled: false }),
		reload: async () => {},
	};
	const commandCtx: any = {
		source: "command",
		newSession: async () => ({ cancelled: false }),
		fork: async () => ({ cancelled: false }),
		switchSession: async () => ({ cancelled: false }),
		reload: async () => {},
	};

	assert.equal(hasSessionCommands(fallbackCtx), false);
	assert.equal(hasSessionCommands(activeOnlyCtx), true);
	assert.equal(
		resolveCommandContext(fallbackCtx, {
			commandRunner: { createCommandContext: () => commandCtx },
			activeRunner: { createCommandContext: () => activeOnlyCtx },
		}),
		commandCtx,
	);
	assert.equal(
		resolveCommandContext(fallbackCtx, {
			activeRunner: { createCommandContext: () => activeOnlyCtx },
		}),
		activeOnlyCtx,
	);
	assert.equal(resolveCommandContext(fallbackCtx), fallbackCtx);
});

test("telegram-connect and telegram-disconnect commands emit terminal notifications", async () => {
	const pitgramExtensionModule = await import("../dist/index.js");
	const pitgramExtension = pitgramExtensionModule.default;

	const commands = new Map<string, any>();
	const mockApi: any = {
		on: () => {},
		registerTool: () => {},
		registerCommand: (name: string, options: any) => {
			commands.set(name, options);
		},
	};

	pitgramExtension(mockApi);

	assert.equal(commands.has("telegram-connect"), true);
	assert.equal(commands.has("telegram-disconnect"), true);

	const notifications: Array<{ message: string; type: string }> = [];
	const mockCtx: any = {
		ui: {
			notify: (message: string, type: string) => {
				notifications.push({ message, type });
			},
			setStatus: () => {},
			theme: { fg: (_color: string, text: string) => text },
		},
	};

	const connectCmd = commands.get("telegram-connect");
	await connectCmd.handler("", mockCtx);
	assert.equal(notifications.length > 0, true);

	const disconnectCmd = commands.get("telegram-disconnect");
	await disconnectCmd.handler("", mockCtx);
	assert.equal(notifications.length > 1, true);
	assert.equal(notifications.some((n) => n.message.includes("disconnected")), true);
});
