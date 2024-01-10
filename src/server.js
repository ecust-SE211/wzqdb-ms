const express = require('express');
import {
	createProxyMiddleware
} from "http-proxy-middleware";
const startServer = () => {
	const app = express();

	var targetUrl = '';

	const dynamicProxy = (target) => {
		return createProxyMiddleware({
			target: target,
			changeOrigin: true,
			secure: false,
			selfHandleResponse: true,
			onProxyReq: (proxyReq, req, res) => {
				if (req.body) {
					const bodyData = JSON.stringify(req.body)
					proxyReq.setHeader("Content-Type", "application/json")
					proxyReq.setHeader("Content-Length", Buffer.byteLength(bodyData))
					proxyReq.write(bodyData)
				}
			},
			onProxyRes: async (proxyRes, req, res) => {
				let bodyRes
				bodyRes = await getBody(proxyRes)
				console.log("1 res from proxied server:", bodyRes);
				res.json({
					code: 200,
					data: bodyRes,
				})
			},
			onError: (err, req, res) => {
				res.writeHead(500, {
					'Content-Type': 'text/plain',
				});
				res.end('Something went wrong. And we are reporting a custom error message.');
			}
		});
	};

	function getBody(proxyRes: IncomingMessage) {
		return new Promise((resolve, reject) => {
			let body = []
			proxyRes.on('data', function(chunk) {
				body.push(chunk)
			})
			let bodyStr = ""
			proxyRes.on('end', function() {
				bodyStr = Buffer.concat(body).toString()
				console.log('getBody ======', bodyStr)
				resolve(bodyStr)
			})
		})
	}

	app.use((req, res, next) => {
		dynamicProxy(targetUrl)(req, res, next);
	});

	// 启动服务器
	const port = 3000;
	app.listen(port, () => {
		console.log(`Server is running on http://localhost:${port}`);
	});

	const updateTarget = (target) => {
		if (target != targetUrl) {
			app._router.stack.pop()
			app.use((req, res, next) => {
				dynamicProxy(target)(req, res, next);
			});
			targetUrl = target;
		}
	}

	export default updateTarget;
}
if (require.main === module) {
	startServer();
}