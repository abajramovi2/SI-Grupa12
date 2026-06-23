type RuntimeConfig = {
  apiUrl?: string;
  keycloakUrl?: string;
};

const runtimeConfig = (
  globalThis as typeof globalThis & { __TIM12_CONFIG__?: RuntimeConfig }
).__TIM12_CONFIG__ || {};

export const environment = {
  production: true,
  apiUrl: runtimeConfig.apiUrl || 'https://backend-production-5561.up.railway.app/api',
  keycloakUrl: runtimeConfig.keycloakUrl || ''
};
