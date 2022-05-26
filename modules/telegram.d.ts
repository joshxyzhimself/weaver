export type endpoint = (token: string, method: string) => string;
export const endpoint: create_endpoint;

export type post = (url: string, body: any) => Promise<any>;
export const post: post;

export interface send_message_body {
  chat_id: number;
  text: string;
  parse_mode?: string;
  [key: string]: any;
}
export type send_message = (token: string, body: send_message_body) => Promise<any>;
export const send_message: send_message;

export interface delete_message_body {
  chat_id: number;
  message_id: number;
  [key: string]: any;
}
export type delete_message = (token: string, body: delete_message_body) => Promise<any>;
export const delete_message: delete_message;

export interface set_webhook_body {
  url: string;
  max_connections: number;
  allowed_updates: string[];
  [key: string]: any;
}
export type set_webhook = (token: string, body: set_webhook_body) => Promise<any>;
export const set_webhook: set_webhook;

export type delete_webhook = (token: string) => Promise<any>;
export const delete_webhook: delete_webhook;

export type code = (value: string) => string;
export type text = (value: string) => string;
export type url = (value: string) => string;