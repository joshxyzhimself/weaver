# weaver

#### Overview

- For scheduling daily tasks
- For weekly tasks

#### Timezone

- Default timezone is UTC
- /tz +8
- /tz -8

#### Task

- /daily example-task 7pm
- /weekly example-task monday
- /monthly

##### Schemas

```ts
interface daily_task {
  id: string;
  chat_id: string;
  name: string;
  hour: number;
}
interface weekly_task {
  id: string;
  chat_id: string;
  name: string;
  day: number;
}
interface monthly_task {
  id: string;
  chat_id: string;
  name: string;
  week: number;
}
```

#### Check

```js
const now = luxon.DateTime.now();
```