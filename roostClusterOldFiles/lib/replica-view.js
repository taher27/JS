/** @babel */
/** @jsx etch.dom **/

import etch from 'etch';

export default class ReplicaView {
  constructor(props) {
    this.props = props;
    etch.initialize(this);
  }

  update() {}

  serialize() {
    return {
      deserializer: 'ReplicaView',
      uri: this.props.uri
    };
  }

  render() {
    return(
      <body> 
        <nav class="navbar navbar-dark bg-dark">
            <button 
            type="button" 
            class="btn btn-dark" 
            onclick={
              function(){
                xmlhttp = new XMLHttpRequest();
                const head = document.getElementById('heading3');
                head.innerHTML="Replica";
                xmlhttp.onreadystatechange = function() {
                    if (this.readyState == 4 && this.status == 200) {
                        var myArr = JSON.parse(this.responseText);
                        var arr = myArr.Relica;
                        var out = '<thead>'+'<tr>'+'<th scope="col">#</th>'+'<th scope="col">Name</th>';
                                var i;
                                for(i = 0; i < arr.length; i++) {
                                    out += '<tr><th scope="row">'+(i+1)+'</th>'+'<td>'+arr[i].metadata.name +'</td></tr>';
                                }
                                out +='</tbody>';
                        const data = document.getElementById("id03");
                        data.innerHTML = out;
                    }
                };
                xmlhttp.open("GET", 'http://localhost:60000/api/scrape/default?type=all&labelSelector&fieldSelector', true);
                xmlhttp.send(); 
                // setInterval(location.reload(), 1000);
            }}>
              Refresh
              </button>
              {/* Services */}
            </nav>
            <h1 id="heading3"></h1>
    <table class="table table-striped" id="id03"></table>
    </body>
    );
    
  }

  getURI() {
      console.log(this.props.uri);
    return this.props.uri;
  }

  getTitle() {
    return 'Relica';
  }

  isEqual(other) {
    return other instanceof ReplicaView;
  }
}
