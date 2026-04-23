const f = function() { return "a"; };
try {
  console.log(f.replace("a", "b"));
} catch (e: any) {
  console.log("Error:", e.message);
}
