let sounds = [] // https://raw.githubusercontent.com/PrismarineJS/minecraft-data/refs/heads/master/data/pc/1.21.4/sounds.json
let ogg = [] // https://raw.githubusercontent.com/misode/mcmeta/refs/heads/assets/assets/minecraft/sounds.json
for([index, sound] of sounds.entries()) {
    sounds[index]['sounds'] = []
    if(ogg[sound.name]?.sounds) {
        for(o of ogg[sound.name]?.sounds) {
            sounds[index]['sounds'].push(o.name || o)
        }
    }
}
console.log(sounds)