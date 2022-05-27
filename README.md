# weaver

#### config

```json
{
  "http_hostname": "XXX",
  "http_port": 8080,
  "telegram_token": "XXX"
}
```

#### supported

- set timezone
- create daily task
- delete daily task
- list daily tasks

#### not supported

- create one-time tasks
- create weekly task
- create monthly tasks
- create yearly tasks

#### set timezone

- Default timezone is UTC+0
- /tz +08
- /tz -08

#### create daily task

- /daily example-task 1900

```ts
interface daily_task {
  id: string;
  chat_id: string;
  name: string;
  hour: number;
  next: number;
}
```

#### delete daily task

- /delete example-task

#### list daily tasks

- /list

#### license

MIT