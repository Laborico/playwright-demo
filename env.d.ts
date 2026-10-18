declare global {
  namespace NodeJS {
    interface ProcessEnv {
      UI_BASE_URL: string;
      UI_STANDARD_USER: string;
      UI_LOCKEDOUT_USER: string;
      UI_PASSWORD: string;
      API_BASE_URL: string;
      API_USERNAME: string;
      API_PASSWORD: string;
    }
  }
}

export {};
