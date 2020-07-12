class TableComponent extends HTMLElement {
    constructor() {
      super();
      // element created
      this.innerHTML = `
      <div class="container">
      <table class="table table-bordered table-hover" id = "networkActivity" border ="1" style="width: auto !important;">
        <thead class="thead-dark">
          <th>Process Id</th>
          <th>Program Name</th>
          <th>Local Address</th>
          <th>Remote Address</th>
          <th>Protocol</th>
          <th>Status</th>
        </thead>
        <tbody>
            <tr>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
            </tr>
            <tr>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
          </tr>
          <tr>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
          </tr>
          <tr>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
          </tr>
          <tr>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
          </tr>
          <tr>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
          </tr>
          <tr>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
          </tr>
          <tr>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
          </tr>
          <tr>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
          </tr>
          <tr>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
          </tr>
        </tbody>
      </table>
  </div> `
  data:Array // Table Data
    }

    connectedCallback(){
        this.data = [];
        console.log(this.getAttribute("data"))
        
        //this.data.push(JSON.parse(this.getAttribute("data")));
        //console.log(this.data)
        
    }

    static get observedAttributes() { 
        return ['data'];
    }

    attributeChangedCallback(name, oldValue, newValue) {

        //console.log(JSON.parse(newValue))
        switch (name){
            case "data" :
                updateTableCells(newValue)
        }
    }

    
}

function updateTableCells(data){
    var tableData = JSON.parse(data)
    var keys = []
    for(var key in tableData[1])
    {
        keys.push(key);
    }
    console.log(tableData)
    var table = document.querySelector("#networkActivity");
    if (table != null)
    {
        for (var r = 1; r < table.rows.length; r++)
        {
            if(table.rows != null)
            {
                for (var c = 0; c < table.rows[r].cells.length; c++)
                {
                    if(tableData[r] != null)
                    {
                        switch (tableData[r][keys[c]]){
                            case "ESTABLISHED" :
                                table.rows[r].className = "table-success"
                                break;

                            case "LISTEN" :
                                table.rows[r].className = "table-warning"
                                break;

                            default :
                                table.rows[r].className = ""
                                break;
                        }
                        table.rows[r].cells[c].innerHTML = tableData[r][keys[c]]
                    }
                    
                }
            }
        }
    }
}

window.customElements.define("table-component", TableComponent);