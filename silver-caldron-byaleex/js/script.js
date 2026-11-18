const text = "A alquimia dos sabores da família Riddle.";
const speed = 100;
let i = 0;

function typeWriter() {
    const element = document.getElementById("typewriter");
    
    if (i < text.length) {
        element.innerHTML += text.charAt(i);
        i++;
        setTimeout(typeWriter, speed);
    } else {
        element.style.borderRight = "none";
    }
}

window.onload = typeWriter;

function openNav() {
    document.getElementById("main-header").classList.add("open");
    document.querySelector(".main-content").style.marginLeft = "250px";
}

function closeNav() {
    document.getElementById("main-header").classList.remove("open");
    document.querySelector(".main-content").style.marginLeft = "100px";
}