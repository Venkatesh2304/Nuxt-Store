function enforceMinMax(el) {
  console.log(el.value);
  if (el.value != "") {
    if (parseInt(el.value) < parseInt(el.min)) {
      el.value = el.min;
    }
  }
}
function backmini(event) { event.target.parentNode.parentNode.style.transform = "rotateY(360deg)"; }
