"use strict";
require('dotenv').config()
Object.defineProperty(exports, "__esModule", { value: true });
var fs_1 = require("fs");
var j = {
    type: process.env.GD_TYPE || "",
    project_id: process.env.GD_PROJECT_ID || "",
    private_key_id: process.env.GD_PRIVATE_KEY_ID || "",
    private_key: process.env.GD_PRIVATE_KEY || "",
    client_email: process.env.GD_CLIENT_EMAIL || "",
    client_id: process.env.GD_CLIENT_ID || "",
    auth_uri: process.env.GD_AUTH_URI || "",
    token_uri: process.env.GD_TOKEN_URI || "",
    auth_provider_x509_cert_url: process.env.GD_AUTH_PROVIDER || "",
    client_x509_cert_url: process.env.GD_CLIENT_X509 || "",
    universe_domain: process.env.GD_UNIVERSE_DOMAIN || "",
};
function credentials() {
    var file = "./config/credentials.json";
    (0, fs_1.writeFile)(file, JSON.stringify(j, null, 2), 'utf8', function (err) {
        if (err) {
            console.error('Ocorreu um erro ao gravar o arquivo JSON:', err);
            return;
        }
    });
}
credentials();
