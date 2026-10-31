export interface SystemStatus {
  systemName: string;
  version: string;
  status: string;
  environment: string;
  javaVersion: string;
  serverTime: string;
  databaseConnected: boolean;
  availableModules: string[];
  statistics: {
    jvmMemoryFreeMB?: number;
    jvmMemoryTotalMB?: number;
    availableProcessors?: number;
    [key: string]: any;
  };
}
