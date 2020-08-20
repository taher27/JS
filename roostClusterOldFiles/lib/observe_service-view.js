/** @babel */
/** @jsx etch.dom **/

/** atom://roostcluster/lib/index.html **/

import etch from 'etch';
import { webviewTag } from 'electron';

export default class ObserveServiceView {
  constructor(props) {
    this.props = props;
    etch.initialize(this);
  }

  update() {}

  serialize() {
    return {
      deserializer: 'ObserveServiceView',
      uri: this.props.uri
    };
  }

  render() {
    
    // var indexUrl = "file://"+process.env.HOME+"/go/src/github.com/ZB-io/roost-desktop/packages/roostcluster/lib/pods.html";
      return(
          <div class="iframe-container" id="iframe5" style="display:block">
            <iframe src="http://roost-master:30001" style="overflow:hidden;height:100%;width:100%" height="100%" width="100%" allowfullscreen frameborder="0" scrolling="yes"> </iframe>
          </div>
      );
  }

  getURI() {
    return this.props.uri;
  }

  getTitle() {
    return 'ObserveService';
  }

  isEqual(other) {
    return other instanceof ObserveServiceView;
  }

  updateUrl(ns, state){
    console.log(ns);
    console.log(state)
    this.indexUrl2 = "https://github.com"
  }
}
