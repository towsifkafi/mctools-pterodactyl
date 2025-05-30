// https://minecraft.wiki/w/Particles_(Java_Edition)
let rows = document.getElementsByTagName("tbody")[0].children
let particles = [];
for(var i = 1; i < rows.length; i++) {

    let name = rows[i].children[0].innerText;
    let image = rows[i].children[3].children[0].children[0].children[0].src;

    particles.push({ name, image })
}
console.log(particles)