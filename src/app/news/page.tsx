type News = { id: number; date: string; title: string; body: string };

const news: News[] = [
  {
    id: 1,
    date: "2026-05-20",
    title: "サービスリニューアルのお知らせ",
    body: "5月20日よりトップページのデザインをリニューアルしました。",
  },
  {
    id: 2,
    date: "2026-05-15",
    title: "GWの営業について",
    body: "ゴールデンウィーク期間中（5/3〜5/6）はサポート対応をお休みします。",
  },
  {
    id: 3,
    date: "2026-05-01",
    title: "新機能「検索フィルター」をリリース",
    body: "キーワードでニュースを絞り込める検索フィルター機能を追加しました。",
  },
  {
    id: 4,
    date: "2026-04-20",
    title: "利用規約の改定について",
    body: "4月20日付けで利用規約を一部改定しました。詳細はページ下部をご確認ください。",
  },
  {
    id: 5,
    date: "2026-04-01",
    title: "新年度のご挨拶",
    body: "新年度が始まりました。今年度もよろしくお願いいたします。",
  },
];

export default function NewsPage() {
  return (
    <main>
      <h1>お知らせ</h1>
      <ul>
        {news.map((item) => (
          <li key={item.id}>
            <time dateTime={item.date}>{item.date}</time>
            <h2>{item.title}</h2>
            <p>{item.body}</p>
          </li>
        ))}
      </ul>
    </main>
  );
}
