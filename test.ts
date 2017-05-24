function applyMixins(derivedCtor: any, baseCtors: any[]) {
    baseCtors.forEach(baseCtor => {
        Object.getOwnPropertyNames(baseCtor.prototype).forEach(name => {
             if (name !== 'constructor') {
                derivedCtor.prototype[name] = baseCtor.prototype[name];
            }
        });
    });
}

class Flies {
        fly() {
                alert('Is it a bird? Is it a plane?');
        }
}

class Climbs {
        climb() {
                alert('My spider-sense is tingling.');
        }
}

class Bulletproof {
        deflect() {
                alert('My wings are a shield of steel.');
        }
}

class BeetleGuy implements Climbs, Bulletproof {
        climb: () => void;
        deflect: () => void;
}
applyMixins (BeetleGuy, [Climbs, Bulletproof]);

class HorseflyWoman implements Climbs, Flies {
        climb: () => void;
        fly: () => void;
}
applyMixins (HorseflyWoman, [Climbs, Flies]);

var superHero = new HorseflyWoman();
superHero.climb();
superHero.fly();