const express = require('express');
const axios = require('axios');
const { Telegraf } = require('telegraf');
const Sentiment = require('sentiment');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;
const sentiment = new Sentiment();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

let telegramData = {
  botToken: '',
  chatId: '',
  messages: []
};

let bot = null;

app.post('/api/setup-bot', async (req, res) => {
  const { botToken, chatId } = req.body;
  try {
    if (bot) bot.stop();
    telegramData.botToken = botToken;
    telegramData.chatId = chatId;
    bot = new Telegraf(botToken);
    bot.on('text', (ctx) => {
      const message = ctx.message.text;
      const result = sentiment.analyze(message);
      const label = result.score > 0 ? 'positive' : result.score < 0 ? 'negative' : 'neutral';
      telegramData.messages.push({ text: message, sentiment: label });
      let reply = label === 'positive' ? 'Thanks for the positivity!' :
                  label === 'negative' ? 'Sorry to hear that.' :
                  'Message received.';
      ctx.reply(reply);
    });
    await bot.launch();
    res.json({ success: true, message: 'Bot connected!' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Connection failed' });
  }
});

app.get('/api/messages', (req, res) => {
  res.json(telegramData.messages);
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});