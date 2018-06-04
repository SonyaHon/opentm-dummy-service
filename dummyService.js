const RPC = require('node-json-rpc');
const EventEmmitter = require('events');

class DummyService extends EventEmmitter {
	constructor(props) {
		super();
		this.config = props.config;
		this.rpcServer = new RPC.Server(props.config);
		this.rpcClient = new RPC.Client(props.hubConfig);
		this.name = props.name;
		this.reqID = 0;
		this.info = props.info;
		this.rpcServer.addMethod('ping', (params, clb) => {
			clb(undefined, true);
		});
		this.rpcServer.addMethod('restart', this.Restart);
	}
	Restart(params, clb) {
		console.error('You must have a restart method with arguments params and callback. If you dont override this method the standart one will be used.' +
			'You should remember that this will only kill the proccess and itll need to be started again manually');
			clb(undefined, true);
			process.exit(0);
	}
	__call(methodName, params, clb) {
		this.rpcClient.call({ "jsonrpc": "2.0", "method": methodName, "params": params, "id": this.reqID + '' },
			clb
		);
		this.reqID++;
	}
	DoServiceExists(serviceName, clb) {
		this.__call('doServiceExists', {
			serviceName
		}, (err, res) => {
			if(res.result) clb();
		})
	}
	GetServices(clb) {
		this.__call('getServices', null, clb);
	}
	Start() {
		this.rpcServer.start((err) => {
			if(err) throw err;
			else console.log('Service started');
		});
		this.__call('attachService', {
			serviceName: this.name,
			info: this.info,
			config: this.config
		}, (err, res) => {
			if(err) throw err;
			else console.log(res);
		});
	}
}

module.exports = DummyService;