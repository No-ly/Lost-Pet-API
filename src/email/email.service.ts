import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { envs} from '../config/envs';

@Injectable()
export class EmailService {
    //Configuracion del transporte de correo (transporter) que es el cartero de nodemailer con credenciales de envs
    private transporter = nodemailer.createTransport({
        service: envs.MAILER_SERVICE,
        auth: {
            user: envs.MAILER_USER,
            pass: envs.MAILER_PASSWORD,
        },
    });

    //Método asíncrono para enviar un correo en formato HTML, recibe el correo del destinatario, el asunto y el contenido del correo
    async sendMail(options: {
        to: string;
        subject: string;
        html: string;
    }):
    Promise<boolean> {
        const { to, subject, html } = options;

        try{ 
            await this.transporter.sendMail({
                from: envs.MAILER_USER,
                to,
                subject,
                html,
            });
            return true;
        } catch (error) {
            console.error('Error sending email:', error);
            return false;
        }
    }
}