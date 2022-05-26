# weaver

#### Supported

- Timezones
- Daily tasks
- weekly tasks

#### Not supported

- One-time tasks
- Monthly tasks
- Yearly tasks

#### Timezone

- Default timezone is UTC
- /tz +8
- /tz -8

#### Daily Task

- /daily example-task 7pm

```ts
interface daily_task {
  id: string;
  chat_id: string;
  name: string;
  hour: number;
  next: number;
}
```

#### Weekly Task

- /weekly example-task monday 7pm

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

#### Check

```js
const now = luxon.DateTime.now();

// if now is greater than next
// create notification
// update task.next

```