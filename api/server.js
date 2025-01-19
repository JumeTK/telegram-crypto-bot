const express = require('express');
const axios = require('axios');
const TelegramBot = require('node-telegram-bot-api');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

// Environment Variables - CRUCIAL: Set these in your Render Dashboard!
const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const CHANNEL_ID = process.env.CHANNEL_ID; // Make sure this is the correct CHAT ID (not the @username)

// CoinGecko API URL
const CRYPTO_API_URL = 'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=bitcoin,solana,official-trump,nodecoin&order=market_cap_desc';

// Initialize the Telegram Bot
let bot;
try {
    bot = new TelegramBot(TELEGRAM_BOT_TOKEN, { polling: false });
    console.log("Telegram bot initialized successfully.");
} catch (botError) {
    console.error("Error initializing Telegram bot:", botError.message);
    process.exit(1); // Exit if the bot can't be initialized
}



async function fetchAndPostPrices() {
    if (!CHANNEL_ID) {
        console.error("CHANNEL_ID environment variable is not set!");
        return; // Important: Exit the function if CHANNEL_ID is missing
    }
    try {
        const response = await axios.get(CRYPTO_API_URL);
        const prices = response.data;

        const message = `
💰 **Crypto Prices & Market Caps** 💰

🟢 **Bitcoin (BTC):**
  - Price: \`$${prices[0]?.current_price || 'N/A'}\`
  - Market Cap: \`${prices[0]?.market_cap?.toLocaleString() || 'N/A'}\`

📈 **Solana (SOL):**
  - Price: \`$${prices[1]?.current_price || 'N/A'}\`
  - Market Cap: \`${prices[1]?.market_cap?.toLocaleString() || 'N/A'}\`

🟢 **Official Trump (TRUMP):**
  - Price: \`$${prices[2]?.current_price || 'N/A'}\`
  - Market Cap: \`${prices[2]?.market_cap?.toLocaleString() || 'N/A'}\`

🔴 **Node Coin (NC):**
  - Price: \`$${prices[3]?.current_price || 'N/A'}\`
  - Market Cap: \`${prices[3]?.market_cap?.toLocaleString() || 'N/A'}\`

➖➖➖➖

👊 Join us! ⚡️
🤑 #BTC #TRUMP #SOL #NODECOIN
`;

        await bot.sendMessage(CHANNEL_ID, message, { parse_mode: 'Markdown' })
            .then(() => console.log("Message sent successfully."))
            .catch((telegramError) => console.error("Error sending Telegram message:", telegramError));

    } catch (error) {
        console.error('Error fetching prices from CoinGecko:', error.message);
        try {
            await bot.sendMessage(CHANNEL_ID, '⚠️ Error fetching crypto prices. Please try again later.');
        } catch (telegramError){
            console.error("Error sending Telegram error message:", telegramError)
        }
    }
}

// Fetch and post crypto prices every minute
setInterval(fetchAndPostPrices, 60000);

// Initial call
fetchAndPostPrices();

app.listen(port, '0.0.0.0', () => {
    console.log(`Server is running on http://0.0.0.0:${port}`);
});

module.exports = app;