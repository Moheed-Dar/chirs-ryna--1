// import nodemailer from 'nodemailer';

// const transporter = nodemailer.createTransport({
//   host: process.env.SMTP_HOST || 'smtp.gmail.com',
//   port: process.env.SMTP_PORT || 587,
//   secure: false,
//   auth: {
//     user: process.env.SMTP_EMAIL,
//     pass: process.env.SMTP_PASSWORD,
//   },
// });

// // Verify transporter connection
// transporter.verify((error, success) => {
//   if (error) {
//     console.log('Email transporter error:', error);
//   } else {
//     console.log('Email transporter is ready');
//   }
// });

// // Send Welcome Email
// export const sendWelcomeEmail = async (user) => {
//   try {
//     const mailOptions = {
//       from: `"Real Estate Pro" <${process.env.SMTP_EMAIL}>`,
//       to: user.email,
//       subject: 'Welcome to Real Estate Pro! 🏠',
//       html: `
//         <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
//           <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; border-radius: 10px 10px 0 0; text-align: center;">
//             <h1 style="color: white; margin: 0;">🏠 Real Estate Pro</h1>
//           </div>
//           <div style="background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px;">
//             <h2 style="color: #333;">Welcome, ${user.name}!</h2>
//             <p style="color: #666; line-height: 1.6;">
//               Thank you for joining Real Estate Pro. Your account has been created successfully.
//             </p>
//             <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
//               <p style="margin: 0; color: #333;"><strong>Email:</strong> ${user.email}</p>
//               <p style="margin: 10px 0 0; color: #333;"><strong>Role:</strong> ${user.role}</p>
//             </div>
//             <p style="color: #666;">Start exploring properties now!</p>
//             <a href="${process.env.NEXT_PUBLIC_APP_URL}" style="display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin-top: 15px;">
//               Explore Properties
//             </a>
//           </div>
//         </div>
//       `,
//     };

//     await transporter.sendMail(mailOptions);
//     return true;
//   } catch (error) {
//     console.error('Welcome email error:', error);
//     return false;
//   }
// };

// // Send Lead Notification Email to Admin
// export const sendLeadNotificationEmail = async (lead, property) => {
//   try {
//     const mailOptions = {
//       from: `"Real Estate Pro" <${process.env.SMTP_EMAIL}>`,
//       to: process.env.ADMIN_EMAIL || process.env.SMTP_EMAIL,
//       subject: `🎉 New Lead: ${lead.name} interested in ${property?.title || 'Property'}`,
//       html: `
//         <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
//           <div style="background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); padding: 30px; border-radius: 10px 10px 0 0; text-align: center;">
//             <h1 style="color: white; margin: 0;">📊 New Lead Alert!</h1>
//           </div>
//           <div style="background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px;">
//             <h2 style="color: #333;">Lead Details</h2>
//             <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
//               <p style="margin: 5px 0; color: #333;"><strong>Name:</strong> ${lead.name}</p>
//               <p style="margin: 5px 0; color: #333;"><strong>Email:</strong> ${lead.email}</p>
//               <p style="margin: 5px 0; color: #333;"><strong>Phone:</strong> ${lead.phone}</p>
//               <p style="margin: 5px 0; color: #333;"><strong>Message:</strong> ${lead.message}</p>
//             </div>
//             ${property ? `
//             <h3 style="color: #333;">Property Details</h3>
//             <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
//               <p style="margin: 5px 0; color: #333;"><strong>Title:</strong> ${property.title}</p>
//               <p style="margin: 5px 0; color: #333;"><strong>Price:</strong> ${property.price}</p>
//               <p style="margin: 5px 0; color: #333;"><strong>Location:</strong> ${property.location}</p>
//             </div>
//             ` : ''}
//             <p style="color: #999; font-size: 12px;">This is an automated notification from Real Estate Pro</p>
//           </div>
//         </div>
//       `,
//     };

//     await transporter.sendMail(mailOptions);
//     return true;
//   } catch (error) {
//     console.error('Lead notification email error:', error);
//     return false;
//   }
// };

// // Send Thank You Email to Lead
// export const sendLeadThankYouEmail = async (lead) => {
//   try {
//     const mailOptions = {
//       from: `"Real Estate Pro" <${process.env.SMTP_EMAIL}>`,
//       to: lead.email,
//       subject: 'Thank you for your interest! 🙏',
//       html: `
//         <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
//           <div style="background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%); padding: 30px; border-radius: 10px 10px 0 0; text-align: center;">
//             <h1 style="color: white; margin: 0;">🏠 Real Estate Pro</h1>
//           </div>
//           <div style="background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px;">
//             <h2 style="color: #333;">Thank You, ${lead.name}!</h2>
//             <p style="color: #666; line-height: 1.6;">
//               We have received your inquiry. Our team will contact you within 24 hours.
//             </p>
//             <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
//               <p style="margin: 0; color: #333;">We appreciate your interest in our property. Our expert agents will get back to you shortly.</p>
//             </div>
//             <p style="color: #666;">If you have any urgent questions, feel free to call us.</p>
//           </div>
//         </div>
//       `,
//     };

//     await transporter.sendMail(mailOptions);
//     return true;
//   } catch (error) {
//     console.error('Thank you email error:', error);
//     return false;
//   }
// };

// // Send Contact Email
// export const sendContactEmail = async (data) => {
//   try {
//     const mailOptions = {
//       from: `"Real Estate Pro" <${process.env.SMTP_EMAIL}>`,
//       to: process.env.ADMIN_EMAIL || process.env.SMTP_EMAIL,
//       subject: `📩 Contact Form: ${data.subject}`,
//       html: `
//         <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
//           <div style="background: #333; padding: 30px; border-radius: 10px 10px 0 0; text-align: center;">
//             <h1 style="color: white; margin: 0;">📩 New Contact Message</h1>
//           </div>
//           <div style="background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px;">
//             <div style="background: white; padding: 20px; border-radius: 8px;">
//               <p style="margin: 5px 0; color: #333;"><strong>Name:</strong> ${data.name}</p>
//               <p style="margin: 5px 0; color: #333;"><strong>Email:</strong> ${data.email}</p>
//               <p style="margin: 5px 0; color: #333;"><strong>Phone:</strong> ${data.phone || 'Not provided'}</p>
//               <p style="margin: 5px 0; color: #333;"><strong>Subject:</strong> ${data.subject}</p>
//               <p style="margin: 15px 0 5px; color: #333;"><strong>Message:</strong></p>
//               <p style="margin: 0; color: #666; padding: 15px; background: #f5f5f5; border-radius: 5px;">${data.message}</p>
//             </div>
//           </div>
//         </div>
//       `,
//     };

//     await transporter.sendMail(mailOptions);
//     return true;
//   } catch (error) {
//     console.error('Contact email error:', error);
//     return false;
//   }
// };



















// backend/lib/email.js

import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: process.env.SMTP_PORT || 587,
  secure: false,
  auth: {
    user: process.env.SMTP_EMAIL,
    pass: process.env.SMTP_PASSWORD,
  },
});

// Verify transporter connection
transporter.verify((error, success) => {
  if (error) {
    console.log('Email transporter error:', error);
  } else {
    console.log('Email transporter is ready');
  }
});

// Send Welcome Email
export const sendWelcomeEmail = async (user) => {
  try {
    const mailOptions = {
      from: `"Casey Margenau Fine Homes and Estates - Christopher Ryan" <${process.env.SMTP_EMAIL}>`,
      to: user.email,
      subject: 'Welcome to Casey Margenau Fine Homes and Estates ! 🏠',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; border-radius: 10px 10px 0 0; text-align: center;">
            <h1 style="color: white; margin: 0;">🏠 Casey Margenau Fine Homes and Estates</h1>
          </div>
          <div style="background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px;">
            <h2 style="color: #333;">Welcome, ${user.name}!</h2>
            <p style="color: #666; line-height: 1.6;">
              Thank you for joining Casey Margenau Fine Homes and Estates. Your account has been created successfully.
            </p>
            <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <p style="margin: 0; color: #333;"><strong>Email:</strong> ${user.email}</p>
              <p style="margin: 10px 0 0; color: #333;"><strong>Role:</strong> ${user.role}</p>
            </div>
            <p style="color: #666;">Start exploring properties now!</p>
            <a href="${process.env.NEXT_PUBLIC_APP_URL}" style="display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin-top: 15px;">
              Explore Properties
            </a>
          </div>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    return true;
  } catch (error) {
    console.error('Welcome email error:', error);
    return false;
  }
};

// Send Lead Notification Email to Admin
export const sendLeadNotificationEmail = async (lead, property) => {
  try {
    const mailOptions = {
      from: `"Casey Margenau Fine Homes and Estates - Christopher Ryan" <${process.env.SMTP_EMAIL}>`,
      to: process.env.ADMIN_EMAIL || process.env.SMTP_EMAIL,
      subject: `🎉 New Lead: ${lead.name} interested in ${property?.title || 'Property'}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); padding: 30px; border-radius: 10px 10px 0 0; text-align: center;">
            <h1 style="color: white; margin: 0;">📊 New Lead Alert!</h1>
          </div>
          <div style="background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px;">
            <h2 style="color: #333;">Lead Details</h2>
            <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <p style="margin: 5px 0; color: #333;"><strong>Name:</strong> ${lead.name}</p>
              <p style="margin: 5px 0; color: #333;"><strong>Email:</strong> ${lead.email}</p>
              <p style="margin: 5px 0; color: #333;"><strong>Phone:</strong> ${lead.phone}</p>
              <p style="margin: 5px 0; color: #333;"><strong>Message:</strong> ${lead.message || 'No message'}</p>
            </div>
            ${property ? `
            <h3 style="color: #333;">Property Details</h3>
            <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <p style="margin: 5px 0; color: #333;"><strong>Title:</strong> ${property.title}</p>
              <p style="margin: 5px 0; color: #333;"><strong>Price:</strong> ${property.price}</p>
              <p style="margin: 5px 0; color: #333;"><strong>Location:</strong> ${property.location}</p>
            </div>
            ` : ''}
            <p style="color: #999; font-size: 12px;">This is an automated notification from Real Estate Pro</p>
          </div>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    return true;
  } catch (error) {
    console.error('Lead notification email error:', error);
    return false;
  }
};

// Send Thank You Email to Lead
export const sendLeadThankYouEmail = async (lead) => {
  try {
    const mailOptions = {
      from: `"Casey Margenau Fine Homes and Estates - Christopher Ryan " <${process.env.SMTP_EMAIL}>`,
      to: lead.email,
      subject: 'Thank you for your interest! ',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%); padding: 30px; border-radius: 10px 10px 0 0; text-align: center;">
            <h1 style="color: white; margin: 0;">🏠 Casey Margenau Fine Homes and Estates</h1>
          </div>
          <div style="background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px;">
            <h2 style="color: #333;">Thank You, ${lead.name}!</h2>
            <p style="color: #666; line-height: 1.6;">
              We have received your inquiry. Our team will contact you within 24 hours.
            </p>
            <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <p style="margin: 0; color: #333;">We appreciate your interest in our property. Our expert agents will get back to you shortly.</p>
            </div>
            <p style="color: #666;">If you have any urgent questions, feel free to call us.</p>
          </div>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    return true;
  } catch (error) {
    console.error('Thank you email error:', error);
    return false;
  }
};

// Send Contact Email
export const sendContactEmail = async (data) => {
  try {
    const mailOptions = {
      from: `"Casey Margenau Fine Homes and Estates - Christopher Ryan" <${process.env.SMTP_EMAIL}>`,
      to: process.env.ADMIN_EMAIL || process.env.SMTP_EMAIL,
      subject: `📩 Contact Form: ${data.subject}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: #333; padding: 30px; border-radius: 10px 10px 0 0; text-align: center;">
            <h1 style="color: white; margin: 0;">📩 New Contact Message</h1>
          </div>
          <div style="background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px;">
            <div style="background: white; padding: 20px; border-radius: 8px;">
              <p style="margin: 5px 0; color: #333;"><strong>Name:</strong> ${data.name}</p>
              <p style="margin: 5px 0; color: #333;"><strong>Email:</strong> ${data.email}</p>
              <p style="margin: 5px 0; color: #333;"><strong>Phone:</strong> ${data.phone || 'Not provided'}</p>
              <p style="margin: 5px 0; color: #333;"><strong>Subject:</strong> ${data.subject}</p>
              <p style="margin: 15px 0 5px; color: #333;"><strong>Message:</strong></p>
              <p style="margin: 0; color: #666; padding: 15px; background: #f5f5f5; border-radius: 5px;">${data.message}</p>
            </div>
          </div>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    return true;
  } catch (error) {
    console.error('Contact email error:', error);
    return false;
  }
};

// ============================================
// ✅ NEW: GUIDE DOWNLOAD EMAIL FUNCTIONS
// ============================================

// Admin Ko Guide Download Notification
export const sendGuideDownloadNotificationEmail = async (lead, guideType) => {
  try {
    const guideLabel = guideType === 'buyer' ? 'Buyer Guide' : 'Seller Guide';
    const guideColor = guideType === 'buyer' 
      ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' 
      : 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)';
    const guideEmoji = guideType === 'buyer' ? '📘' : '📗';

    const mailOptions = {
      from: `"Casey Margenau Fine Homes and Estates - Christopher Ryan" <${process.env.SMTP_EMAIL}>`,
      to: process.env.ADMIN_EMAIL || process.env.SMTP_EMAIL,
      subject: `${guideEmoji} ${guideLabel} Downloaded by ${lead.name}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: ${guideColor}; padding: 30px; border-radius: 10px 10px 0 0; text-align: center;">
            <h1 style="color: white; margin: 0;">${guideEmoji} New Guide Download!</h1>
            <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0;">${guideLabel}</p>
          </div>
          <div style="background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px;">
            
            <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid ${guideType === 'buyer' ? '#667eea' : '#f5576c'};">
              <h3 style="margin: 0 0 15px; color: #333;">📋 User Details</h3>
              <p style="margin: 8px 0; color: #333;"><strong>Name:</strong> ${lead.name}</p>
              <p style="margin: 8px 0; color: #333;"><strong>Email:</strong> ${lead.email}</p>
              <p style="margin: 8px 0; color: #333;"><strong>Phone:</strong> ${lead.phone}</p>
            </div>

            <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="margin: 0 0 15px; color: #333;">📊 Download Info</h3>
              <p style="margin: 8px 0; color: #333;"><strong>Guide Type:</strong> ${guideLabel}</p>
              <p style="margin: 8px 0; color: #333;"><strong>Downloaded At:</strong> ${new Date().toLocaleString()}</p>
              <p style="margin: 8px 0; color: #333;"><strong>IP Address:</strong> ${lead.ipAddress || 'Unknown'}</p>
            </div>

            <div style="background: #fff3cd; padding: 15px; border-radius: 8px; margin: 20px 0;">
              <p style="margin: 0; color: #856404;">💡 <strong>Tip:</strong> User ne ${guideLabel} download kiya hai. Ye ek potential ${guideType} hai. Jaldi follow up karein!</p>
            </div>

            <p style="color: #999; font-size: 12px; text-align: center; margin-top: 20px;">This is an automated notification from Casey Margenau Fine Homes and Estates - Christopher Ryan</p>
          </div>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    return true;
  } catch (error) {
    console.error('Guide download notification email error:', error);
    return false;
  }
};

// User Ko Guide Download Thank You Email
export const sendGuideDownloadThankYouEmail = async (lead, guideType) => {
  try {
    const guideLabel = guideType === 'buyer' ? 'Buyer Guide' : 'Seller Guide';
    const guideColor = guideType === 'buyer' 
      ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' 
      : 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)';
    const guideEmoji = guideType === 'buyer' ? '📘' : '📗';

    const mailOptions = {
      from: `"Casey Margenau Fine Homes and Estates - Christopher Ryan" <${process.env.SMTP_EMAIL}>`,
      to: lead.email,
      subject: `Your ${guideLabel} is Ready! ${guideEmoji}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: ${guideColor}; padding: 30px; border-radius: 10px 10px 0 0; text-align: center;">
            <h1 style="color: white; margin: 0;">${guideEmoji} ${guideLabel} Downloaded!</h1>
          </div>
          <div style="background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px;">
            <h2 style="color: #333;">Thank You, ${lead.name}!</h2>
            <p style="color: #666; line-height: 1.6;">
              Your <strong>${guideLabel}</strong> has been downloaded successfully. 
              We hope this guide helps you make informed decisions.
            </p>

            <div style="background: white; padding: 20px; border-radius: 8px; margin: 25px 0; text-align: center;">
              <p style="margin: 0 0 15px; color: #333; font-size: 16px;">${guideType === 'buyer' ? '🏠 Looking for your dream property?' : '💼 Planning to sell your property?'}</p>
              <p style="margin: 0; color: #666;">Our expert team is here to help you every step of the way.</p>
            </div>

            <div style="background: #e8f4fd; padding: 20px; border-radius: 8px; margin: 25px 0;">
              <h3 style="margin: 0 0 10px; color: #333;">📞 What's Next?</h3>
              <ul style="margin: 0; padding-left: 20px; color: #666; line-height: 1.8;">
                <li>Our team will contact you within 24 hours</li>
                <li>We'll answer any questions about the guide</li>
                <li>Get personalized assistance for your needs</li>
              </ul>
            </div>

            <div style="text-align: center; margin-top: 25px;">
              <p style="color: #666; margin: 0;">Have questions? Reply to this email or call us directly.</p>
            </div>
          </div>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    return true;
  } catch (error) {
    console.error('Guide download thank you email error:', error);
    return false;
  }
};