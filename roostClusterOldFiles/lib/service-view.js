/** @babel */
/** @jsx etch.dom **/

import etch from 'etch';

export default class ServiceView {
  constructor(props) {
    this.props = props;
    etch.initialize(this);
  }

  update() {}

  serialize() {
    return {
      deserializer: 'ServiceView',
      uri: this.props.uri
    };
  }
  render() {
        var indexUrl = "atom://roostcluster/lib/services.html";
        // var indexUrl = "file://"+process.env.HOME+"/go/src/github.com/ZB-io/roost-desktop/packages/roostcluster/lib/services.html";
        return(
          <div class="iframe-container">
            <label class="switch">
            <input id="toggle2" 
             onclick={
              function(){
                var tog2 = document.getElementById("toggle2");
                var x2 = document.getElementById('iframe2');
                var table2 = document.getElementById("table2");
                
                if(tog2.checked){
                  x2.style.display = "none";
                  table2.style.display = "block";
                }
                else{
                  x2.style.display = "block";
                  table2.style.display = "none";
                }
              }
            } type="checkbox" />
            <span class="slider round"></span>
          </label> 
              <div id="iframe2" style="display:block">
                <iframe src={indexUrl} style="overflow:hidden;height:100%;width:100%" height="100%" width="100%" allowfullscreen frameborder="0" scrolling="no"> </iframe>
              </div>
              <div id="table2" style="display:none">
                <iframe src='atom://roostcluster/lib/serviceTable.html' style="overflow:hidden;height:100%;width:100%" height="100%" width="100%" allowfullscreen frameborder="0" scrolling="no"> </iframe>
              </div>
          </div>
        );
  }

  getURI() {
      console.log(this.props.uri);
      return this.props.uri;
  }

  getTitle() {
    return 'Services';
  }

  isEqual(other) {
    return other instanceof ServiceView;
  }
}
