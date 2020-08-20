/** @babel */
/** @jsx etch.dom **/

/** atom://roostcluster/lib/index.html **/

import etch from 'etch';

export default class LineGraphView {
  constructor(props) {
    this.props = props;
    etch.initialize(this);
  }

  update() {}

  serialize() {
    return {
      deserializer: 'LineGraphView',
      uri: this.props.uri
    };
  }

  render() {
    var indexUrl = "atom://roostcluster/lib/linegraph.html";
    // var indexUrl = "file://"+process.env.HOME+"/go/src/github.com/ZB-io/roost-desktop/packages/roostcluster/lib/pods.html";
      return(
        <div class="iframe-container" id="iframe4" style="display:block">
          {/* <iframe src={indexUrl} height="100%" width="100%" allowfullscreen frameborder="0" scrolling="no"></iframe> */}
          <webview id="lineGraphView" class="Webview"  src={indexUrl} style="overflow:hidden;height:100%;width:100%" disablewebsecurity nodeintegration height="100%" width="100%" allowfullscreen frameborder="0" scrolling="no"> </webview>
        </div>
      );
  }

  getURI() {
    return this.props.uri;
  }

  getTitle() {
    return 'CPU and Memory Usage';
  }

  isEqual(other) {
    return other instanceof LineGraphView;
  }
}
