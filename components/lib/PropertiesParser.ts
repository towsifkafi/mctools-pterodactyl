// Define the interface for server.properties configuration
interface ServerProperties {
  [key: string]: string | number | boolean | undefined;
}

/**
 * Parses a Minecraft server.properties string into a typed object
 * @param content The raw content of the server.properties file
 * @returns A ServerProperties object
 */
function parseServerProperties(content: string): ServerProperties {
  return parsePropertiesContent(content);
}

/**
 * Parses the content of a server.properties string
 * @param content The raw content of the server.properties file
 * @returns A ServerProperties object
 */
function parsePropertiesContent(content: string): ServerProperties {
  const config: ServerProperties = {};
  const lines = content.split('\n');

  for (const line of lines) {
    // Skip empty lines and comments
    if (line.trim() === '' || line.startsWith('#')) {
      continue;
    }

    // Split on the first '=' only
    const [key, ...valueParts] = line.split('=');
    const value = valueParts.join('=').trim();

    if (key) {
      const trimmedKey = key.trim();
      config[trimmedKey] = parseValue(trimmedKey, value);
    }
  }

  return config;
}

/**
 * Parses a value based on the key's expected type
 * @param key The property key
 * @param value The raw value string
 * @returns Parsed value (string, number, or boolean)
 */
function parseValue(key: string, value: string): string | number | boolean {
  // Handle boolean values
  if (value === 'true' || value === 'false') {
    return value === 'true';
  }

  // Handle numeric values for specific keys
  const numericKeys = ['max-players', 'server-port', 'spawn-protection'];
  if (numericKeys.includes(key)) {
    const num = parseInt(value, 10);
    return isNaN(num) ? value : num;
  }

  // Return string for all other cases
  return value;
}

/**
 * Serializes a ServerProperties object back to a server.properties string
 * @param config The configuration object
 * @returns A string in server.properties format
 */
function serializeServerProperties(config: ServerProperties): string {
  return Object.entries(config)
    .filter(([_, value]) => value !== undefined)
    .map(([key, value]) => `${key}=${value}`)
    .join('\n');
}

/**
 * Converts parsed ServerProperties data into a string formatted for server.properties
 * @param config The parsed ServerProperties object
 * @returns A string in server.properties format, ready to be used in a server.properties file
 */
function toMinecraftProperties(config: ServerProperties): string {
  return Object.entries(config)
    .filter(([_, value]) => value !== undefined)
    .map(([key, value]) => `${key}=${value}`)
    .join('\n');
}

export {
  ServerProperties,
  parseServerProperties,
  parsePropertiesContent,
  serializeServerProperties,
  toMinecraftProperties,
};