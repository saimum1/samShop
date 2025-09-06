// config.tsx
const config = {
  apiUrl: process.env.NEXT_PUBLIC_API_URL || "default-url",
  apiUrlWebSocket: process.env.NEXT_PUBLIC_API_URL_WEBSOCKET || "default-url",
};

export default config;
