export default async function handler(req, res) {
  // Support GET and POST
  let text = '';
  let from = 'de';
  let to = 'nl';

  if (req.method === 'POST') {
    let body = req.body;
    if (typeof body === 'string') {
      try {
        body = JSON.parse(body);
      } catch (e) {
        // ignore
      }
    }
    text = body?.text || '';
    from = body?.from || 'de';
    to = body?.to || 'nl';
  } else {
    text = req.query?.text || '';
    from = req.query?.from || 'de';
    to = req.query?.to || 'nl';
  }

  if (!text || typeof text !== 'string') {
    return res.status(400).json({ error: 'Text parameter is required' });
  }

  try {
    const upstreamUrl = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${encodeURIComponent(from)}&tl=${encodeURIComponent(to)}&dt=t`;
    const response = await fetch(upstreamUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
      },
      body: new URLSearchParams({ q: text })
    });

    if (!response.ok) {
      return res.status(response.status).json({ error: `Translation upstream error ${response.status}` });
    }

    const data = await response.json();
    const translatedText = Array.isArray(data[0]) 
      ? data[0].map(s => s[0]).join('')
      : text;

    res.setHeader('Cache-Control', 's-maxage=86400, stale-while-revalidate=604800');
    return res.status(200).json({ translatedText });
  } catch (err) {
    console.error('Translation error:', err);
    return res.status(500).json({ error: err.message });
  }
}
