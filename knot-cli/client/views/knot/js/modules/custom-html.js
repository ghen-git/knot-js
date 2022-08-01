class KnotGrid extends HTMLElement   
{ 
    constructor() 
    {
        super();

        for(const name of this.getAttributeNames())
            console.log(this.getAttribute(name));
    }
}

customElements.define('knot-grid', KnotGrid);

customElements.whenDefined('knot-grid').then(() => {
    console.log('knot-grid defined');
});