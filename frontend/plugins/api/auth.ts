const TOKEN_COOKIE = 'token';

type Token = {
    access_token: string,
    refresh_token: string,
    expireTime: number,
}

export class AuthHandler {
    constructor(private cookies: any) {
    }

    storeToken(token: Token) {
        token.expireTime = Math.floor(Date.now() / 1000) + token.expireTime;
        this.cookies.set(TOKEN_COOKIE, JSON.stringify(token), {
            path: '/',
            maxAge: 60 * 60 * 24 * 7
        });
    }

    private cachedToken: Token = {
        access_token: '',
        refresh_token: '',
        expireTime: 0
    };

    getToken(useCache: boolean = true): Token {
        if (useCache) {
            if (this.cachedToken?.access_token && this.cachedToken?.refresh_token) {
                return this.cachedToken;
            }
        }
        let text = this.cookies.get(TOKEN_COOKIE);
        if (text)
            this.cachedToken = text;

        return this.cachedToken;
    }

    getAccessToken(): string {
        return this.getToken() ? this.getToken().access_token : '';
    }

    getRefreshToken(): string {
        return this.getToken().refresh_token;
    }

    isTokenExpired(): boolean {
        if (!this.getRefreshToken()) return false;
        let expireTime = this.getToken().expireTime;
        let currentTime = Math.floor(Date.now() / 1000);
        return (expireTime-3) < currentTime;
    }

    removeToken() {
        this.cachedToken = {
            access_token: '',
            refresh_token: '',
            expireTime: 0
        };
        this.cookies.remove(TOKEN_COOKIE);
    }
}
