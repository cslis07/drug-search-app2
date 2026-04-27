// api/biz.js - bizno.net 프록시 함수
// Vercel 서버에서 bizno.net을 호출해서 CORS 문제 우회

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const { company } = req.query;

  if (!company) {
    return res.status(400).json({ error: '병원명이 필요합니다.' });
  }

  const BIZNO_KEY = 'IcbnGhSMGT9rEc5OKTzrlTBoIwdN';
  const url = `https://bizno.net/api/fapi?key=${BIZNO_KEY}&company=${encodeURIComponent(company)}&type=json&pagecnt=1`;

  try {
    const response = await fetch(url, {
      headers: { 'User-Agent': 'Mozilla/5.0' }
    });

    if (!response.ok) {
      return res.status(502).json({ error: 'bizno 응답 오류', status: response.status });
    }

    const text = await response.text();

    try {
      const data = JSON.parse(text);
      return res.status(200).json(data);
    } catch (e) {
      return res.status(200).send(text);
    }

  } catch (err) {
    return res.status(500).json({ error: '조회 실패', detail: err.message });
  }
}
