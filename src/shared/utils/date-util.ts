export class DateUtil {
  public static getDateNowAndAddMinutes(minutes: number) {
    const date = new Date();
    date.setTime(date.getTime() + minutes * 60 * 1000);
    return date;
  }

  public static getNowServerDate() {
    const d = new Date();
    const utc = d.getTime() - d.getTimezoneOffset() * 60000;
    return new Date(utc);
  }

  public static getDateWithTimezone(date: Date) {
    const utc = date.getTime() - date.getTimezoneOffset() * 60000;
    return new Date(utc);
  }

  public static getAgeFromDate(birthDate: Date, fromDate?: Date): number {
    if (!fromDate) fromDate = this.getNowServerDate();
    birthDate = this.getDateWithTimezone(birthDate);
    let age = fromDate.getFullYear() - birthDate.getFullYear();
    const m = fromDate.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && fromDate.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  }
}
