import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { envs } from '../config/envs';

@Injectable()
export class EmailService {
    private readonly transporter: nodemailer.Transporter;

    constructor() {
        this.transporter = nodemailer.createTransport({
            service: envs.MAILER_SERVICE,
            auth: {
                user: envs.MAILER_USER,
                pass: envs.MAILER_PASSWORD,
            },
        });
    }

    // La referencia manda a un correo fijo; aquí la alerta llega a tu propia cuenta (MAILER_USER)
    async sendEmail(template: string) {
        await this.transporter.sendMail({
            from: envs.MAILER_USER,
            to: envs.MAILER_USER,
            subject: 'Mascota Perdida',
            html: template,
        });
    }
}
