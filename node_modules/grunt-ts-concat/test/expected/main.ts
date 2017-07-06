
export class DatePipe {

    dateFormatter = new DateFormatter();

    transform(data, args) {
        this.dateFormatter.formatDate(new Date(), "yyyy/dd/MM");
    }
} 

export class LettersOnlyValidator implements PasswordValidator {

    lettersRegexp: RegExp = /^[A-Za-z]+$/;

    isAcceptable(s: string) {
        return this.lettersRegexp.test(s);
    }
}

export class ZipCodeValidator implements StringValidator {
    
    numberRegexp: RegExp = /^[0-9]+$/;
    
    isAcceptable(s: string) {
        return s.length === 5 && this.numberRegexp.test(s);
    }
}

export interface MobileValidator {
    isAcceptable(s: String): boolean;
}

export interface PasswordValidator {
    isAcceptable(s: String): boolean;
}
export interface SecondPasswordValidator {
    isAcceptable(s: String): boolean;
}

export interface StringValidator {
    isAcceptable(s: String): boolean;
}
export class DateFormatter {
    public formatDate(date, format) {
        return date.format(format);
    }
}
export class UtilityFunctions {
    static a = () => 1;
}
