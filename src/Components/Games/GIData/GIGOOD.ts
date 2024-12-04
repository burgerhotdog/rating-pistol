interface IGOOD {
    format: "GOOD" // A way for people to recognize this format.
    version: number // GOOD API version.
    source: string // The app that generates this data.
    characters?: ICharacter[]
    artifacts?: IArtifact[]
    weapons?: IWeapon[]
    materials?: { // Added in version 2
        [key:MaterialKey]: number
    }
}

interface ICharacter {
    key: CharacterKey //e.g. "Rosaria"
    level: number //1-90 inclusive
    constellation: number //0-6 inclusive
    ascension: number //0-6 inclusive. need to disambiguate 80/90 or 80/80
    talent: { //does not include boost from constellations. 1-15 inclusive
        auto: number
        skill: number
        burst: number
    }
}

interface IWeapon {
    key: WeaponKey //"CrescentPike"
    level: number //1-90 inclusive
    ascension: number //0-6 inclusive. need to disambiguate 80/90 or 80/80
    refinement: number //1-5 inclusive
    location: CharacterKey | "" //where "" means not equipped.
    lock: boolean //Whether the weapon is locked in game.
  }

interface IArtifact {
    setKey: SetKey //e.g. "GladiatorsFinale"
    slotKey: SlotKey //e.g. "plume"
    level: number //0-20 inclusive
    rarity: number //1-5 inclusive
    mainStatKey: StatKey
    location: CharacterKey|"" //where "" means not equipped.
    lock: boolean //Whether the artifact is locked in game.
    substats: ISubstat[]
  }
  
interface ISubstat {
    key: StatKey //e.g. "critDMG_"
    value: number //e.g. 19.4
}
  
 type SlotKey = "flower" | "plume" | "sands" | "goblet" | "circlet"