

const nodemailer = require("nodemailer");

var transport = nodemailer.createTransport({
  host: "live.smtp.mailtrap.io",
  port: 587,
  auth: {
    user: "api",
    pass: process.env.SMTP_PASS,
  }
});

interface User {
    email: string;
    [key: string]: any;
}

export function sendEmailVerification(email: string, url: string, token: string): void {
    try {
        const info = transport.sendMail({
            from: '"DanngDev Playground" <noreply@archiem.top>',
            to: email,
            subject:"Verify your email",
            html:
            `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9;">
                <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; border-radius: 8px 8px 0 0; text-align: center;">
                    <h1 style="color: white; margin: 0; font-size: 28px;">Verify Your Email</h1>
                </div>
                
                <div style="background-color: white; padding: 30px; border-radius: 0 0 8px 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                    <p style="color: #333; font-size: 16px; margin-bottom: 20px;">Welcome to DanngDev Playground!</p>
                    
                    <p style="color: #666; font-size: 14px; line-height: 1.6; margin-bottom: 30px;">
                        Please verify your email address by clicking the button below. This link will expire in 24 hours.
                    </p>
                    
                    <div style="text-align: center; margin: 30px 0;">
                        <a href="${url}" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 12px 40px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block; font-size: 16px;">
                            Verify Email
                        </a>
                    </div>
                    
                    <p style="color: #999; font-size: 12px; margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
                        If the button doesn't work, copy and paste this link in your browser:<br>
                        <span style="word-break: break-all; color: #667eea;">${url}</span>
                    </p>
                    
                    <p style="color: #999; font-size: 12px; margin-top: 20px;">
                        Token: <code style="background-color: #f0f0f0; padding: 2px 6px; border-radius: 3px;">${token}</code>
                    </p>
                    
                </div>
                <a href="__unsubscribe_url__">Unsubscribe?</a>
            </div> `,
            text:
            `Verify Your Email

            Welcome to DanngDev Playground!

            Please verify your email address by clicking the link below. This link will expire in 24 hours.

            Verify Email: ${url}

            Token: ${token}`
            
        });
    } catch (err){
        console.error("Email verification failed:", err);
    }

}

