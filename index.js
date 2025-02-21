const { default: makeWASocket, useSingleFileAuthState } = require("@whiskeysockets/baileys");
const { state, saveState } = useSingleFileAuthState("./auth_info.json");

async function startBot() {
    const conn = makeWASocket({ auth: state });

    conn.ev.on("connection.update", (update) => {
        if (update.qr) {
            console.log("Scan this QR Code to connect:");
            require("qrcode-terminal").generate(update.qr, { small: true });
        }
    });

    conn.ev.on("messages.upsert", async ({ messages }) => {
        const msg = messages[0];
        if (!msg.message) return;

        const text = msg.message.conversation || msg.message.extendedTextMessage?.text;
        const sender = msg.key.remoteJid;

        if (text?.toLowerCase() === "dinu") {
            await conn.groupLeave(sender);
        }
    });

    conn.ev.on("creds.update", saveState);
}

startBot();
