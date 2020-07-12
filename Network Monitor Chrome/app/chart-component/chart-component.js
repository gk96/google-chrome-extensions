class ChartComponent extends HTMLElement {
    constructor() {
      super();
      // element created
      this.innerHTML = `
    <div class="container">
      <canvas id="myCtx" style="height: 10%;"></canvas>
    </div>`
        myChart:Chart; // Chart 
        uploadData:Array // Upload Speed Data
        downloadData:Array // Download Speed Data
    }

    connectedCallback(){
        this.uploadData = []
        this.downloadData = []

        this.uploadData.push(JSON.parse(this.getAttribute("uploaddata")));
        this.downloadData.push(JSON.parse(this.getAttribute("downloaddata")));

         // Chart Rendering
        var ctx = document.getElementById("myCtx");
 
        this.myChart = new Chart(ctx, {
        type: 'scatter',
        data: {
        datasets: [
            {
            label: 'Upload',
            data: [{x:this.uploadData[0], y:this.uploadData[1]}],
            showLine: true,
            fill: false,
            borderColor: 'rgba(0, 200, 0, 1)'
            },
            {
            label: 'Download',
            data: [{x: this.downloadData[0], y: this.downloadData[1]}],
            showLine: true,
            fill: false,
            borderColor: 'rgba(200, 0, 0, 1)'
            }
        ]
        },
        options: {
        tooltips: {
            mode: 'index',
            intersect: false,
        },
        hover: {
            mode: 'nearest',
            intersect: true
        },
        scales: {
            xAxes: [{
            scaleLabel: {
                display: true,
                labelString: 'Time (sec)'
            }
            }],
            yAxes: [{
            ticks: {
                beginAtZero:true
            },
            scaleLabel: {
                display: true,
                labelString: 'Kilobytes (Kb)'
            }
            }]
            },
            }
        });
    }

    static get observedAttributes() { 
        return ['uploaddata', 'downloaddata'];
    }
    
    attributeChangedCallback(name, oldValue, newValue) { 
    
        switch (name){
            case 'uploaddata': 
                //console.log(newValue)
                this.uploadData.push(JSON.parse(newValue))
                this.myChart.data.datasets[0].data = this.uploadData 
                if(this.uploadData.length > 12)
                {
                    this.uploadData.shift(); 
                }
                this.myChart.update();
                break;

            case 'downloaddata':
                this.downloadData.push(JSON.parse(newValue))
                this.myChart.data.datasets[1].data = this.downloadData 
                if(this.downloadData.length > 12)
                { 
                    this.downloadData.shift();
                }
                this.myChart.update();
                break;
            }
        }

}

window.customElements.define("chart-component", ChartComponent);