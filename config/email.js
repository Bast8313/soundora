// config/email.js
// Configuration du transporteur nodemailer pour l'envoi d'emails

import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.SMTP_USER, // Email expéditeur
    pass: process.env.SMTP_PASS  // Mot de passe d'application
  }
});

export default transporter;
