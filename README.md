# Node.js HTTP/HTTPS development server

Simple node.js [Dockerfile](./Dockerfile) that runs a mounted [main.js](./app/main.js).

## Motivation

Some web technology needs the browser to be running in a secure context. While this includes browsing to localhost over http and is achieved by extensions such as [Live Preview](https://marketplace.visualstudio.com/items?itemName=ms-vscode.live-server), certain libraries or solutions specifically needs the page to be served over https which Live Preview does not support. This makes development of simple static pages cumbersome if it involves libraries or login flows that explicitly have this requirement.

This container definition allows you to host a simple express server over HTTP and HTTPS, serving the [/app/served/](./app/served/) directory (or a directory of your choice) as static files.

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

docker run -it --rm \
-p 8080:80 \
-p 8443:443 \
-v ./app:/node-server/app \
node-dev-https:latest

```

It should now be possible to browse to <http://localhost:8080/> and <https://localhost:8443/> to view the example content.

Rather than moving your files, you can bind a particular directory to be served:

```sh

docker run -it --rm \
-p 8080:80 \
-p 8443:443 \
-v ./app:/node-server/app \
-v /path/to/local-content:/node-server/app/served \
node-dev-https:latest

```
