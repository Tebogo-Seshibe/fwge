import Updateable from '../Interfaces/Updateable';
declare class TimeKeep implements Updateable {
    private Now;
    private Then;
    Delta: number;
    Period: number;
    Ready: boolean;
    constructor(period: number);
    Reset(): void;
    Update(): void;
}
export default class Time {
    static Render: TimeKeep;
    static Physics: TimeKeep;
    static Init(render: number, physics: number): void;
    static Update(): void;
}
export {};
