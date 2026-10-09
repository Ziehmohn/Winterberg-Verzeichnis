import { sendMail } from './_mail.js';  
export default async function handler(req, res) {  
  if (req.method !== 'POST') return res.status(405).send('Method Not Allowed');  
  try {  
    const { to, subject, html, cc, bcc, replyTo } = req.body;  
    await sendMail({ to, subject, html, cc, bcc, replyTo });  
    res.status(200).json({ success: true });  
  } catch (err) {  
    res.status(500).json({ error: err.message });  
  }  
} 
