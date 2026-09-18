const framework=["GIVEN","ASKED","CONSTRAINTS","CLUES","PATTERN","DATA STRUCTURE","TEMPLATE","TEST"];
const questions=[
{title:"Two Sum",text:'Given an array of integers nums and an integer target, return the indices of the two numbers such that they add up to target.',examples:["Input: nums=[2,7,11,15], target=9","Output: [0,1]"],evidence:[["array of integers nums",0],["integer target",0],["return the indices",1],["two numbers",3],["add up to target",3]],answers:{given:"nums and target",asked:"the indices of the two numbers",constraints:"n can be large, so avoid O(n²)",clues:"two numbers, add up, target",pattern:"HashMap / HashSet",ds:"HashMap",template:"HashMap complement lookup",test:"normal pair, duplicate values, and no-solution case"},sources:["The variables nums and target are given directly.","The phrase “return the indices” tells you what is asked.","No explicit size is given; the training assumption is to avoid O(n²) for large n.","“two numbers”, “add up”, and “target” are the clue words.","Pattern is recognized from the clues, not stated in the question.","HashMap is chosen because fast lookup is needed.","The reusable Java approach is complement lookup.","Test cases are derived; they are not stated in the question."],complexity:"O(n)",why:"A HashMap provides fast lookup of the complement while scanning the array."},
{title:"Maximum Subarray",text:'Given an integer array nums, find the contiguous subarray with the largest sum and return its sum.',examples:["Input: [-2,1,-3,4,-1,2,1,-5,4]","Output: 6"],evidence:[["integer array nums",0],["contiguous subarray",2],["largest sum",3],["return its sum",1]],answers:{given:"integer array nums",asked:"the largest sum of a contiguous subarray",constraints:"the subarray must be contiguous",clues:"contiguous, subarray, largest sum",pattern:"Dynamic Programming",ds:"Array / DP",template:"Kadane's algorithm",test:"all negative values, one element, and mixed values"},sources:["“integer array nums” is given directly.","“return its sum” plus “largest” defines what is asked.","“contiguous subarray” is an explicit requirement.","“contiguous”, “subarray”, and “largest sum” are the clue words.","Dynamic Programming is recognized from the repeated subproblem structure.","The array stores the values; DP stores the best result so far.","Kadane's algorithm is the reusable template.","Test cases are derived; they are not stated in the question."],complexity:"O(n)",why:"The best subarray ending at each position can be built from the previous position."},
{title:"Longest Substring Without Repeating Characters",text:'Given a string s, find the length of the longest substring without repeating characters.',examples:["Input: abcabcbb","Output: 3"],evidence:[["string s",0],["length",1],["longest substring",3],["without repeating characters",2]],answers:{given:"String s",asked:"the length of the longest substring",constraints:"the substring is contiguous and cannot repeat characters",clues:"longest, substring, without repeating",pattern:"Sliding Window",ds:"HashSet / HashMap",template:"Sliding window",test:"empty string, all unique characters, and repeated characters"},sources:["“string s” is given directly.","“find the length” defines the requested output.","“substring” means contiguous, and it cannot repeat characters.","“longest”, “substring”, and “without repeating” are the clue words.","Sliding Window matches a longest contiguous range with a changing boundary.","A Set/Map tracks characters inside the current window.","Sliding window is the reusable template.","Test cases are derived; they are not stated in the question."],complexity:"O(n)",why:"A sliding window expands and shrinks to maintain a contiguous substring without duplicates."}
];
const templates={"HashMap / HashSet":"Map<Integer,Integer> map=new HashMap<>();\nfor(int i=0;i<nums.length;i++){\n  int need=target-nums[i];\n  if(map.containsKey(need)) return new int[]{map.get(need),i};\n  map.put(nums[i],i);\n}\nreturn new int[]{};","Dynamic Programming":"int current=nums[0], best=nums[0];\nfor(int i=1;i<nums.length;i++){\n  current=Math.max(nums[i],current+nums[i]);\n  best=Math.max(best,current);\n}\nreturn best;","Sliding Window":"Set<Character> set=new HashSet<>();\nint left=0,best=0;\nfor(int right=0;right<s.length();right++){\n  while(set.contains(s.charAt(right))) set.remove(s.charAt(left++));\n  set.add(s.charAt(right));\n  best=Math.max(best,right-left+1);\n}\nreturn best;"};
let current=0,step=0,started=false,checked=false,done=new Set();
const $=id=>document.getElementById(id);
function renderQuestion(){
 const q=questions[current];
 $("qno").textContent=(current+1)+"/"+questions.length;
 $("title").textContent=q.title;
 let html=q.text;
(q.evidence||[]).forEach(([phrase,idx])=>{html=html.replace(phrase,'<span class="evidence" data-step="'+idx+'">'+phrase+'</span>')});
$("question").innerHTML='<div class="question-text">'+html+'</div>'+q.examples.map(x=>'<div class="example">'+x+'</div>').join("");
bindEvidence();
 $("workspace").innerHTML=""; $("feedback").textContent=""; $("feedback").className="feedback";
 $("result").classList.add("hidden"); $("start").disabled=false; started=false; checked=false;
 $("next").disabled=true; $("next").textContent="Start Step";
 renderSteps();
}
function renderSteps(){
 const q=questions[current];
 $("steps").innerHTML=framework.map((name,i)=>{
   const key=name.toLowerCase();
   const ans=key==="data structure"?q.answers.ds:key==="template"?q.answers.template:key==="test"?q.answers.test:q.answers[key];
   const source=q.sources&&q.sources[i]?q.sources[i]:"Derived from the question.";
   return '<div class="step '+(i===step?"active selected":"")+'" data-step="'+i+'"><b>'+(i+1)+". "+name+'</b><div class="model-answer"><span>Answer:</span> '+ans+'</div><span class="source-note">'+source+'</span></div>';
 }).join("");
 document.querySelectorAll(".step").forEach(el=>el.onclick=()=>selectStep(+el.dataset.step));
 highlightSource(step);
}
function highlightSource(i){
 document.querySelectorAll(".evidence").forEach(el=>el.classList.toggle("selected",+el.dataset.step===i));
}
function showInput(){
 highlightSource(step);
 const key=framework[step].toLowerCase();
 const placeholders={given:"Example: nums and target",asked:"Example: return the indices",constraints:"Example: n is large",clues:"Example: two numbers + target",pattern:"Example: HashMap", "data structure":"Example: HashMap",template:"Example: reusable approach",test:"Example: edge cases"};
 $("workspace").innerHTML='<div class="prompt"><b>What do you identify for <span>'+key+'</span>?</b><input id="answer" placeholder="'+placeholders[key]+'" autocomplete="off"></div>';
 $("answer").focus(); $("next").disabled=false; $("next").textContent="Check Answer"; checked=false; renderSteps();
}
function startReading(){started=true;step=0;showInput();}
function check(){
 const q=questions[current],key=framework[step].toLowerCase(),raw=$("answer").value.trim();
 if(!raw){$("feedback").textContent="Write your best answer first.";$("feedback").className="feedback bad";return;}
 const exp=key==="data structure"?q.answers.ds:key==="template"?q.answers.template:key==="test"?q.answers.test:q.answers[key];
 const ok=key==="test"||raw.toLowerCase().split(/[,;]+/).some(x=>x.trim()&&exp.toLowerCase().includes(x.trim()));
 $("feedback").innerHTML=(ok?"<b>✓ Your answer is on the right track.</b>":"<b>Hint:</b> Think about the clue in the question.")+'<div class="clear-answer"><strong>Correct answer:</strong> '+exp+"</div>";
 $("feedback").className="feedback "+(ok?"good":"bad"); checked=true; renderSteps(); $("next").textContent=step===7?"Reveal Solution":"Continue";
}
$("start").onclick=startReading;
$("next").onclick=()=>{if(!checked){check();return} if(step<7){step++;showInput()}else{const q=questions[current];$("pattern").textContent=q.answers.pattern;$("ds").textContent=q.answers.ds;$("complexity").textContent=q.complexity;$("why").textContent=q.why;$("code").textContent=templates[q.answers.pattern]||"Template coming soon."; $("result").classList.remove("hidden");$("feedback").textContent="Recognition complete."; $("feedback").className="feedback good";}};
$("complete").onclick=()=>{done.add(current);$("progress").textContent=done.size+" / "+questions.length;if(current<questions.length-1){current++;renderQuestion()}};
document.querySelectorAll(".tab").forEach(b=>b.onclick=()=>{document.querySelectorAll(".tab").forEach(x=>x.classList.remove("active"));document.querySelectorAll(".view").forEach(x=>x.classList.remove("active"));b.classList.add("active");$(b.dataset.view).classList.add("active")});
const patterns=[["HashMap / HashSet","Fast lookup, complement, duplicates, frequency","O(n)","HashMap"],["Two Pointers","Sorted array or opposite ends","O(n)","Array"],["Sliding Window","Longest/shortest contiguous segment","O(n)","Set/Map"],["Binary Search","Sorted data or monotonic answer","O(log n)","Array"],["Stack","Next greater, brackets, undo","O(n)","Stack"],["BFS","Shortest levels in an unweighted graph","O(V+E)","Queue"],["DFS","Explore connected paths/components","O(V+E)","Stack/recursion"],["Heap / Priority Queue","Top K, repeatedly smallest/largest","O(n log k)","Heap"],["Intervals / Greedy","Overlapping intervals or local choices","Often O(n log n)","Array"],["Dynamic Programming","Overlapping subproblems + optimal substructure","Varies","Array/Map"]];
$("patternGrid").innerHTML=patterns.map(p=>'<article class="pattern"><h3>'+p[0]+'</h3><p>'+p[1]+'</p><small>'+p[2]+' · '+p[3]+'</small></article>').join("");
$("templateList").innerHTML=Object.entries(templates).map(([n,c])=>'<article class="template"><h3>'+n+'</h3><pre><code>'+c.replace(/</g,"&lt;")+"</code></pre></article>").join("");
renderQuestion();