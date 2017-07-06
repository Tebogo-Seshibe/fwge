import 
{
    PasswordValidator,
    SecondPasswordValidator
} 
from "../lib/password-validator";

import {
StringValidator
} 
from 
"../lib/string-validator";

import {
    MobileValidator
} 
    from 
    "../lib/mobile-validator";

export class LettersOnlyValidator implements PasswordValidator {

    lettersRegexp: RegExp = /^[A-Za-z]+$/;

    isAcceptable(s: string) {
        return this.lettersRegexp.test(s);
    }
}