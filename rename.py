import os

def rename_files_in_folder(folder_path):
    # Loop through all files in the folder
    for filename in os.listdir(folder_path):
        # Check if the filename ends with '-eua.svg'
        if filename.endswith('-vcong.svg'):
            # Replace '-eua' with '-blue'
            new_filename = filename.replace('-vcong', '-green')
            
            # Create the full paths for the old and new filenames
            old_filepath = os.path.join(folder_path, filename)
            new_filepath = os.path.join(folder_path, new_filename)
            
            # Rename the file
            os.rename(old_filepath, new_filepath)
            print(f"Renamed: {filename} -> {new_filename}")

# Replace 'your/folder/path' with the path to the folder you want to process
folder_path = '/home/limao/Documents/Projects/mapa-gabinete/public/icons/vcong'
rename_files_in_folder(folder_path)
