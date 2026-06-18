import type { OAuthConfig, OAuthUserConfig } from "next-auth/providers";

export interface UAuthProfile extends Record<string, any> {
  sub: string;
  name: string;
  email: string;
  picture: string;
}

export default function UAuth<P extends UAuthProfile>(
  options: OAuthUserConfig<P> & { issuer: string }
): OAuthConfig<P> {
  return {
    id: "uauth",
    name: "UAuth",
    type: "oidc",
    authorization: {
      params: { scope: "openid profile email" },
    },
    checks: ["pkce", "state", "nonce"],
    profile(profile) {
      return {
        id: profile.sub,
        name: profile.name,
        email: profile.email,
        image: profile.picture,
      };
    },
    ...options,
  };
}
