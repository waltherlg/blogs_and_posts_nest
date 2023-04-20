export type UserAuthModel = {
  loginOrEmail: string;
  password: string;
};

export type PasswordRecoveryModel = {
  email: string;
  passwordRecoveryCode: string;
  expirationDateOfRecoveryCode: Date;
};
