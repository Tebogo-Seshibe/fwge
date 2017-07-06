
import { StringValidator } from "../lib/string-validator";
import { MobileValidator } from "../lib/mobile-validator";

export class ZipCodeValidator implements StringValidator {
    
    numberRegexp: RegExp = /^[0-9]+$/;
    
    isAcceptable(s: string) {
        return s.length === 5 && this.numberRegexp.test(s);
    }
}