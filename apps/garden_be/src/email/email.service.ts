import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import type { Transporter } from 'nodemailer';

@Injectable()
export class EmailService {
    private transporter: Transporter | null = null;
    private readonly logger = new Logger(EmailService.name);

    constructor(private readonly config: ConfigService) {
        const host = this.config.get('SMTP_HOST');
        if (host) {
            this.transporter = nodemailer.createTransport({
                host,
                port: this.config.get<number>('SMTP_PORT', 587),
                secure: this.config.get<number>('SMTP_PORT', 587) === 465,
                auth: {
                    user: this.config.get('SMTP_USER'),
                    pass: this.config.get('SMTP_PASS'),
                },
            });
            this.logger.log('SMTP transport configured');
        } else {
            this.logger.warn(
                'SMTP not configured - email notifications disabled'
            );
        }
    }

    async sendNotificationEmail(
        to: string,
        notification: {
            type: string;
            message: string;
            herbNames: string[];
        }
    ): Promise<void> {
        if (!this.transporter) {
            this.logger.warn('Email skipped - no SMTP configured');
            return;
        }

        const isEmergency = notification.type === 'emergency';
        const subject = isEmergency
            ? `⚠️ Kritické upozornění - Zahradka`
            : `Upozornění - Zahradka`;

        const html = `
<!DOCTYPE html>
<html lang="cs">
<head><meta charset="UTF-8"></head>
<body style="font-family: Arial, sans-serif; background: #f5f5f5; padding: 20px;">
  <div style="max-width: 500px; margin: 0 auto; background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
    <div style="background: ${isEmergency ? '#dc2626' : '#f59e0b'}; color: white; padding: 20px; text-align: center;">
      <h1 style="margin: 0; font-size: 20px;">${isEmergency ? 'Kritické upozornění' : 'Upozornění'}</h1>
    </div>
    <div style="padding: 24px;">
      <p style="font-size: 16px; color: #333; margin: 0 0 16px;">${notification.message}</p>
      ${
          notification.herbNames.length > 0
              ? `<p style="font-size: 14px; color: #666;">Rostliny: <strong>${notification.herbNames.join(', ')}</strong></p>`
              : ''
      }
      <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
      <p style="font-size: 12px; color: #999; text-align: center;">Zahradka - Monitoring rostlin</p>
    </div>
  </div>
</body>
</html>`;

        try {
            await this.transporter.sendMail({
                from: this.config.get(
                    'SMTP_FROM',
                    'zahradka@example.com'
                ),
                to,
                subject,
                html,
            });
            this.logger.log(`Notification email sent to ${to}`);
        } catch (error) {
            this.logger.error(`Failed to send email to ${to}`, error);
        }
    }
}
