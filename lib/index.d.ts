declare type OAuth2StrategyOptions = import("passport-oauth2").StrategyOptions;
declare type PassportProfile = import("passport").Profile

declare module "passport-coinbase" {
    export interface Profile extends PassportProfile {
        profileLocation: string,
        profileBio: string,
        profileUrl: string,
        timeZone: string,
        nativeCurrency: string,
        bitcoinUnit: string,
        country: { code: string, name: string },
        createdAt: Date,
      
        _raw: string;
        _json: any;
    }

    export interface StrategyOptions extends OAuth2StrategyOptions {
        enableProof?: boolean;
        profileFields?: string[];

        authorizationURL?: string;
        tokenURL?: string;
        profileURL?: string;
        graphAPIVersion?: string;

        display?: 'page' | 'popup' | 'touch';

        authType?: 'reauthenticate';
        authNonce?: string;
    }

    export type VerifyFunction =
        (accessToken: string, refreshToken: string, profile: Profile, done: (error: any, user?: any, info?: any) => void) => void;

    export class Strategy implements passport.Strategy {
        constructor(options: StrategyOptions, verify: VerifyFunction);
        name: string;
        authenticate(req: express.Request, options?: object): void;
    }
}