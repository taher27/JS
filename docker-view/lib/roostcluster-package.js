/** @babel */

import {CompositeDisposable} from 'atom';
const DockerView = require('./docker-view');

export default class RoostclusterPackage {
    constructor() { }

    async activate() {
        this.subscriptions = new CompositeDisposable();
        this.dockerPanel = atom.workspace.addModalPanel({item: new DockerView(), visible: false});

        this.subscriptions.add(
            atom.commands.add('atom-workspace', {
                'application:dockerImage': () => {
                    this.toggle()
                }
            })
        );
    }

    toggle() {
        if(this.dockerPanel.isVisible() == true) {
            this.dockerPanel.hide()
            console.log(typeof this.dockerPanel.isVisible())
        } else {
            this.dockerPanel.show()
            console.log(typeof this.dockerPanel.isVisible())
        }
    }

    deactivate() {
        this.subscriptions.dispose();
        this.dockerPanel.destroy();
    }
}
