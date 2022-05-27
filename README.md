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

#### not supported

- create one-time tasks
- create weekly task
- create monthly tasks
- create yearly tasks

#### set timezone

- Default timezone is UTC+00
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

#### create weekly task

- /weekly example-task monday 1900

```ts
interface weekly_task {
  id: string;
  chat_id: string;
  name: string;
  day: number;
  hour: number;
  next: number;
}
```

#### show tasks

- /daily
- /weekly

#### remove tasks

- /delete example-task

#### Check

```js
const now = luxon.DateTime.now();

// if now is greater than next
// create notification
// update task.next

```