# Backend

## Development

This application uses Firebase. Generate a new firebase private key and convert it to base64. This allows for a simple, single value to be used for the environment variable.

To set the convert the private key to a base64 string securely, run `btoa(JSON.stringify({...your private key here}))`

### Lint

`golangci-lint run`

### Test

`go test .`

### Build

_Note: CGO must be enabled for fitz image conversion_

`CGO_ENABLED=1 GOOS=linux go build -ldflags="-s -w" -a -installsuffix cgo -o main .`

### Docker

`docker build -t application-tracker-backend .`
`docker run -e FIREBASE.CREDENTIALS_BASE64="your_base64_private_key" -p 8080:8080 application-tracker-backend`
