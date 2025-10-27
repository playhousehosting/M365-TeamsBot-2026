const config = {
  MicrosoftAppId: process.env.CLIENT_ID,
  MicrosoftAppType: process.env.BOT_TYPE,
  MicrosoftAppTenantId: process.env.TENANT_ID,
  MicrosoftAppPassword: process.env.CLIENT_SECRET,
  openAIKey: process.env.OPENAI_API_KEY,
  openAIModelName: "gpt-4o", // Attempting GPT-4o - currently the most advanced available model
};

export default config;
