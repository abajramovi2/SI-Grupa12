import { resolveKeycloakConfig } from "../BLL/Config/KeycloakConfig";

describe("resolveKeycloakConfig", () => {
  test("izvodi issuer i JWKS adresu iz jednog Keycloak URL-a", () => {
    const config = resolveKeycloakConfig({
      KEYCLOAK_URL: "https://keycloak.example.com/",
      KEYCLOAK_REALM: "Grupa12SI",
      KEYCLOAK_CLIENT_ID: "public",
    });

    expect(config.keycloakUrl).toBe("https://keycloak.example.com");
    expect(config.jwtIssuer).toBe(
      "https://keycloak.example.com/realms/Grupa12SI"
    );
    expect(config.jwksUri).toBe(
      "https://keycloak.example.com/realms/Grupa12SI/protocol/openid-connect/certs"
    );
  });

  test("zadrzava eksplicitni interni JWKS URL za Docker", () => {
    const config = resolveKeycloakConfig({
      KEYCLOAK_URL: "http://localhost:8080",
      JWKS_URI: "http://keycloak:8080/realms/Grupa12SI/protocol/openid-connect/certs",
    });

    expect(config.jwksUri).toBe(
      "http://keycloak:8080/realms/Grupa12SI/protocol/openid-connect/certs"
    );
  });

  test("zaustavlja startup kada KEYCLOAK_URL nedostaje", () => {
    expect(() => resolveKeycloakConfig({})).toThrow("KEYCLOAK_URL nije definisan.");
  });
});
