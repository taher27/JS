/** @babel */
/** @jsx etch.dom **/

/** atom://roostcluster/lib/index.html **/

import etch from 'etch';

export default class GraphView {
  constructor(props) {
    this.props = props;
    etch.initialize(this);
  }

  update() {}

  serialize() {
    return {
      deserializer: 'GraphView',
      uri: this.props.uri
    };
  }

  render() {
    var indexUrl = "atom://roostcluster/lib/graph.html";
    // var indexUrl = "file://"+process.env.HOME+"/go/src/github.com/ZB-io/roost-desktop/packages/roostcluster/lib/pods.html";
      return(
        <div class="iframe-container" id="iframe3" style="display:block">
                    <iframe src={indexUrl} style="overflow:hidden;height:100%;width:100%" height="100%" width="100%" allowfullscreen frameborder="0" scrolling="no"> </iframe>
        </div>
      );
  }

  getURI() {
    return this.props.uri;
  }

  getTitle() {
    return 'Graphs';
  }

  isEqual(other) {
    return other instanceof GraphView;
  }
}
