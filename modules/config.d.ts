export interface config {
  port: number;
  postgresql_host: string;
  postgresql_port: number;
  postgresql_username: string;
  postgresql_password: string;
  postgresql_database: string;
}

export const config: config;