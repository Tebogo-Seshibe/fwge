function applyMixins(derivedCtor, baseCtors) {
    baseCtors.forEach(function (baseCtor) {
        Object.getOwnPropertyNames(baseCtor.prototype).forEach(function (name) {
            if (name !== 'constructor') {
                derivedCtor.prototype[name] = baseCtor.prototype[name];
            }
        });
    });
}
var Flies = (function () {
    function Flies() {
    }
    Flies.prototype.fly = function () {
        alert('Is it a bird? Is it a plane?');
    };
    return Flies;
}());
var Climbs = (function () {
    function Climbs() {
    }
    Climbs.prototype.climb = function () {
        alert('My spider-sense is tingling.');
    };
    return Climbs;
}());
var Bulletproof = (function () {
    function Bulletproof() {
    }
    Bulletproof.prototype.deflect = function () {
        alert('My wings are a shield of steel.');
    };
    return Bulletproof;
}());
var BeetleGuy = (function () {
    function BeetleGuy() {
    }
    return BeetleGuy;
}());
applyMixins(BeetleGuy, [Climbs, Bulletproof]);
var HorseflyWoman = (function () {
    function HorseflyWoman() {
    }
    return HorseflyWoman;
}());
applyMixins(HorseflyWoman, [Climbs, Flies]);
var superHero = new HorseflyWoman();
superHero.climb();
superHero.fly();
