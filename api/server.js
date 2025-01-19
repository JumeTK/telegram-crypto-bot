const TelegramBot = require('node-telegram-bot-api');
const axios = require('axios');
require('dotenv').config();

// Telegram Bot Token from environment variable
const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const CHANNEL_ID = '@trumpXbtc24';

// CoinGecko API URL for fetching specific coins' prices and market caps
const CRYPTO_API_URL = 'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=bitcoin,solana,official-trump,nodecoin&order=market_cap_desc';

const bot = new TelegramBot(TELEGRAM_BOT_TOKEN, { polling: false });

async function fetchAndPostPrices() {
    try {
        // Fetch prices and market cap data from CoinGecko API
        const response = await axios.get(CRYPTO_API_URL);
        const prices = response.data;

        // Format the message using HTML for better readability with bold coin names
        const message = `
💰 <b>Crypto Prices & Market Caps</b> 💰

🟢 <b>Bitcoin (BTC):</b>
   - Price: <code>${prices[0]?.current_price || 'N/A'}</code>
   - Market Cap: <code>${prices[0]?.market_cap?.toLocaleString() || 'N/A'}</code>

📈 <b>Solana (SOL):</b>
   - Price: <code>${prices[1]?.current_price || 'N/A'}</code>
   - Market Cap: <code>${prices[1]?.market_cap?.toLocaleString() || 'N/A'}</code>

🟢 <b>Official Trump (TRUMP):</b>
   - Price: <code>${prices[2]?.current_price || 'N/A'}</code>
   - Market Cap: <code>${prices[2]?.market_cap?.toLocaleString() || 'N/A'}</code>

🔴 <b>Node Coin (NC):</b>
   - Price: <code>${prices[3]?.current_price || 'N/A'}</code>
   - Market Cap: <code>${prices[3]?.market_cap?.toLocaleString() || 'N/A'}</code>
        
   <b>➖➖➖➖</b>

<b>👊 @trumpXbtc24 join US ⚡️</b>
<b>🤑 #BTC #TRUMP #SOL #NODECOIN</b>
   `;

        // Send the message to your Telegram channel with HTML parsing
        await bot.sendMessage(CHANNEL_ID, message.trim(), { parse_mode: 'HTML' });

    } catch (error) {
        console.error('Error fetching prices:', error.message);
        await bot.sendMessage(CHANNEL_ID, '⚠️ Error fetching crypto prices. Please try again later.');
    }
}

// Fetch and post crypto prices every minute (60000ms)
// setInterval(fetchAndPostPrices, 60000);

// // Initially post the prices as soon as the bot starts
//  fetchAndPostPrices();

// Define the Vercel serverless function handler
module.exports = async (req, res) => {
   await fetchAndPostPrices();
   res.status(200).send("Bot is running.");
};


