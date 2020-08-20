/** @babel */
/** @jsx etch.dom **/

/** atom://roostcluster/lib/index.html **/

import etch from 'etch';

export default class DockerView {
  constructor(props) {
    this.props = props;
    etch.initialize(this);
  }

  update() {}

  serialize() {
    return {
      deserializer: 'Docker View',
      uri: this.props.uri
    };
  }

  render() {
    var indexUrl = "atom://docker-view/lib/index.html";
      return(
          <div class="iframe-container" id="iframe6" style="display:block">
              <webview id="podView" class="Webview"  src={indexUrl} style="overflow:hidden;height:100%;width:100%" disablewebsecurity nodeintegration height="100%" width="100%" allowfullscreen frameborder="0" scrolling="no"> </webview>
          </div>
      );
  }

  getURI() {
    return this.props.uri;
  }

  getTitle() {
    return 'DockerView';
  }

  isEqual(other) {
    return other instanceof DockerView;
  }

  updateUrl(ns, state){
    console.log(ns);
    console.log(state)
    this.indexUrl2 = "https://github.com"
  }
}
