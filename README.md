# mctools-pterodactyl
![name](https://img.shields.io/badge/dynamic/yaml?url=https://raw.githubusercontent.com/towsifkafi/mctools-pterodactyl/refs/heads/main/conf.yml&label=Name&query=$.info.name&style=flat-square)
![identifier](https://img.shields.io/badge/dynamic/yaml?url=https://raw.githubusercontent.com/towsifkafi/mctools-pterodactyl/refs/heads/main/conf.yml&label=Identifier&query=$.info.identifier&style=flat-square)
![version](https://img.shields.io/badge/dynamic/yaml?url=https://raw.githubusercontent.com/towsifkafi/mctools-pterodactyl/refs/heads/main/conf.yml&label=Version&query=$.info.version&style=flat-square)


`mctools` is a pterodactyl addon based on Blueprint that provides a suite of Minecraft-related tools. It enhances your server management experience by integrating handy Minecraft utilities into the Pterodactyl panel.

[**↗ Blueprint**](https://blueprint.zip/browse/mctools)&nbsp;&nbsp;
[**↗ SourceXchange**](https://www.sourcexchange.net/products/mctools)

## Installation

1. Ensure Blueprint is installed and running on your panel.

2. Download the addon `.blueprint` file from the releases tab.

3. Transfer it to the Pterodactyl directory (`/var/www/pterodactyl`).

4. Install it using the Blueprint CLI:
```bash
blueprint -install mctools.blueprint
```

## Inspiration & Sources
This project is heavily inspired by [`mcutils.com`](https://mcutils.com), which provides a wide range of useful Minecraft tools and utilities. This addon aims to bring similar functionality directly into the Pterodactyl.
Resource from these sites/projects are used:
1. https://minecraft.wiki/
2. https://mcutils.com
3. https://github.com/PrismarineJS/minecraft-data
4. https://github.com/misode/mcmeta
