
const express = require('express');
const axios = require('axios');
const TelegramBot = require('node-telegram-bot-api');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 10000;


const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const CHANNEL_ID = process.env.CHANNEL_ID;

const CRYPTO_API_URL = 'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=bitcoin,solana,official-trump,nodecoin&order=market_cap_desc';

const bot = new TelegramBot(TELEGRAM_BOT_TOKEN, { polling: false });

async function fetchAndPostPrices() {
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

👊 @${CHANNEL_ID} join US ⚡️
🤑 #BTC #TRUMP #SOL #NODECOIN
`;

    await bot.sendMessage(CHANNEL_ID, message, { parse_mode: 'Markdown' });
  } catch (error) {
    console.error('Error fetching prices:', error.message);
    await bot.sendMessage(CHANNEL_ID, '⚠️ Error fetching crypto prices. Please try again later.');
  }
}


setInterval(fetchAndPostPrices, 60000);



app.listen(port, () => {
   console.log(`Server is running on ${port}`);
});


fetchAndPostPrices();

module.exports = app;