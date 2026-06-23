FROM quay.io/keycloak/keycloak:26.6.1

COPY keycloak-config/Grupa12SI-realm.json /opt/keycloak/data/import/Grupa12SI-realm.json
COPY keycloak-config/Grupa12SI-users-0.json /opt/keycloak/data/import/Grupa12SI-users-0.json

EXPOSE 8080

ENTRYPOINT ["/opt/keycloak/bin/kc.sh"]
CMD ["start", "--import-realm", "--http-enabled=true", "--http-port=8080", "--proxy-headers=xforwarded", "--hostname-strict=false"]
