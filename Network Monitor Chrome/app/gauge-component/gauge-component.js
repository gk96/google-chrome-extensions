class GaugeComponent extends HTMLElement{

    constructor(){
        super();
        // element created
        this.innerHTML = `
        <div id="downGauge" style="float: left;"></div>
        <div id="upGauge" style="float: right;"></div>
        `;

        upGauge:JustGage;
        downGauge:JustGage;
    }

    connectedCallback(){
        this.upGauge = new JustGage({
            id: "upGauge", // the id of the html element
            value: 0,
            min: 0,
            max: 1000,
            decimals: 2,
            gaugeWidthScale: 1.0,
            label: ''
        });
        
        this.downGauge = new JustGage({
            id: "downGauge", // the id of the html element
            value: 0,
            min: 0,
            max: 1000,
            decimals: 2,
            gaugeWidthScale: 1.0,
            title: "Download",
            titleFontSize: "10",
            titlePosition: "below",
            label: ''
        });
    }

    static get observedAttributes() { 
        return ['upspeed', 'downspeed', 'speedunit'];
    }

    attributeChangedCallback(name, oldValue, newValue) {
        switch (name){
            case 'upspeed' :
                this.upGauge.refresh(newValue); 
                break;

            case 'downspeed' :
                this.downGauge.refresh(newValue);
                break;

            case 'speedunit' :
                if (newValue == 'Mbps')
                {
                    this.upGauge.refreshMaxValue(150)
                    this.downGauge.refreshMaxValue(150)
                }
                else
                {
                    this.upGauge.refreshMaxValue(1000)
                    this.downGauge.refreshMaxValue(1000)
                }
                this.downGauge.refreshLabel(newValue)
                this.upGauge.refreshLabel(newValue)
                break;
        }
    }
}

window.customElements.define("gauge-component", GaugeComponent);



