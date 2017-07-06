
export interface PasswordValidator {
    isAcceptable(s: String): boolean;
}
export interface SecondPasswordValidator {
    isAcceptable(s: String): boolean;
}