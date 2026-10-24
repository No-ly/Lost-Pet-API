export class RegisterDto {
  name!: string;
  lastName!: string;
  email!: string;
  password!: string;
  isPetAlertEnabled?: boolean;
  lat?: number;
  lon?: number;
  radius?: number;
}