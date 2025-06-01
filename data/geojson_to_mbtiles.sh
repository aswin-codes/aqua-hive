#!/bin/bash

# Directories
GEOJSON_DIR="geojson"
MBTILES_DIR="vector_tiles"

# Create output directory if it doesn't exist
mkdir -p "$MBTILES_DIR"

# Count total files for progress
total=$(ls "$GEOJSON_DIR"/*.geojson 2>/dev/null | wc -l)
count=0
start_time=$(date +%s)

# Loop through all GeoJSON files
for geojson in "$GEOJSON_DIR"/*.geojson; do
    [ -e "$geojson" ] || continue  # skip if none found

    # Extract year and month from filename (assumes precip_{month}_{year}.geojson)
    filename=$(basename "$geojson" .geojson)
    # If your file is named precip_01_2022.geojson, this will work:
    mbtiles="$MBTILES_DIR/${filename}.mbtiles"

    # Tippecanoe options (customize as needed)
    tippecanoe -o "$mbtiles" -r1 --no-feature-limit --no-tile-size-limit -B0 -Z0 -z8 -f "$geojson"

    # Progress
    count=$((count + 1))
    now=$(date +%s)
    elapsed=$((now - start_time))
    percent=$((100 * count / total))
    echo "[$count/$total] Saved $mbtiles | $percent% complete | Elapsed: ${elapsed}s"
done

echo "All GeoJSON files converted to MBTiles in '$MBTILES_DIR'."
