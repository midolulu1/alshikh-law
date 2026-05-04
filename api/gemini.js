export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', 'https://alshikh-law.vercel.app');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).end();

  const { question } = req.body;
  if (!question) return res.status(400).json({ error: 'No question' });

  const KEY = process.env.GEMINI_API_KEY;
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${KEY}`;

  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: 
        'أنت مستشار قانوني متخصص في الأنظمة السعودية. أجب بالعربية فقط بشكل مفصل مع الاستشهاد بالمواد القانونية.\n\nسؤال من مكتب محمد عبدالمحسن الشيخ للمحاماة:\n\n' + question 
      }] }],
      generationConfig: { maxOutputTokens: 1500, temperature: 0.3 }
    })
  });

  const data = await response.json();
  const answer = data.candidates?.[0]?.content?.parts?.[0]?.text || 'لم يتم الحصول على إجابة';
  return res.status(200).json({ answer });
}
