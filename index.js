const Service = require('./dummyService');

/**
 *
 * This is just a test file for dummy services
 *
 *
 */

let service = new Service({
	config: {
		port: 8081,
		host: "127.0.0.1",
		path: "/",
		strict: true
	},
	hubConfig: {
		port: 8080,
		host: "127.0.0.1",
		path: "/",
		strict: true
	},
	name: 'DummyService',
	info: 'Just a test service'
});

service.Start();
service.DoServiceExists('DummyService', () => {
	service.GetServices((err, res) => {
		console.log(res);
	})
});