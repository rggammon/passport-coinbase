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

    // https://developers.coinbase.com/docs/wallet/coinbase-connect/reference
    export interface StrategyOptions extends OAuth2StrategyOptions {
        authorizationURL?: string;
        tokenURL?: string;
        userProfileURL?: string;
        account?: 'select' | 'all';
        referral?: string;
        accountCurrency?: string;
        sendLimitAmount?: string;
        sendLimitCurrency?: string;
        sendLimitPeriod?: 'day' | 'month' | 'year';

        // layout and meta[name] (sessionName) should be passed to authenticate,
        // as it does not make sense to set them in the constructor (globally).
    }

    export type VerifyFunction =
        (accessToken: string, refreshToken: string, profile: Profile, done: (error: any, user?: any, info?: any) => void) => void;

    export class Strategy implements passport.Strategy {
        constructor(options: StrategyOptions, verify: VerifyFunction);
        name: string;
        authenticate(req: express.Request, options?: object): void;
    }
}