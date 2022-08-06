import { htmlToElement } from './util.js';

init();

function init()
{
    if(document.querySelector('body.blueprint') != null)
    {
        displayGrid(document.querySelectorAll('.grid'));
        displayGrid(document.querySelectorAll('knot-grid'));
    }
}

function displayGrid(gridsRef)
{
    let grids = [];

    for(const grid of gridsRef)
    {
        let rows, cols, background;
        
        if(grid.hasAttribute('cols') && grid.hasAttribute('rows'))
        {
            const rowsStyle = parseGridStyle(grid.getAttribute('rows'));
            const colsStyle = parseGridStyle(grid.getAttribute('cols'));

            rows = getGridNumber(rowsStyle);
            cols = getGridNumber(colsStyle);

            background = `<background><grid style='
            grid-template-rows: ${rowsStyle};
            grid-template-columns: ${colsStyle};
            '>`;
        }
        else
        {
            for(const cls of grid.classList)
            {
                if(cls.includes('grid-rows-'))
                    rows = cls.replace('grid-rows-', '');
                else if(cls.includes('grid-cols-'))
                    cols = cls.replace('grid-cols-', '');
            }
            background = `<background><grid class='grid-rows-${rows} grid-cols-${cols}'>`;
        }

        background += grid.innerHTML;

        const fillerItemsCount = getFillerItemsCount(grid, rows, cols);

        for(let i = 0; i < fillerItemsCount; i++)
            background += '<grid-item></grid-item>'
        
        background += `</grid></background>`;

        grids.push({grid: grid, background: background});
    }

    for(const grid of grids)
    {
        grid.grid.append(htmlToElement(grid.background));
    }
}

function getFillerItemsCount(grid, rows, cols)
{
    const children = grid.querySelectorAll(':scope > *');
    let n = rows * cols;

    for(const item of children)
    {
        const rowSpan = getSpan(item, 'row', rows) ?? 1;
        const colSpan = getSpan(item, 'col', cols) ?? 1;

        n -= (rowSpan * colSpan);
    }

    return n;
}

function getSpan(item, type, fullN)
{
    for(const cls of item.classList)
        if(cls.includes(`${type}-span-`))
        {
            const n = cls.split('-').pop();
            return n == 'full' ? fullN : parseInt(n);
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