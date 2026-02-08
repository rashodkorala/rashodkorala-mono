# Bulk Photo Upload Instructions

This guide explains how to use the bulk upload feature to upload multiple photos at once using a zip file.

## Step 1: Prepare Your Files

1. Create a new folder on your computer (e.g., `my-photos`)
2. Inside this folder, create an `images` subfolder
3. Place all your photos in the `images` folder
4. Create a `metadata.json` file in the main folder (optional)

## Step 2: Create the Metadata File (Optional)

If you want to add metadata to your photos, create a `metadata.json` file with this format:

```json
{
  "photos": [
    {
      "title": "Optional photo title",
      "description": "Optional description",
      "category": "optional_category",
      "alt_text": "Optional alt text",
      "image_path": "images/your-photo-filename.jpg"
    }
  ]
}
```

### Available Categories (Optional):
- `architecture` - Architecture & Heritage
- `nature` - Nature & Landscapes
- `street` - Street & Urban Life
- `travel` - Travel Photography
- `wildlife` - Wildlife
- `night` - Night & Lights
- `abstract` - Abstract/Artistic (default)

### Example metadata.json:
```json
{
  "photos": [
    {
      "title": "Ancient Temple",
      "description": "A beautiful ancient temple at sunset",
      "category": "architecture",
      "alt_text": "Ancient temple with golden sunset lighting",
      "image_path": "images/temple.jpg"
    },
    {
      "image_path": "images/lake.jpg"
    }
  ]
}
```

Note: Only `image_path` is required. If other fields are not provided:
- `title` will use the filename (without extension)
- `category` will default to "abstract"
- `description` and `alt_text` will be null

## Step 3: Create the Zip File

1. Select both the `metadata.json` file (if you have one) and the `images` folder
2. Right-click and choose "Compress" or "Create archive" (depending on your operating system)
3. Name your zip file (e.g., `my-photos.zip`)

Your zip file structure should look like this:
```
my-photos.zip
├── metadata.json (optional)
└── images/
    ├── photo1.jpg
    ├── photo2.jpg
    └── ...
```

## Step 4: Upload the Zip File

1. Go to the photo upload page
2. Click "Choose File" in the Bulk Upload section
3. Select your zip file
4. Click "Upload Zip"

## Important Notes

- **File Formats**: Only JPEG, PNG, and WebP images are supported
- **File Size**: Each image must be under 10MB
- **Image Paths**: If using metadata.json, make sure the `image_path` matches the path in your zip file
- **Required Fields**: Only `image_path` is required in metadata.json
- **Optional Fields**: 
  - `title` (defaults to filename)
  - `description`
  - `category` (defaults to "abstract")
  - `alt_text`

## Troubleshooting

If you encounter any errors:

1. **"metadata.json not found"**: This is only an error if you're trying to use metadata. You can upload photos without metadata.json
2. **"Image file not found"**: Check that the `image_path` in metadata.json matches the actual path in your zip file
3. **"Invalid JSON format"**: Verify your metadata.json is properly formatted JSON
4. **"Invalid category"**: Make sure you're using one of the supported category values

## Example

Here's a complete example of a valid upload:

1. Create a folder called `vacation-photos`
2. Inside it, create an `images` folder
3. Add your photos to the `images` folder:
   - `images/temple.jpg`
   - `images/lake.jpg`
4. (Optional) Create `metadata.json` in the `vacation-photos` folder
5. Zip the contents of `vacation-photos` (not the folder itself)
6. Upload the resulting zip file 