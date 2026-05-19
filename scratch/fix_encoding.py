import os
import re

def fix_encoding(text):
    # Mapping common broken UTF-8 patterns
    replacements = {
        'Ã¢Ë†â€™': '−',
        'Ãƒâ€”': '×',
        'Ã‚Â¹Ã¢Â Â¸': '¹⁸',
        'Ã¢â‚¬â€œ': '–',
        'Ã°Å¸â€œâ€“': '📖',
        'Ã°Å¸â€œÂ¦': '📦',
        'Ã°Å¸â€œÂ ': '📍',
        'Ã°Å¸â€™Â¹': '💡',
        'Ã°Å¸â€™Â': '💡',
        'Ã¢â€°Â¥': '≥',
        'Ã‚Â¹': '¹',
        'Ã‚Â²': '²',
        'Ã‚Â³': '³',
        'Ã‚Â°': '°',
        'Ã‚Â±': '±',
        'Ã¢â‚¬Â¢': '•',
        'Ã¢â€žÂ¢': '™',
        'Ã‚Â®': '®',
        'Ã‚Â©': '©',
        'Ã¢â‚¬Å“': '"',
        'Ã¢â‚¬Â': '"',
        'Ã¢â‚¬Ëœ': "'",
        'Ã¢â‚¬â„¢': "'",
        'Ã°Å¸Å¡â‚¬': '🚀',
        'Ã°Å¸â€˜Â¾': '👾',
        'Ã°Å¸â€œÂ±': '📱',
        'Ã°Å¸â€œâ€¹': '📋',
        'Ã°Å¸â€™Â»': '💻',
        'Ã°Å¸Â¤â€“': '🤖',
        'Ã°Å¸Å½Â¯': '🎯',
        'Ã°Å¸â€œË†': '📈',
        'Ã¢Å“Â¨': '✨',
    }
    
    for broken, fixed in replacements.items():
        text = text.replace(broken, fixed)
    return text

def process_files(directory):
    for root, _, files in os.walk(directory):
        for file in files:
            if file.endswith(".tsx") or file.endswith(".ts"):
                path = os.path.join(root, file)
                try:
                    with open(path, "r", encoding="utf-8") as f:
                        content = f.read()
                    
                    fixed_content = fix_encoding(content)
                    
                    if fixed_content != content:
                        with open(path, "w", encoding="utf-8") as f:
                            f.write(fixed_content)
                        print(f"Fixed: {path}")
                except Exception as e:
                    print(f"Error processing {path}: {e}")

if __name__ == "__main__":
    process_files("content")
    process_files("components")
    process_files("app")
    process_files("lib")
