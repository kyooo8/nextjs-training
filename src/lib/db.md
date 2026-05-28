## Users

| 名前              | 型           | その他                   |
| ----------------- | ------------ | ------------------------ |
| id                | number       | not null, auto increment |
| name              | string       | not null                 |
| age               | number       | not null                 |
| imgUrl            | string       |                          |
| introduction_text | text         |                          |
| edited_at         | timestamp_tz |                          |
| created_at        | timestamp_tz |                          |

## Owners

| 名前              | 型           | その他           |
| ----------------- | ------------ | ---------------- |
| id                | string       | not null, unique |
| name              | string       | not null         |
| age               | number       | not null         |
| imgUrl            | string       |                  |
| introduction_text | text         |                  |
| edited_at         | timestamp_tz |                  |
| created_at        | timestamp_tz |                  |

## Profiles

| 名前              | 型           | その他                          |
| ----------------- | ------------ | ------------------------------- |
| id                | number       | not null, auto increment        |
| name              | string       | not null                        |
| age               | number       | not null                        |
| imgUrl            | string       |                                 |
| introduction_text | text         |                                 |
| owner_id          | string       | not null, foreginKey(Owners.id) |
| edited_at         | timestamp_tz |                                 |
| created_at        | timestamp_tz |                                 |

## Likes

| 名前       | 型           | その他                            |
| ---------- | ------------ | --------------------------------- |
| id         | number       | not null, auto increment          |
| user_id    | number       | not null ,foreginKey(Users.id)    |
| profile_id | number       | not null ,foreginKey(Profiles.id) |
| created_at | timestamp_tz |                                   |

## Questionnaire

| 名前       | 型           | その他                            |
| ---------- | ------------ | --------------------------------- |
| id         | number       | not null, auto increment          |
| user_id    | number       | not null ,foreginKey(Users.id)    |
| profile_id | number       | not null, foreginKey(Profiles.id) |
| answers    | json         | not null,                         |
| matchScore | number       |                                   |
| created_at | timestamp_tz |                                   |

## ViewLog

| 名前       | 型           | その他                            |
| ---------- | ------------ | --------------------------------- |
| id         | number       | not null, auto increment          |
| user_id    | number       | not null, foreginKey(Users.id)    |
| profile_id | number       | not null, foreginKey(Profiles.id) |
| created_at | timestamp_tz |                                   |
