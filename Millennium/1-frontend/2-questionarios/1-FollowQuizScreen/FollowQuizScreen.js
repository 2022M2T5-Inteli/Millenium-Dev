var value = "edsfs";
var card = ["card1","card2","card3","card4","card5","card6","card7","card8"]
for (let i = 0; i < 8; i++){
    value = document.getElementById(card[i]).getAttribute("aria-valuenow")
if (value > 70 && value < 100) {
    document.getElementById(card[i]).setAttribute("role","progressbar1")
}
if (value <= 70 && value > 30) {
    document.getElementById(card[i]).setAttribute("role","progressbar")
}
if (value <= 30 && value > 0) {
    document.getElementById(card[i]).setAttribute("role","progressbar3")
}
if (value == 100) {
    document.getElementById(card[i]).setAttribute("role","progressbar100")
    document.getElementById(card[i]).innerHTML="<i class='fa-solid fa-check'></i>"
}
if (value == 0) {
    document.getElementById(card[i]).setAttribute("role","progressbar0")
}
var style = `--value:${value}`
console.log(value);
console.log(card[i]);
console.log(style)
document.getElementById(card[i]).setAttribute("style",(style))
}
