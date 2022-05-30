# weaver

- https://t.me/weavery_bot

```
Welcome to Weaver bot.

Telegram bot for daily tasks. For personal and team use.

Commands:
/start - shows this intro
/tz - show current time zone
/tz [offset] - set current time zone
/create [task-name] [hhmm] - create daily task
/delete [task-name] - delete daily task
/list - list daily tasks

Examples:
/start
/tz
/tz +8
/create example-task 0700
/delete example-task
/list

Notes:
- default tz offset is UTC+0.
- set your tz offset before creating tasks.
- task-name must be in kebab-case-format.
- hhmm is in military time format, 0000 to 2359.
- for personal use, message the bot.
- for team use, add the bot to your group. 
```

#### Supported

- set timezone
- create daily task
- delete daily task
- list daily tasks

#### Not supported

- one-time tasks
- weekly task
- monthly tasks
- yearly tasks

#### Configuration

- config.json

```json
{
  "http_hostname": "weaver.jxyz.me",
  "http_port": 9090,
  "telegram_token": "XXX"
}
```

#### TLS

- /etc/caddy/Caddyfile

```
{
  log {
    output file /var/log/access.log
    format json
  }
}

weaver.jxyz.me {
  handle {
    header {
      Cache-Control "no-cache"
      Strict-Transport-Security "max-age=63072000"
      defer
    }
    encode gzip
    reverse_proxy 0.0.0.0:9090
  }
  tls joshxyzhimself@gmail.com {
    protocols tls1.2 tls1.3
    ciphers TLS_ECDHE_ECDSA_WITH_AES_128_GCM_SHA256 TLS_ECDHE_RSA_WITH_AES_128_GCM_SHA256 TLS_ECDHE_ECDSA_WITH_AES_256_GCM_SHA384 TLS_ECDHE_RSA_WITH_AES_256_GCM_SHA384 TLS_ECDHE_ECDSA_WITH_CHACHA20_POLY1305_SHA256 TLS_ECDHE_RSA_WITH_CHACHA20_POLY1305_SHA256
  }
}
```

#### Dependencies

```sh
npm install @jxyz/modules@github:joshxyzhimself/modules#v1.2.0
```

#### Initialization

```sh
node ./index.mjs
pm2 start ./index.mjs --name=weaver
```

#### Database

- offsets and tasks are saved to & loaded from JSON files.

#### Deployment

- PM2 for process management.
- Caddy for TLS.

#### Credits

- https://unsplash.com/photos/6cgqD95Cfi8
- Photo by Reza Delkhosh, used as bot pic.

#### Minor Latency Issues

- Telegram data centers are located at Germany. Weaver bot data centers are located at Singapore.
- Weaver bot does not create requests in response to updates from webhooks. [[1]](https://core.telegram.org/bots/faq#how-can-i-make-requests-in-response-to-updates)

#### License

MIT