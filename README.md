# weaver

- https://t.me/weavery_bot

```
Welcome to Weaver bot.

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
- default time zone is UTC+0.
- set your time zone before creating tasks.
- task-names must be in kebab-case-format.
- hhmm is in military time format, 0000 to 2359.
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

- create one-time tasks
- create weekly task
- create monthly tasks
- create yearly tasks

#### License

MIT