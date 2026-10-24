import {Module} from '@nestjs/common';
import {EmailService} from '../email/email.service';

@Module({
    providers: [EmailService],
    exports: [EmailService], // Exportamos para compartir el servicio con otros módulos
})
export class EmailModule {}