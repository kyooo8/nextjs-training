export type User = {
  id: string;
  name: string;
  imgUrl: string;
  age: number;
  introduction_text: string;
};

export type Profiles = User & { user_id: string };

export const users: User[] = [
  {
    id: "1",
    name: "test1",
    imgUrl: "gorogoro_man.webp",
    age: 24,
    introduction_text: "よろしく",
  },
  {
    id: "2",
    name: "test2",
    imgUrl: "mabuta_man.webp",
    age: 24,
    introduction_text: "ハロー",
  },
  {
    id: "3",
    name: "test3",
    imgUrl: "mukiryoku_man.webp",
    age: 24,
    introduction_text: "ねむい",
  },
  {
    id: "4",
    name: "test4",
    imgUrl: "onsen_man.webp",
    age: 24,
    introduction_text: "温泉が好きです",
  },
];

export const me: User = {
  id: "99",
  name: "medesu",
  imgUrl: "onsen_man.webp",
  age: 30,
  introduction_text: "初めてやります",
};

export const profiles: Profiles[] = [
  {
    id: "1",
    name: "me",
    imgUrl: "onsen_man.webp",
    age: 24,
    introduction_text: "アイスが好き",
    user_id: "99",
  },
  {
    id: "2",
    name: "me",
    imgUrl: "onsen_man.webp",
    age: 24,
    introduction_text: "こんにちは仲良くしたい",
    user_id: "99",
  },
  {
    id: "3",
    name: "me",
    imgUrl: "onsen_man.webp",
    age: 24,
    introduction_text: "公園に行きたい",
    user_id: "99",
  },
  {
    id: "4",
    name: "me",
    imgUrl: "onsen_man.webp",
    age: 24,
    introduction_text: "アイスが好き",
    user_id: "99",
  },
  {
    id: "5",
    name: "me",
    imgUrl: "onsen_man.webp",
    age: 24,
    introduction_text: "こんにちは仲良くしたい",
    user_id: "99",
  },
  {
    id: "6",
    name: "me",
    imgUrl: "onsen_man.webp",
    age: 24,
    introduction_text: "公園に行きたい",
    user_id: "99",
  },
];
