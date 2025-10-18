# Node.js HTTP/HTTPS server

Simple node.js [Dockerfile](./Dockerfile) that runs a mounted [main.js](./app/main.js).

## Motivation

Some web technology needs the browser to be running in a secure context. While this includes browsing to localhost over http and is achieved by extensions such as [Live Preview](https://marketplace.visualstudio.com/items?itemName=ms-vscode.live-server), certain libraries or solutions specifically needs the page to be served over https which Live Preview does not support.

This container definition allows you to host a simple express server over HTTP and HTTPS, serving the provided [/app/served/](./app/served/) folder as static files.

This setup does not handle hot reloading. For more advanced requirements, libraries such as [Vite](https://vite.dev/) could be used in place of express.

## Running

### Provide certificates

See (or modify) [main.js](./app/main.js) for the expected files.

You can bring your own files, or run [generate-certs.sh](./generate-certs.sh) to create HTTPS certificates in [/app/certs](./app/certs).

### Build the image

```sh

docker build -t node-dev-https .

```

At the time of writing, this image is around `182MB`.

### Run the container

- Map the app directory to `/node-server/app`, including the certificates.
- Map desired ports.

```sh

docker run -it --rm -v ./app:/node-server/app -p 8443:443 -p 8080:80 node-dev-https:latest

```
