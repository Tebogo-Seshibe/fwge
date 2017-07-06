import { PasswordValidator, SecondPasswordValidator } from "../../test/fixtures/lib/password-validator";
import { StringValidator } from "../../test/fixtures/lib/string-validator";
import { MobileValidator } from "../../test/fixtures/lib/mobile-validator";

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
