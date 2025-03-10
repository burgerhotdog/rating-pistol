export default (score) =>
  score >= 100 ? "S" :
  score >= 90 ? "A" : 
  score >= 80 ? "B" :
  "C";
