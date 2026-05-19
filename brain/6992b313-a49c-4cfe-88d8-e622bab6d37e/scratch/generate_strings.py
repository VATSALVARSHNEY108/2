import os

template = """\"use client\";

import {{ useCallback, useEffect, useMemo, useState }} from \"react\";
import {{ useTheme }} from \"next-themes\";
import {{ SimulationStudio }} from \"@/components/SimulationStudio\";
import {{ motion }} from \"framer-motion\";
import {{ BookOpen, Zap, Info, Activity }} from \"lucide-react\";

interface Step {{
  chars: string[];
  activeIndex: number | null;
  message: string;
  line: number;
  [key: string]: any;
}}

function generateSteps(): Step[] {{
  const steps: Step[] = [];
  const str = \"{initial_str}\";
  let chars = str.split(\"\");
  
  steps.push({{
    chars: [...chars], activeIndex: null,
    message: \"{intro_message}\",
    line: 0
  }});

  {logic_code}

  steps.push({{
    chars: [...chars], activeIndex: null,
    message: \"{final_message}\",
    line: 5
  }});

  return steps;
}}

export default function {component_name}() {{
  const [stepIdx, setStepIdx] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1000);

  const steps = useMemo(() => generateSteps(), []);
  const step = steps[Math.min(stepIdx, steps.length - 1)];

  const next = useCallback(() => setStepIdx(p => Math.min(p + 1, steps.length - 1)), [steps.length]);
  const prev = useCallback(() => setStepIdx(p => Math.max(0, p - 1)), []);

  useEffect(() => {{
    if (!isPlaying) return;
    const timer = setInterval(next, speed);
    return () => clearInterval(timer);
  }}, [isPlaying, speed, next]);

  const visualization = (
    <div className=\"flex flex-col gap-12 w-full max-w-5xl py-8\">
      <div className=\"bg-slate-950/50 border border-white/5 rounded-[2.5rem] p-12 flex justify-center gap-3 relative min-h-[160px] items-center\">
        {{step.chars.map((char, i) => {{
          const isActive = step.activeIndex === i;
          return (
            <motion.div
              key={{i}}
              animate={{{{
                scale: isActive ? 1.2 : 1,
                backgroundColor: isActive ? \"#6366F1\" : \"rgba(255,255,255,0.02)\",
                borderColor: isActive ? \"#818CF8\" : \"rgba(255,255,255,0.1)\",
              }}}}
              className=\"w-14 h-18 rounded-xl border flex items-center justify-center relative shadow-lg\"
            >
              <span className=\"text-xl font-black text-white\">{{char}}</span>
            </motion.div>
          );
        }})}}
      </div>

      <div className=\"bg-slate-900 border border-white/5 p-6 rounded-3xl text-white w-full text-center font-bold text-sm\">
        {{step.message}}
      </div>
    </div>
  );

  const explanation = (
    <div className=\"space-y-6\">
      <h3 className=\"text-indigo-400 font-bold flex items-center gap-2\">
        <Info size={{18}} /> {explanation_title}
      </h3>
      <p className=\"text-sm text-slate-300 leading-relaxed\">
        {explanation_text}
      </p>
    </div>
  );

  const complexity = (
    <div className=\"grid grid-cols-2 gap-4\">
      <div className=\"p-6 bg-slate-800/50 border border-white/5 rounded-3xl text-center\">
        <div className=\"text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1\">Time</div>
        <div className=\"text-3xl font-black text-emerald-400\">{time_complexity}</div>
      </div>
      <div className=\"p-6 bg-slate-800/50 border border-white/5 rounded-3xl text-center\">
        <div className=\"text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1\">Space</div>
        <div className=\"text-3xl font-black text-emerald-400\">{space_complexity}</div>
      </div>
    </div>
  );

  const code = (
    <div className=\"bg-[#020617] p-6 rounded-3xl border border-white/5 font-mono text-xs text-slate-400\">
      {{[
{code_lines}
      ].map((line, i) => (
        <div key={{i}} className={{"py-1 ${{step.line === i ? \"bg-indigo-500/20 text-indigo-100\" : \"\"}}"}}>
          {{i + 1}}  {{line}}
        </div>
      ))}}
    </div>
  );

  const notes = (
    <div className=\"space-y-4\">
       <div className=\"p-4 bg-slate-800/50 border border-white/5 rounded-2xl\">
          <div className=\"flex items-center gap-2 mb-3\">
            <Zap size={{14}} className=\"text-amber-400\" />
            <span className=\"text-[10px] font-black text-white/40 uppercase tracking-widest\">Note</span>
          </div>
          <p className=\"text-[10px] text-slate-400 leading-relaxed italic\">
            \"{note_text}\"
          </p>
       </div>
    </div>
  );

  return (
    <SimulationStudio
      title=\"{title}\"
      topic=\"Strings\"
      description=\"{description}\"
      visualization={{visualization}}
      explanation={{explanation}}
      complexity={{complexity}}
      code={{code}}
      notes={{notes}}
      onNext={{next}}
      onPrev={{prev}}
      onTogglePlay={{() => setIsPlaying(!isPlaying)}}
      onReset={{() => {{ setStepIdx(0); setIsPlaying(false); }}}}
      onStepForward={{next}}
      onStepBackward={{prev}}
      isPlaying={{isPlaying}}
      speed={{speed}}
      onSpeedChange={{setSpeed}}
      activeTopicId=\"strings\"
    />
  );
}}
\"\"\"

lessons = [
    {
        "filename": "string-searching.tsx",
        "component_name": "StringSearchingSimulation",
        "initial_str": "FINDME",
        "intro_message": "String Searching: Locating a specific character or pattern.",
        "logic_code": \"\"\"
  const target = 'M';
  for (let i = 0; i < chars.length; i++) {
    steps.push({
      chars: [...chars], activeIndex: i,
      message: `Checking index ${i}: '${chars[i]}'...`,
      line: 2
    });
    if (chars[i] === target) {
      steps.push({
        chars: [...chars], activeIndex: i,
        message: `Target character '${target}' found at index ${i}!`,
        line: 3
      });
      break;
    }
  }
\"\"\",
        "final_message": "Search operation complete.",
        "explanation_title": "Linear Search",
        "explanation_text": "Linear search is the simplest string searching algorithm. It checks every character one by one until it finds the target or reaches the end.",
        "time_complexity": "O(N)",
        "space_complexity": "O(1)",
        "code_lines": '        "for (int i = 0; i < s.length(); i++) {", "  if (s[i] == target) return i;", "}"',
        "note_text": "For pattern searching, algorithms like KMP are more efficient.",
        "title": "String Search Lab",
        "description": "Visualizing basic linear search in strings."
    },
    {
        "filename": "substrings.tsx",
        "component_name": "SubstringsSimulation",
        "initial_str": "ABC",
        "intro_message": "Substrings: Contiguous parts of a string.",
        "logic_code": \"\"\"
  for (let start = 0; start < chars.length; start++) {
    for (let end = start; end < chars.length; end++) {
      const sub = chars.slice(start, end + 1).join("");
      steps.push({
        chars: [...chars], activeIndex: null,
        message: `Found substring from index ${start} to ${end}: "${sub}"`,
        line: 2
      });
    }
  }
\"\"\",
        "final_message": "Total substrings: N*(N+1)/2",
        "explanation_title": "Contiguous Segments",
        "explanation_text": "A substring is any contiguous sequence of characters within a string. For a string of length N, there are N*(N+1)/2 possible substrings.",
        "time_complexity": "O(N²)",
        "space_complexity": "O(N)",
        "code_lines": '        "for (int i = 0; i < n; i++) {", "  for (int j = i; j < n; j++) {", "    print(s.substr(i, j-i+1));", "  }", "}"',
        "note_text": "Substrings must be continuous, unlike subsequences.",
        "title": "Substrings Lab",
        "description": "Generating all contiguous segments of a string."
    },
    {
        "filename": "string-sorting.tsx",
        "component_name": "StringSortingSimulation",
        "initial_str": "DBAC",
        "intro_message": "String Sorting: Arranging characters in lexicographical order.",
        "logic_code": \"\"\"
  for (let i = 0; i < chars.length; i++) {
    for (let j = 0; j < chars.length - i - 1; j++) {
      steps.push({
        chars: [...chars], activeIndex: j,
        message: `Comparing '${chars[j]}' and '${chars[j+1]}'.`,
        line: 2
      });
      if (chars[j] > chars[j+1]) {
        [chars[j], chars[j+1]] = [chars[j+1], chars[j]];
        steps.push({
          chars: [...chars], activeIndex: j + 1,
          message: `Swapped '${chars[j+1]}' and '${chars[j]}'.`,
          line: 3
        });
      }
    }
  }
\"\"\",
        "final_message": "String is now sorted alphabetically.",
        "explanation_title": "Bubble Sort on Strings",
        "explanation_text": "Characters can be sorted just like numbers using their ASCII values. Here we use bubble sort to arrange characters in ascending order.",
        "time_complexity": "O(N²)",
        "space_complexity": "O(1)",
        "code_lines": '        "sort(s.begin(), s.end());", "// Internally uses efficient O(N log N) sorting."',
        "note_text": "Counting sort is often better for strings since the character range (256) is small.",
        "title": "String Sort Lab",
        "description": "Visualizing alphabetical character arrangement."
    },
    {
        "filename": "ascii-values.tsx",
        "component_name": "AsciiValuesSimulation",
        "initial_str": "ABC",
        "intro_message": "ASCII: Every character is represented by a unique number.",
        "logic_code": \"\"\"
  for (let i = 0; i < chars.length; i++) {
    const code = chars[i].charCodeAt(0);
    steps.push({
      chars: [...chars], activeIndex: i,
      message: `Character '${chars[i]}' has ASCII value ${code}.`,
      line: 2
    });
  }
\"\"\",
        "final_message": "Computers process numbers, not characters.",
        "explanation_title": "Numerical Encoding",
        "explanation_text": "The American Standard Code for Information Interchange (ASCII) defines how characters are mapped to integers.",
        "time_complexity": "O(N)",
        "space_complexity": "O(1)",
        "code_lines": '        "char c = \'A\';", "int val = (int)c; // 65"',
        "note_text": "Unicode (like UTF-8) is a superset of ASCII that handles emojis and other symbols.",
        "title": "ASCII Values Lab",
        "description": "Peeking into the numerical identity of characters."
    },
    {
        "filename": "lexicographical-order.tsx",
        "component_name": "LexicographicalOrderSimulation",
        "initial_str": "ABC",
        "intro_message": "Lexicographical Order: The way words are arranged in a dictionary.",
        "logic_code": \"\"\"
  steps.push({
    chars: [\"APPLE\", \"APPLY\"], activeIndex: null,
    message: \"Comparing 'APPLE' and 'APPLY' character by character.\",
    line: 1
  });
\"\"\",
        "final_message": "Lexicographical comparison stops at the first difference.",
        "explanation_title": "Dictionary Logic",
        "explanation_text": "Strings are compared index by index. The first index where characters differ determines the order.",
        "time_complexity": "O(min(N,M))",
        "space_complexity": "O(1)",
        "code_lines": '        "if (s1 < s2) // true if s1 comes first in dictionary"',
        "note_text": "Short strings come before their prefixes (e.g., 'car' < 'cart').",
        "title": "Lexicographical Order Lab",
        "description": "Understanding dictionary-based string comparison."
    }
]

output_dir = "c:/Users/VATSAL VARSHNEY/OneDrive/Desktop/O(1)/content/dsa/strings"

for lesson in lessons:
    content = template.format(**lesson)
    with open(os.path.join(output_dir, lesson["filename"]), "w") as f:
        f.write(content)

print(f"Generated {len(lessons)} files.")
