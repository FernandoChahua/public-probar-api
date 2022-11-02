export class StringUtil {
  public static regexPhoneNumber = /^$|\b9[0-9]{8}\b/;

  public static regexEmail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

  public static formatStr(str: string) {
    return str.toLowerCase().trim();
  }

  public static trimStr(str: string) {
    return str.trim();
  }

  public static isEmailStr(str: string): boolean {
    return StringUtil.regexEmail.test(str);
  }

  public static generateCode(length: number, mode: string) {
    let mask = '';
    if (mode.indexOf('a') > -1) mask += 'abcdefghijklmnopqrstuvwxyz';
    if (mode.indexOf('A') > -1) mask += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    if (mode.indexOf('#') > -1) mask += '0123456789';
    if (mode.indexOf('!') > -1) mask += '~`!@#$%^&*()_+-={}[]:";\'<>?,./|\\';
    let result = '';

    for (let i = length; i > 0; i -= 1) {
      result += mask[Math.round(Math.random() * (mask.length - 1))];
    }

    return result;
  }
}
