// https://www.digminecraft.com/lists/entity_list_pc.php
let rows = document.getElementsByTagName("tbody")[0].children
let effects = [];
for(var i = 0; i < rows.length; i++) {

    let name = rows[i].children[1].innerText;
    let id = rows[i].children[2].innerText;
    let image = rows[i].children[0].children[0].children[0].children[0].children[0].src;

    effects.push({ name, id, image })
}
console.log(effects)