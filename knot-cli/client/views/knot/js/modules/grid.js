document.addEventListener('preinit', init);

function init()
{
    const gridsRef = document.querySelectorAll('knot-grid');
    
    for(const grid of gridsRef)
    {
        let rows, cols, background;
        
        if(grid.hasAttribute('cols') && grid.hasAttribute('rows'))
        {
            const rowsStyle = parseGridStyle(grid.getAttribute('rows'));
            const colsStyle = parseGridStyle(grid.getAttribute('cols'));

            rows = getGridNumber(rowsStyle);
            cols = getGridNumber(colsStyle);

            grid.style.gridTemplateRows = rowsStyle;
            grid.style.gridTemplateColumns = colsStyle;
            background = `<background><grid style='
            grid-template-rows: ${rowsStyle};
            grid-template-columns: ${colsStyle};
            '>`;
        }
    }
}

function parseGridStyle(style)
{
    let parsedStyle = [];
    const statements = style.split(' ');

    for(const statement of statements)
    {
        if(statement.match(/\d+-\d+/) != null)
        {
            let repeatN = statement.split('-')[0];
            let fr = statement.split('-')[1];

            parsedStyle.push(`repeat(${repeatN}, minmax(0, ${fr}fr))`)
        }
        else
            parsedStyle.push(statement);
    }

    return parsedStyle.join(' ');
}

function getGridNumber(style)
{
    //removing unused spaces
    style = style.replaceAll(/ {2,}/g, ' ');
    style = style.replaceAll(/ *, */g, ',');
    const statements = style.split(' ');
    let n = statements.length;

    for(const statement of statements)
        if(statement.includes('repeat'))
        {
            let str = statement.split('repeat(').pop();
            str = str.split(',')[0];
            str = str.match(/\d+/)[0];
            n += parseInt(str) - 1;
        }
    
    return n;
}