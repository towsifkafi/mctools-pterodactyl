const fs = require('fs').promises;

async function mergeEntities() {
    try {
        // Read the JSON files
        const entitiesData = await fs.readFile('entities.json', 'utf8');
        const entitiesImgsData = await fs.readFile('entities_imgs.json', 'utf8');

        // Parse JSON data
        let entities, images;
        try {
            entities = JSON.parse(entitiesData);
            images = JSON.parse(entitiesImgsData);
        } catch (error) {
            throw new Error(`Failed to parse JSON: ${error.message}`);
        }

        // Validate input structures
        if (!Array.isArray(entities)) {
            throw new Error('entities.json must contain an array of entities');
        }
        if (typeof images !== 'object' || images === null) {
            throw new Error('entities_imgs.json must be an object');
        }

        // Create a map of entity names to image URLs (case-insensitive, trimmed)
        const imageMap = {};
        let invalidImages = 0;
        for (const [name, url] of Object.entries(images)) {
            if (typeof url === 'string' && url) {
                imageMap[name.toLowerCase().trim()] = url;
            } else {
                console.warn(`Invalid image URL for "${name}" in entities_imgs.json`);
                invalidImages++;
            }
        }

        // Merge entities with image URLs
        const mergedEntities = [];
        let unmatchedEntities = 0;
        for (const entity of entities) {
            if (!entity.name || typeof entity.name !== 'string') {
                console.warn(`Skipping entity with invalid name: ${JSON.stringify(entity)}`);
                continue;
            }
            const normalizedName = entity.name.toLowerCase().trim();
            const imageUrl = imageMap[normalizedName] || null;
            if (!imageUrl) {
                unmatchedEntities++;
                console.log(`No image found for entity: ${entity.name}`);
            }
            mergedEntities.push({
                ...entity,
                image: imageUrl
            });
        }

        // Write the merged data to a new file
        await fs.writeFile('merged_entities.json', JSON.stringify(mergedEntities, null, 2));

        // Log summary
        console.log(`Merged ${mergedEntities.length} entities`);
        console.log(`Entities without images: ${unmatchedEntities}`);
        console.log(`Invalid image entries: ${invalidImages}`);
        console.log('Output written to merged_entities.json');

    } catch (error) {
        console.error('Error merging entities:', error.message);
    }
}

mergeEntities();