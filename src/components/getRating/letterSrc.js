export default (score) =>
  score >= 100 ? "letter_S" :
  score >= 90 ? "letter_A" : 
  score >= 80 ? "letter_B" :
  "letter_C";
