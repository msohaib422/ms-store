const nodemailer = require('nodemailer');
const Setting = require('../models/Settings');

const createTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: process.env.SMTP_PORT === '465',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
};

const getStoreName = async () => {
  try {
    const setting = await Setting.findOne({ key: 'store_name' });
    return setting?.value || '';
  } catch {
    return '';
  }
};

const sendContactEmail = async ({ name, email, phone, subject, message }) => {
  if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
    console.warn('SMTP credentials not configured — email not sent');
    return;
  }

  const transporter = createTransporter();
  const contactEmail = process.env.CONTACT_EMAIL || 'www.msohaib422@gmail.com';
  const submittedAt = new Date().toLocaleString('en-PK', { timeZone: 'Asia/Karachi' });
  const storeName = await getStoreName();

  const html = `
    <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;background:#f9fafb;padding:24px;border-radius:12px;">
      <div style="background:#1d4ed8;padding:20px 24px;border-radius:8px 8px 0 0;">
        <h1 style="color:white;margin:0;font-size:20px;">New Contact Form Submission</h1>
        ${storeName ? `<p style="color:#bfdbfe;margin:4px 0 0;font-size:14px;">${storeName}</p>` : ''}
      </div>
      <div style="background:white;padding:24px;border-radius:0 0 8px 8px;border:1px solid #e5e7eb;border-top:none;">
        <table style="width:100%;border-collapse:collapse;">
          <tr><td style="padding:10px 0;border-bottom:1px solid #f3f4f6;width:130px;"><strong style="color:#6b7280;font-size:13px;">NAME</strong></td><td style="padding:10px 0;border-bottom:1px solid #f3f4f6;font-size:15px;color:#111827;">${name}</td></tr>
          <tr><td style="padding:10px 0;border-bottom:1px solid #f3f4f6;"><strong style="color:#6b7280;font-size:13px;">EMAIL</strong></td><td style="padding:10px 0;border-bottom:1px solid #f3f4f6;font-size:15px;"><a href="mailto:${email}" style="color:#1d4ed8;">${email}</a></td></tr>
          ${phone ? `<tr><td style="padding:10px 0;border-bottom:1px solid #f3f4f6;"><strong style="color:#6b7280;font-size:13px;">PHONE</strong></td><td style="padding:10px 0;border-bottom:1px solid #f3f4f6;font-size:15px;color:#111827;">${phone}</td></tr>` : ''}
          ${subject ? `<tr><td style="padding:10px 0;border-bottom:1px solid #f3f4f6;"><strong style="color:#6b7280;font-size:13px;">SUBJECT</strong></td><td style="padding:10px 0;border-bottom:1px solid #f3f4f6;font-size:15px;color:#111827;">${subject}</td></tr>` : ''}
          <tr><td style="padding:10px 0;border-bottom:1px solid #f3f4f6;"><strong style="color:#6b7280;font-size:13px;">SUBMITTED</strong></td><td style="padding:10px 0;border-bottom:1px solid #f3f4f6;font-size:13px;color:#6b7280;">${submittedAt}</td></tr>
        </table>
        <div style="margin-top:20px;">
          <p style="color:#6b7280;font-size:13px;font-weight:600;margin-bottom:8px;text-transform:uppercase;">MESSAGE</p>
          <div style="background:#f9fafb;padding:16px;border-radius:8px;border-left:4px solid #1d4ed8;font-size:15px;color:#111827;line-height:1.6;">${message.replace(/\n/g, '<br/>')}</div>
        </div>
        <div style="margin-top:24px;padding-top:16px;border-top:1px solid #f3f4f6;">
          <a href="mailto:${email}?subject=Re: ${subject || 'Your inquiry'}" style="display:inline-block;background:#1d4ed8;color:white;padding:10px 20px;border-radius:8px;text-decoration:none;font-size:14px;font-weight:600;">Reply to ${name}</a>
        </div>
      </div>
    </div>
  `;

  const fromName = storeName || 'Store';
  await transporter.sendMail({
    from: `"${fromName}" <${process.env.SMTP_USER}>`,
    to: contactEmail,
    subject: `New Message: ${subject || 'Contact Form'} — from ${name}`,
    html,
    replyTo: email,
  });
};

const sendNotificationEmail = async ({ type, title, message, link = '', meta = {} }) => {
  if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
    console.warn('SMTP credentials not configured — notification email not sent');
    return;
  }

  const transporter = createTransporter();
  const contactEmail = process.env.CONTACT_EMAIL || 'www.msohaib422@gmail.com';
  const storeName = await getStoreName();
  const timestamp = new Date().toLocaleString('en-PK', { timeZone: 'Asia/Karachi' });

  const typeColors = {
    review: '#f59e0b',
    message: '#3b82f6',
    product: '#10b981',
    order: '#8b5cf6',
    inquiry: '#ec4899',
    system: '#6b7280',
  };

  const color = typeColors[type] || '#6b7280';

  const metaLabels = {
    reviewId: 'Review ID',
    rating: 'Rating',
    messageId: 'Message ID',
    senderEmail: 'Sender Email',
    productId: 'Product ID',
    productName: 'Product Name',
    stock: 'Stock Remaining',
  };

  const metaRows = Object.entries(meta)
    .filter(([, v]) => v !== undefined && v !== null && v !== '')
    .map(([key, value]) => {
      const label = metaLabels[key] || key.replace(/([A-Z])/g, ' $1').replace(/^./, s => s.toUpperCase());
      const displayValue = key === 'rating' ? `${value}/5 stars` : value;
      return `<tr><td style="padding:8px 0;border-bottom:1px solid #f3f4f6;width:160px;"><strong style="color:#6b7280;font-size:13px;">${label.toUpperCase()}</strong></td><td style="padding:8px 0;border-bottom:1px solid #f3f4f6;font-size:14px;color:#111827;">${displayValue}</td></tr>`;
    }).join('');

  const html = `
    <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;background:#f9fafb;padding:24px;border-radius:12px;">
      <div style="background:${color};padding:20px 24px;border-radius:8px 8px 0 0;">
        <h1 style="color:white;margin:0;font-size:20px;">New Notification</h1>
        ${storeName ? `<p style="color:rgba(255,255,255,0.8);margin:4px 0 0;font-size:14px;">${storeName} Admin</p>` : ''}
      </div>
      <div style="background:white;padding:24px;border-radius:0 0 8px 8px;border:1px solid #e5e7eb;border-top:none;">
        <div style="margin-bottom:16px;">
          <span style="display:inline-block;background:${color}15;color:${color};padding:4px 12px;border-radius:20px;font-size:12px;font-weight:600;text-transform:uppercase;">${type}</span>
        </div>
        <h2 style="color:#111827;font-size:18px;margin:0 0 12px;">${title}</h2>
        <p style="color:#4b5563;font-size:15px;line-height:1.6;margin:0 0 20px;">${message}</p>
        <table style="width:100%;border-collapse:collapse;">
          <tr>
            <td style="padding:8px 0;border-bottom:1px solid #f3f4f6;width:160px;">
              <strong style="color:#6b7280;font-size:13px;">TIME</strong>
            </td>
            <td style="padding:8px 0;border-bottom:1px solid #f3f4f6;font-size:14px;color:#111827;">${timestamp}</td>
          </tr>
          ${metaRows}
        </table>
        ${link ? `
        <div style="margin-top:24px;">
          <a href="${link}" style="display:inline-block;background:${color};color:white;padding:10px 20px;border-radius:8px;text-decoration:none;font-size:14px;font-weight:600;">View in Admin Panel</a>
        </div>
        ` : ''}
      </div>
    </div>
  `;

  const fromName = storeName || 'Store';
  await transporter.sendMail({
    from: `"${fromName} Notifications" <${process.env.SMTP_USER}>`,
    to: contactEmail,
    subject: `[${type.toUpperCase()}] ${title} — ${storeName || 'Store'}`,
    html,
  });
};

module.exports = { sendContactEmail, sendNotificationEmail };
