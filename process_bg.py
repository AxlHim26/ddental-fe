import os
import requests
from rembg import remove
from PIL import Image
from io import BytesIO

# Products currently in Best Sellers
images_to_process = {
    "ghe-anthos-a3": "https://media.base44.com/images/public/69cff7a985a4c7940dcab568/ada38981d_generated_image.png",
    "xray-cbct-cs9300": "https://media.base44.com/images/public/69cff7a985a4c7940dcab568/5201dbde0_generated_d92d08c0.png",
    "ghe-grace-x2": "https://media.base44.com/images/public/69cff7a985a4c7940dcab568/eb08102c5_generated_image.png",
    "den-valo-grand": "https://media.base44.com/images/public/69cff7a985a4c7940dcab568/1c27eca0e_generated_image.png",
    "xray-pax-i3d": "https://media.base44.com/images/public/69cff7a985a4c7940dcab568/b584e5efc_generated_image.png",
}

output_dir = "public/images/cutouts"
os.makedirs(output_dir, exist_ok=True)

for name, url in images_to_process.items():
    print(f"Processing {name}...")
    try:
        response = requests.get(url)
        response.raise_for_status()
        input_image = Image.open(BytesIO(response.content))
        
        # Remove background
        # rembg automatically uses U2Net or similar, returning a transparent PNG
        output_image = remove(input_image)
        
        out_path = os.path.join(output_dir, f"{name}.png")
        output_image.save(out_path)
        print(f"Saved to {out_path}")
    except Exception as e:
        print(f"Failed for {name}: {e}")

print("Done processing specific Best Sellers!")
