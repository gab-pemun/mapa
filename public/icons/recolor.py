import os
from xml.dom import minidom

# Function to recolor an SVG file
def recolor_svg(input_file, output_file, new_fill_color):
    doc = minidom.parse(input_file)
    elements = doc.getElementsByTagName('*')
    
    for element in elements:
        # Check if the element has a fill attribute and change it
        if element.hasAttribute('fill'):
            element.setAttribute('fill', new_fill_color)
        # Additionally, check if the element has a style attribute containing fill and change it
        if element.hasAttribute('style'):
            style = element.getAttribute('style')
            new_style = []
            for part in style.split(';'):
                if part.startswith('fill:'):
                    new_style.append(f'fill:{new_fill_color}')
                else:
                    new_style.append(part)
            element.setAttribute('style', ';'.join(new_style))

    with open(output_file, 'w') as f:
        doc.writexml(f)

    doc.unlink()

# Define the colors with keys
colors = {
    'eua': '#0A3161',
    'norte': '#C8102E',
    'sul': '#ffff00',
    'vcong': '#236d3f'
}

# Get the current directory
current_dir = os.path.dirname(os.path.abspath(__file__))

# Process each SVG file in the directory
for filename in os.listdir(current_dir):
    if filename.endswith('.svg'):
        input_svg = os.path.join(current_dir, filename)
        
        for color_name, color_code in colors.items():
            output_svg = os.path.join(current_dir, f"{os.path.splitext(filename)[0]}_{color_name}.svg")
            recolor_svg(input_svg, output_svg, color_code)

print("Recoloring completed.")
