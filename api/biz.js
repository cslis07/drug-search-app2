// api/biz.js - bizno.net 프록시 함수

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  if (req.method === 'OPTIONS') return res.status(200).end();

  const { company } = req.query;
  if (!company) return res.status(400).json({ error: '병원명이 필요합니다.' });

  const BIZNO_KEY = 'IcbnGhSMGT9rEc5OKTzrlTBoIwdN';

  /* bizno fapi 파라미터: txt 또는 cmpnm 으로 상호명 검색 */
  const params = new URLSearchParams({
    key:     BIZNO_KEY,
    type:    'json',
    pagecnt: '1',
    cmpnm:   company   /* 상호명 검색 파라미터 */
  });

  const url = `https://bizno.net/api/fapi?${params.toString()}`;

  try {
    const response = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0' } });
    const text = await response.text();
    console.log('[biz.js] URL:', url);
    console.log('[biz.js] 응답:', text.substring(0, 200));

    try {
      return res.status(200).json(JSON.parse(text));
    } catch {
      return res.status(200).send(text);
    }
  } catch (err) {
    return res.status(500).json({ error: '조회 실패', detail: err.message });
  }
}
