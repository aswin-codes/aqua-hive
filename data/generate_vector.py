import os
import subprocess
import time
from tqdm import tqdm

# Paths (adjust as needed)
geojson_dir = 'geojson'
mbtiles_dir = 'vector_tiles'

# Create output directory if it doesn't exist
os.makedirs(mbtiles_dir, exist_ok=True)

# List all geojson files in the input directory
geojson_files = [f for f in os.listdir(geojson_dir) if f.endswith('.geojson')]
total_files = len(geojson_files)

start_time = time.time()

for idx, geojson_file in enumerate(tqdm(geojson_files, desc="Converting to MBTiles", unit="file")):
    input_path = os.path.join(geojson_dir, geojson_file)
    mbtiles_name = os.path.splitext(geojson_file)[0] + '.mbtiles'
    output_path = os.path.join(mbtiles_dir, mbtiles_name)

    # Convert Windows path to WSL path
    wsl_input = '/mnt/' + input_path.replace(':', '').replace('\\', '/').replace('C/', 'c/')
    wsl_output = '/mnt/' + output_path.replace(':', '').replace('\\', '/').replace('C/', 'c/')

    # Or, if your folders are already under /mnt/c/... in WSL, use relative paths:
    # wsl_input = f'/mnt/c/Users/youruser/path/to/{input_path}'
    # wsl_output = f'/mnt/c/Users/youruser/path/to/{output_path}'

    # Tippecanoe command (adjust zoom and options as needed)
    tippecanoe_cmd = f"tippecanoe -zg -o \"{wsl_output}\" --drop-densest-as-needed \"{wsl_input}\""

    # Run the command in WSL
    result = subprocess.run(['wsl', tippecanoe_cmd], capture_output=True, text=True)
    if result.returncode != 0:
        print(f"Error converting {geojson_file}:\n{result.stderr}")

    elapsed = time.time() - start_time
    percent = 100 * (idx + 1) / total_files
    print(f"Saved {mbtiles_name} | {percent:.2f}% complete | Elapsed: {elapsed:.1f}s")

print(f"\nAll GeoJSON files converted to MBTiles in '{mbtiles_dir}' folder.")
print(f"Total time elapsed: {time.time() - start_time:.1f} seconds.")
