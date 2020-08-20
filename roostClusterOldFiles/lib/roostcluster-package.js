/** @babel */

import {CompositeDisposable} from 'atom';
import ReporterProxy from './reporter-proxy';

let PodView, ServiceView, DeploymentView, ReplicaView, GraphView, LineGraphView, ObserveServiceView;

const POD_URI = 'atom://roostcluster/pod';
const SERVICE_URI = 'atom://roostcluster/service';
const DEPLOYMENT_URI = 'atom://roostcluster/deployment';
const REPLICA_URI = 'atom://roostcluster/replica';
const GRAPH_URI = 'atom://roostcluster/graph';
const LINEGRAPH_URI = 'atom://roostcluster/linegraph';
const OBSERVE_SERVICE_URI = 'atom://roostcluster/observeservice'

export default class RoostclusterPackage {
    constructor() {
        this.reporterProxy = new ReporterProxy();
    }

    async activate() {
        var receiveMessage = function (event) {
            // console.log("Recieved event " + event.channel);
            
            // console.log("Received Data "+ event.args[0])
            if (event.channel == "podTerminal"){
            var terminalArgs = event.args[0].split(',');
            var command = ["/usr/local/bin/roostctl --kubeconfig /var/tmp/Roost/.kube/config.roostctl exec -n " + terminalArgs[1] + " -it " + terminalArgs[0] + " --container " + terminalArgs[2] + " -- /bin/sh",event.args[0]]
            atom.commands.dispatch(atom.views.getView(atom.workspace), 'platformio-ide-terminal:pod-terminal',command)
        
        }
    }
        window.addEventListener("ipc-message", receiveMessage, true);
       

        this.subscriptions = new CompositeDisposable();

        this.subscriptions.add(
            atom.workspace.addOpener(filePath => {
                if (filePath === POD_URI) {
                    return this.createPodView({uri: POD_URI});
                }
            })
        );

        this.subscriptions.add(
            atom.workspace.addOpener(filePath => {
                if (filePath === OBSERVE_SERVICE_URI) {
                    return this.createObserveServiceView({uri: OBSERVE_SERVICE_URI});
                }
            })
        );

        this.subscriptions.add(
            atom.workspace.addOpener(filePath => {
                if (filePath === SERVICE_URI) {
                    return this.createServiceView({uri: SERVICE_URI});
                }
            })
        );

        this.subscriptions.add(
            atom.workspace.addOpener(filePath => {
                if (filePath === DEPLOYMENT_URI) {
                    return this.createDeploymentView({uri: DEPLOYMENT_URI});
                }
            })
        );
        this.subscriptions.add(
            atom.workspace.addOpener(filePath => {
                if (filePath === REPLICA_URI) {
                    return this.createReplicaView({uri: REPLICA_URI});
                }
            })
        );

        this.subscriptions.add(
            atom.workspace.addOpener(filePath => {
                if (filePath === GRAPH_URI) {
                    return this.createGraphView({uri: GRAPH_URI});
                }
            })
        );

        this.subscriptions.add(
            atom.workspace.addOpener(filePath => {
                if (filePath === LINEGRAPH_URI) {
                    return this.createLineGraphView({uri: LINEGRAPH_URI});
                }
            })
        );
    }


    consumeReporter(reporter) {
        return this.reporterProxy.setReporter(reporter);
    }

    deactivate() {
        this.subscriptions.dispose();
    }

    createPodView(state) {
        if (PodView == null) PodView = require('./pod-view');
        return new PodView({reporterProxy: this.reporterProxy, ...state});
    }

    createObserveServiceView(state) {
        if (ObserveServiceView == null) ObserveServiceView = require('./observe_service-view');
        return new ObserveServiceView({reporterProxy: this.reporterProxy, ...state});
    }

    createServiceView(state) {
        if (ServiceView == null) ServiceView = require('./service-view');
        return new ServiceView({reporterProxy: this.reporterProxy, ...state});
    }

    createDeploymentView(state) {
        if (DeploymentView == null) DeploymentView = require('./deployment-view');
        return new DeploymentView({reporterProxy: this.reporterProxy, ...state});
    }

    createReplicaView(state) {
        if (ReplicaView == null) ReplicaView = require('./replica-view');
        return new ReplicaView({reporterProxy: this.reporterProxy, ...state});
    }

    createGraphView(state) {
        if (GraphView == null) GraphView = require('./graph-view');
        return new GraphView({reporterProxy: this.reporterProxy, ...state});
    }

    createLineGraphView(state) {
        if (LineGraphView == null) LineGraphView = require('./linegraph-view');
        return new LineGraphView({reporterProxy: this.reporterProxy, ...state});
    }
}
