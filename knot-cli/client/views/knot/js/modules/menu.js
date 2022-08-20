let menus = [];
let selectedMenuId;

document.addEventListener('preinit', init);

function init()
{
    menus = document.querySelectorAll('.menu-item');

    if(menus == undefined || menus.length < 1)
        return;

    for(const [i, menu] of menus.entries())
    {
        menu.setAttribute('menu-index', i);
        menu.addEventListener('click', updateSelectedMenuItem);
        if([... menu.classList].includes('selected'))
            selectedMenuId = i;
    }

    if(selectedMenuId == undefined)
    {
        menus[0].classList.add('selected');
        selectedMenuId = 0;
    }
}

function updateSelectedMenuItem()
{
    const index = this.getAttribute('menu-index');
    if(index != selectedMenuId)
    {
        menus[selectedMenuId].classList.remove('selected');
        menus[index].classList.add('selected');

        selectedMenuId = index;
    }
}