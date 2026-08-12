export type DataMode = 'mock' | 'api';

interface EnvConfig {
  dataMode: DataMode;
  apiBaseUrl: string;
}

const getEnvConfig = (): EnvConfig => {
  const dataMode = (process.env.NEXT_PUBLIC_DATA_MODE as DataMode) || 'mock';
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || '';

  if (dataMode === 'api' && !apiBaseUrl) {
    console.warn("WARNING: NEXT_PUBLIC_DATA_MODE is 'api' but NEXT_PUBLIC_API_BASE_URL is missing.");
  }

  return {
    dataMode,
    apiBaseUrl,
  };
};

export const env = getEnvConfig();
