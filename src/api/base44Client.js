import { createClient } from '@base44/sdk';
import { appParams, hasBase44Config } from '@/lib/app-params';

const { appId, token, functionsVersion, appBaseUrl } = appParams;

const disabledBase44Client = {
  auth: {
    me: async () => {
      throw new Error('Base44 is not configured.');
    },
    logout: () => {},
    redirectToLogin: () => {},
  },
};

// Only initialize the real SDK client when the required config is present.
export const base44 = hasBase44Config
  ? createClient({
      appId,
      token,
      functionsVersion,
      serverUrl: '',
      requiresAuth: false,
      appBaseUrl,
    })
  : disabledBase44Client;
