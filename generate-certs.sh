#!/bin/sh

set -e

CERTS_DIR=./app/certs
RSA_PRIVATE_KEY_FILE="$CERTS_DIR"/rsa-private.key
X509_CERT_FILE="$CERTS_DIR"/x509-signed.crt
SUBJ_COMMON_NAME="localhost"

for cert_file in $RSA_PRIVATE_KEY_FILE $X509_CERT_FILE
do
    if [ -f "$cert_file" ]; then
        echo "The file '${cert_file}' already exists. Delete the file before running the script again." >&2
        exit 1
    fi
done

mkdir -p "$CERTS_DIR"

TMP_CONFIG="tmp_openssl.cnf"

cat > "$TMP_CONFIG" <<EOF
[dn]
CN=${SUBJ_COMMON_NAME}
[req]
distinguished_name = dn
[EXT]
subjectAltName=DNS:${SUBJ_COMMON_NAME}
keyUsage=digitalSignature
extendedKeyUsage=serverAuth
EOF

# https://letsencrypt.org/docs/certificates-for-localhost/
openssl req -x509 \
  -newkey rsa:2048 \
  -nodes \
  -sha256 \
  -extensions EXT \
  -subj /CN="$SUBJ_COMMON_NAME" \
  -out "$X509_CERT_FILE" \
  -keyout "$RSA_PRIVATE_KEY_FILE" \
  -config "$TMP_CONFIG"

rm "$TMP_CONFIG"

echo "Certificate and private key generated and saved to '$CERTS_DIR'"
