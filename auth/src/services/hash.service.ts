import * as bcrypt from 'bcryptjs';

export class HashService {

  static async generatePasshash(password: string, salt?: string): Promise<SaltPasshash> {
    if (!salt) {
      salt = await bcrypt.genSalt();
    }
    const passhash = await bcrypt.hash(password, salt);

    return { salt, passhash };
  }
}

interface SaltPasshash {
  salt: string;
  passhash: string;
}
