# weaver

#### config

```json
{
  "http_port": 8080,
  "postgresql_host": "localhost",
  "postgresql_port": 5432,
  "postgresql_username": "postgres",
  "postgresql_password": "postgres",
  "postgresql_database": "postgres",
  "telegram_token": "example_token"
}
```

#### supported

- set timezone
- create daily task
- create weekly task

#### not supported

- create one-time tasks
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

- /remove example-task

#### Check

```js
const now = luxon.DateTime.now();

// if now is greater than next
// create notification
// update task.next

```