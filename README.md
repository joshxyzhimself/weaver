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

#### Configuration

- config.json

```json
{
  "http_hostname": "XXX",
  "http_port": 8080,
  "telegram_token": "XXX"
}
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

#### Database

- offsets and tasks are saved to & loaded from JSON files.

#### Deployment

- PM2 for process management.
- Caddy for TLS.

#### Credits

- https://unsplash.com/photos/6cgqD95Cfi8
- Photo by Reza Delkhosh, used as bot pic.

#### License

MIT