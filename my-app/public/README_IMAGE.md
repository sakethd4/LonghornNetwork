# Campus Background Image Setup

To use the UT Austin campus image as the background:

1. **Download the image** from https://www.utexas.edu/ or save the campus sunset image
2. **Save it** as `campus-background.jpg` in the `my-app/public/` folder
3. The CSS is already configured to use this image

**Alternative**: If you have the image with a different name or format:
- Update the `background-image` URL in `my-app/src/pages/Home.css` to match your filename
- Supported formats: `.jpg`, `.jpeg`, `.png`, `.webp`

**Note**: The background image is set to:
- Cover the entire viewport
- Stay fixed while scrolling
- Have a semi-transparent white overlay for text readability
- Use UT Austin colors (#BF5700) for text accents

