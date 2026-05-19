import os

base_dir = r'c:\\Users\\VATSAL VARSHNEY\\OneDrive\\Desktop\\O(1)\\content\\dsa\\linked-list'

# List of first 5 files alphabetically
first5 = sorted([f for f in os.listdir(base_dir) if f.endswith('.tsx')])[:5]

article = '''
          <article style={{ background: "#111827", border: "1px solid #2b3447", padding: "32px", borderRadius: "20px" }}>
            <h2 style={{ fontSize: "20px", marginBottom: "20px" }}>Detailed Simulation</h2>
            <p style={{ fontSize: '15px', lineHeight: '1.8', color: '#98a2b3', marginBottom: '8px' }}>We provide a step‑by‑step visual simulation of the algorithm, highlighting active nodes, edges, and internal variables in the Values panel. The CodeTracker panel synchronizes with the C++ implementation, showing each line as the simulation progresses.</p>
          </article>
''' 

for filename in first5:
    path = os.path.join(base_dir, filename)
    with open(path, 'r', encoding='utf-8') as f:
        content = f.read()
    # Find the simulator section marker
    insert_marker = '<section id="simulator"'
    idx = content.find(insert_marker)
    if idx == -1:
        print(f'Simulator section not found in {filename}')
        continue
    # Insert article before the marker
    new_content = content[:idx] + article + '\n' + content[idx:]
    with open(path, 'w', encoding='utf-8') as f:
        f.write(new_content)
    print(f'Updated {filename}')
