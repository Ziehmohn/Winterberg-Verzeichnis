import { sendMail } from './_mail.js';  
export default async function handler(req, res) {  
  if (req.method !== 'POST') return res.status(405).send('Method Not Allowed');  
  try {  
    const { to, subject, html, cc } = req.body;  
    await sendMail({ to, subject, html, cc });  
    res.status(200).json({ success: true });  
  } catch (err) {  
    res.status(500).json({ error: err.message });  
  }  
} 
