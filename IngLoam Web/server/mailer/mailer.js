require("dotenv").config();
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASSWORD,
  },
});


exports.sendConfirmationEmail = (toEmail, username) => {
  const mailoptions = {
    from: '"IngLoam Corporation" <amoshal1997@gmail.com>',
    to: toEmail,
    subject: "🚀 Добро пожаловать в IngLoam! Регистрация завершена",
    html: `
    <div style="font-family: 'Segoe UI', Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e1e4e8; border-radius: 6px; overflow: hidden;">
      <div style="background: #24292e; padding: 20px; text-align: center;">
        <img src="https://i.postimg.cc/KzQD1jhZ/Ing-Loam-black.png" alt="IngLoam Logo" style="height: 50px;">
      </div>
      
      <div style="padding: 30px;">
        <h1 style="color: #24292e; margin-top: 0;">Привет, ${username}!</h1>
        
        <p style="font-size: 16px; line-height: 1.5; color: #24292e;">
          Спасибо за регистрацию в IngLoam - платформе для разработчиков, где идеи становятся реальностью!
        </p>
        
        <div style="background: #f6f8fa; border-left: 4px solid #0366d6; padding: 15px; margin: 20px 0; border-radius: 0 3px 3px 0;">
          <p style="margin: 0; font-size: 14px; color: #24292e;">
            <strong>Ваш аккаунт успешно создан.</strong> Теперь вы можете присоединиться к сообществу разработчиков, делиться проектами и сотрудничать.
          </p>
        </div>
        
        <a href="https://ingloam.com/dashboard" style="display: inline-block; background: #2ea44f; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: 600; margin: 15px 0;">
          Перейти в личный кабинет
        </a>
        
        <p style="font-size: 14px; color: #586069;">
          Если у вас есть вопросы, просто ответьте на это письмо. Мы всегда рады помочь!
        </p>
      </div>
      
      <div style="background: #f6f8fa; padding: 20px; text-align: center; border-top: 1px solid #e1e4e8; font-size: 12px; color: #586069;">
        <p style="margin: 0;">© ${new Date().getFullYear()} IngLoam Corporation. Все права защищены.</p>
      </div>
    </div>
    `,
  };

  return transporter.sendMail(mailoptions);
};