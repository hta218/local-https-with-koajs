const app = require('./server')
const https = require('https')
const fs = require('fs')
const path = require('path')

let certOptions = null
try {
	certOptions = {
		key: fs.readFileSync(path.resolve('certs/server.key')),
		cert: fs.readFileSync(path.resolve('certs/server.crt'))
	}
} catch(err) {
	console.log('No certificate files found!')
}

const host = process.env.APP_URL || 'localhost'
const isLocal = host === 'localhost'
const enableHTTPSInLocal = Boolean(isLocal && certOptions)

const port = enableHTTPSInLocal ? 443 : process.env.PORT || 3434
const protocol = (isLocal && !certOptions) ? "http" : "https"

const url = `${protocol}://${host}${isLocal ? `:${port}` : ''}`

const callback = () =>	 {
	console.log(`App start successfully at ${url}`)
}

if (enableHTTPSInLocal) {
	https
    .createServer(certOptions || {}, app.callback())
    .listen(port, callback)
} else {
	app.listen(port, callback)
}
