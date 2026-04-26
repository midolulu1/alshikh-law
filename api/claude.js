// api/claude.js - Vercel Serverless Function
// ضع هذا الملف في مجلد /api في مشروع Vercel
 
export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
 
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
 
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
 
  const { question } = req.body;
  if (!question) {
    return res.status(400).json({ error: 'Question is required' });
  }
 
  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY, // ← ضع مفتاحك في Vercel Environment Variables
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 1500,
        system: 'أنت مستشار قانوني متخصص في الأنظمة واللوائح السعودية. أجب بشكل مفصل ومنظم مع الاستشهاد بالمواد القانونية. اكتب بالعربية فقط.',
        messages: [{
          role: 'user',
          content: 'سؤال من مكتب محمد عبدالمحسن الشيخ للمحاماة:\n\n' + question
        }]
      })
    });
 
    const data = await response.json();
    const answer = data.content?.[0]?.text || 'لم يتم الحصول على إجابة';
    
    return res.status(200).json({ answer });
 
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
