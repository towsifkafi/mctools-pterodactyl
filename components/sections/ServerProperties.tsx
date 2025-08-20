import React, { useEffect, useState } from 'react';

import SpinnerOverlay from '@/components/elements/SpinnerOverlay';
import ServerContentBlock from '@/components/elements/ServerContentBlock';
import TitledGreyBox from '@/components/elements/TitledGreyBox';
import Switch from '@/components/elements/Switch';

import { ServerContext } from '@/state/server';
import getFileContents from '@/api/server/files/getFileContents';
import saveFileContents from '@/api/server/files/saveFileContents';

import { parseServerProperties, ServerProperties, toMinecraftProperties } from '../lib/PropertiesParser';
import Input from '@/components/elements/Input';
import { Button } from '@/components/elements/button/index';
import MessageBox from '@/components/MessageBox';

const ServerPropertiesSection = () => {

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    const [search, setSearch] = useState("");
    const [rawProperties, setRawProperties] = useState("");
    const [properties, setProperties] = useState({});
    const [filteredSearch, setFilteredSearch] = useState({});

    const modifyProperties = (key: string, value: boolean | string) => {
        let updated = {
            ...properties,
            [key]: value
        }
        setProperties(updated)
        saveProperties(updated)
        updateSearch(search, updated)
    }

    const saveProperties = (updatedProperties: ServerProperties) => {
        setLoading(true)

        const content = toMinecraftProperties(updatedProperties)
        console.log(content)

        if(content === "") {
            setErrorMessage("Failed to save server.properties file.")
            setError(true)
            setLoading(false)
            return
        }

        saveFileContents(uuid, "server.properties", content)
            .then(() => {
                
            })
            .catch((error) => {
                setErrorMessage("Failed to save server.properties file.")
                setError(true)
                console.error('Error saving file:', error);
            })
            .then(() => setLoading(false));

    }

    const uuid = ServerContext.useStoreState((state) => state.server.data!.uuid);

    useEffect(() => {

        getFileContents(uuid, "server.properties")
        .then(content => {
            setRawProperties(content)
            let parsed = parseServerProperties(content)
            setProperties(parsed)
            setFilteredSearch(parsed)
        })
        .catch((error) => {
            setErrorMessage("Failed to load server.properties file.")
            setError(true)
            console.error(error);
        })
        .then(() => {setLoading(false)});

    }, [uuid])

    const updateSearch = (query: string, properties: ServerProperties) => {
        if(query === "") {
            setFilteredSearch(properties)
            return
        }
        let filtered: { [key: string]: any } = {}
        for(let [key, value] of Object.entries(properties)) {
            if(key.toLowerCase().includes(query.toLowerCase())) {
                filtered[key] = value
            }
        } 
        setFilteredSearch(filtered)
    }

    return (
        <>
        <SpinnerOverlay visible={loading} />
        <ServerContentBlock title={"Server Properties"}>
            {error && (
                <div className="mb-3">
                    <MessageBox type="error">
                        {errorMessage}
                    </MessageBox>
                </div>
            )}
            <div className='flex mb-5'>
                <Input className='mr-3'
                    onKeyUp={(e) => {
                        setSearch(e.currentTarget.value);
                        updateSearch(e.currentTarget.value, properties);
                    }}
                    name='search'
                    placeholder='Search configuration..'
                />
                <Button.Danger
                    onClick={() => saveProperties(properties)}
                >
                    Save
                </Button.Danger>
            </div>
            <div className='grid gap-8 md:grid-cols-2'>
                {Object.entries(filteredSearch).map(entry => {
                    return <TitledGreyBox
                        title = {
                            <p className="text-sm uppercase">
                                {cleanName(entry[0])}
                            </p>
                        }
                    >
                    {isBoolean(entry[1]) ? (
                        <>
                            <Switch
                                key={`${entry[0]}-switch`}
                                name={entry[0] as string}
                                defaultChecked={entry[1] as boolean}
                                onChange={(e) => {
                                    modifyProperties(entry[0], !entry[1]);
                                }}
                                readOnly={false}
                            />
                        </>
                    ) : (
                        <>
                            <Input
                                key={`${entry[0]}-input`}
                                id={entry[0]}
                                name={entry[0]}
                                onKeyUp={(e) => {
                                    modifyProperties(entry[0], e.currentTarget.value);
                                }}
                                readOnly={false}
                                defaultValue={entry[1] as any}
                                //placeholder={variable.defaultValue}
                            />
                        </>
                    )}
                    <p className="mt-1 text-xs text-neutral-300">
                        {propertyInformation[`${entry[0]}`] ?? ""}
                    </p>
                    </TitledGreyBox>
                })}
            </div>
        </ServerContentBlock>
        </>
    )

}

function cleanName(name: string) {
    return name
        .replace(/[\.]/gi, " ")
        .replace(/[\-]/gi, " ")
}

function isBoolean(value: any): boolean {
    return typeof value === 'boolean';
}

const convertToBoolean = (value: any): boolean => {
    if (typeof value === "string") {
        return value.toLowerCase() === "true";
    }
    return Boolean(value); // Handles other cases (e.g., 1, 0)
};

const propertyInformation: { [key: string]: string } = {
  "accepts-transfers": "Determines whether incoming player transfers via a transfer packet are accepted or rejected.",
  "allow-flight": "Enables or disables flight for players in Survival mode using mods, with potential for increased griefing if enabled.",
  "allow-nether": "Controls whether players can travel to the Nether through portals.",
  "broadcast-console-to-ops": "Sends console command outputs to all online operators if enabled.",
  "broadcast-rcon-to-ops": "Sends rcon console command outputs to all online operators if enabled.",
  "bug-report-link": "Specifies a URL for the bug report link; if empty, no link is sent.",
  "difficulty": "Sets the server difficulty, affecting mob damage, hunger, and poison effects.",
  "enable-command-block": "Enables or disables the use of command blocks on the server.",
  "enable-jmx-monitoring": "Exposes tick time metrics via JMX for server performance monitoring.",
  "enable-query": "Enables query to provide server information to external clients.",
  "enable-rcon": "Allows remote access to the server console via rcon; not encrypted, so use cautiously.",
  "enable-status": "Determines if the server appears as 'online' in the server list.",
  "enforce-secure-profile": "Requires players to have Mojang-signed public keys to join, ensuring signed chat messages.",
  "enforce-whitelist": "Kicks players not on the whitelist after a reload if enabled.",
  "entity-broadcast-range-percentage": "Sets how close entities must be to players to be sent, as a percentage of normal range.",
  "force-gamemode": "Forces players to join in the default game mode if enabled.",
  "function-permission-level": "Sets the default permission level for server functions (1-4).",
  "gamemode": "Defines the default game mode for players joining the server.",
  "generate-structures": "Controls whether structures like villages generate in new chunks.",
  "generator-settings": "Customizes world generation based on the chosen level-type.",
  "hardcore": "Enables hardcore mode, where death results in permanent banishment.",
  "hide-online-players": "Prevents sending the player list in status requests if enabled.",
  "initial-disabled-packs": "Lists datapacks not auto-enabled on world creation.",
  "initial-enabled-packs": "Lists datapacks enabled on world creation.",
  "level-name": "Sets the world name and directory path for loading or generating a world.",
  "level-seed": "Defines the seed for world generation; random if blank.",
  "level-type": "Sets the preset for world generation, like normal, flat, or amplified.",
  "log-ips": "Logs client IP addresses in the server console or log file if enabled.",
  "max-chained-neighbor-updates": "Limits consecutive neighbor updates to prevent lag; negative values disable the limit.",
  "max-players": "Sets the maximum number of players allowed on the server at once.",
  "max-tick-time": "Sets the maximum time for a server tick before watchdog shutdown; -1 disables watchdog.",
  "max-world-size": "Defines the world border size in blocks from the center.",
  "motd": "Sets the message displayed in the server list, supporting color and formatting codes.",
  "network-compression-threshold": "Determines the packet size threshold for compression; -1 disables compression.",
  "online-mode": "Verifies players against Minecraft's account database; false allows cracked clients.",
  "op-permission-level": "Sets the default permission level for operators (0-4).",
  "pause-when-empty-seconds": "Pauses the server after a set time with no players online.",
  "player-idle-timeout": "Kicks idle players after a set number of minutes; 0 disables kicking.",
  "prevent-proxy-connections": "Kicks players if their ISP/AS differs from Mojang's authentication server.",
  "pvp": "Enables or disables player-versus-player combat; affects direct and indirect damage.",
  "query.port": "Sets the UDP port for server query if enabled.",
  "rate-limit": "Limits packets a player can send before being kicked; 0 disables the limit.",
  "rcon.password": "Sets the password for rcon access; must not be blank if rcon is enabled.",
  "rcon.port": "Sets the TCP port for rcon access.",
  "region-file-compression": "Chooses the compression algorithm for region files (deflate, lz4, or none).",
  "require-resource-pack": "Disconnects players who decline the server's resource pack if enabled.",
  "resource-pack": "Sets the URL for the server's resource pack download.",
  "resource-pack-id": "Assigns a UUID to identify the resource pack with clients.",
  "resource-pack-prompt": "Customizes the message shown when prompting for resource pack download.",
  "resource-pack-sha1": "Specifies the SHA-1 digest to verify resource pack integrity.",
  "server-ip": "Sets the IP address the server listens on; blank means all available IPs.",
  "server-port": "Sets the TCP port the server listens on; requires port forwarding for NAT.",
  "simulation-distance": "Sets the radius in chunks where entities are updated and visible.",
  "spawn-monsters": "Controls whether monsters spawn at night or in dark areas.",
  "spawn-protection": "Sets the size of the protected spawn area; 0 disables protection.",
  "sync-chunk-writes": "Enables synchronous chunk writes for data consistency.",
  "text-filtering-config": "Configures chat filtering, primarily used internally by Realms.",
  "text-filtering-version": "Sets the version of the text filtering configuration format (0 or 1).",
  "use-native-transport": "Enables optimized packet handling on Linux if true.",
  "view-distance": "Sets the server-side chunk radius sent to clients.",
  "white-list": "Enables the whitelist to restrict server access to listed players only."
}

export default ServerPropertiesSection;