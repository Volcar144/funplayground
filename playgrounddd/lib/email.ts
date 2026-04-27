

import nodemailer from "nodemailer";

const transport = nodemailer.createTransport({
  host: "live.smtp.mailtrap.io",
  port: 587,
  
  auth: {
    user: "api",
    pass: process.env.SMTP_PASS,
  }
});

export async function sendEmailVerification(email: string, url: string, token: string)  {
    try {
        const info = await transport.sendMail({
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
                        <a href="${url}" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: black; padding: 12px 40px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block; font-size: 16px;">
                            Verify Email
                        </a>
                    </div>
                    
                    <p style="color: #999; font-size: 12px; margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
                        If the button doesn't work, copy and paste this link in your browser:<br>
                        <span style="word-break: break-all; color: #667eea;">${url}</span>
                    </p>
                    
                    
                </div>
                <a href="__unsubscribe_url__">Unsubscribe?</a>
            </div> `,
            text:
            `Verify Your Email

            Welcome to DanngDev Playground!

            Please verify your email address by clicking the link below. This link will expire in 24 hours.

            Verify Email: ${url}`
            
        });
    } catch (err){
        console.error("Email verification failed:", err);
    }

}
export async function sendEmailOTP(email: string, otp: string)  {
    try {
        const info = await transport.sendMail({
            from: '"DanngDev Playground" <noreply@archiem.top>',
            to: email,
            subject:"Your One-Time code.",
            html:
            `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9;">
                <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; border-radius: 8px 8px 0 0; text-align: center;">
                    <h1 style="color: white; margin: 0; font-size: 28px;">Verify Your Email</h1>
                </div>
                
                <div style="background-color: white; padding: 30px; border-radius: 0 0 8px 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                    <p style="color: #333; font-size: 16px; margin-bottom: 20px;">Welcome to DanngDev Playground!</p>
                    
                    <p style="color: #666; font-size: 14px; line-height: 1.6; margin-bottom: 30px;">
                        Please verify your email address by entering the code below. This code will expire in 10 minutes.
                    </p>
                    
                    <div style="text-align: center; margin: 30px 0;">
                        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; border-radius: 8px; font-weight: bold; display: inline-block; font-size: 24px; letter-spacing: 4px; font-family: monospace;">
                            ${otp}
                        </div>
                    </div>
                    
                    <p style="color: #999; font-size: 12px; margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
                        Enter this code in the verification field. Do not share this code with anyone.
                    </p>
                    
                </div>
                <a href="__unsubscribe_url__">Unsubscribe?</a>
            </div> `,
            text:
            `Verify Your Email

            Welcome to DanngDev Playground!

            Please verify your email address by entering the code below. This code will expire in 10 minutes.

            Verification Code: ${otp}

            Enter this code in the verification field. Do not share this code with anyone.`
            
        });
    } catch (err){
        console.error("Email verification failed:", err);
    }

}

export async function sendPasswordReset(email: string, url: string, token: string): Promise<void> {
    try {
        const info = await transport.sendMail({
            from: '"DanngDev Playground" <noreply@archiem.top>',
            to: email,
            subject: "Reset your password",
            html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9;">
            <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; border-radius: 8px 8px 0 0; text-align: center;">
                <h1 style="color: white; margin: 0; font-size: 28px;">Reset Your Password</h1>
            </div>
            
            <div style="background-color: white; padding: 30px; border-radius: 0 0 8px 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                <p style="color: #333; font-size: 16px; margin-bottom: 20px;">Password Reset Request</p>
                
                <p style="color: #666; font-size: 14px; line-height: 1.6; margin-bottom: 30px;">
                    We received a request to reset your password. Click the button below to create a new password. This link will expire in 1 hour.
                </p>
                
                <div style="text-align: center; margin: 30px 0;">
                    <a href="${url}" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 12px 40px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block; font-size: 16px;">
                        Reset Password
                    </a>
                </div>
                
                <p style="color: #999; font-size: 12px; margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
                    If the button doesn't work, copy and paste this link in your browser:<br>
                    <span style="word-break: break-all; color: #667eea;">${url}</span>
                </p>
            
                
                <p style="color: #e74c3c; font-size: 12px; margin-top: 20px;">
                    If you didn't request a password reset, please ignore this email or contact support.
                </p>
            </div>
            <a href="__unsubscribe_url__">Unsubscribe?</a>
        </div>
            `,
            text: `Reset Your Password

    Password Reset Request

    We received a request to reset your password. Click the link below to create a new password. This link will expire in 1 hour.

    Reset Password: ${url}

    If the button doesn't work, copy and paste this link in your browser:
    ${url}

    If you didn't request a password reset, please ignore this email or contact support.`
        });
    } catch (err) {
        console.error("Password reset email failed:", err);
    }
}

export async function sendOnPasswordReset(email: string): Promise<void> {
    const info = await transport.sendMail({
            from: '"DanngDev Playground" <noreply@archiem.top>',
            to: email,
            subject: "Reset your password",
            html: 
    `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; border-radius: 8px 8px 0 0; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 28px;">Password Reset Successful</h1>
        </div>
        
        <div style="background-color: white; padding: 30px; border-radius: 0 0 8px 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
            <p style="color: #333; font-size: 16px; margin-bottom: 20px;">Your password has been successfully reset.</p>
            
            <p style="color: #666; font-size: 14px; line-height: 1.6; margin-bottom: 30px;">
                Your DanngDev Playground account password has been changed. If you did not make this change, please contact support immediately.
            </p>
            
            <div style="background-color: #f0f8ff; padding: 15px; border-left: 4px solid #667eea; margin: 20px 0;">
                <p style="color: #333; font-size: 14px; margin: 0;">You can now log in with your new password.</p>
            </div>
            
            <p style="color: #999; font-size: 12px; margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
                If you did not request this password reset or have questions about your account security, please contact our support team immediately.
            </p>
        </div>
        <a href="__unsubscribe_url__">Unsubscribe?</a>
    </div>
    `,
    text: `
    Password reset successful!
    Your DanngDev playground password has been changed. You can now login with your new password!.
    If you did not request this password reset or have questions about your account security, please contact our support team immediately.
    `
    });

}

