
const status = document.querySelectorAll('.statusP');

status.forEach(element => {
    
    element.style.color = (element.textContent === 'true') ? '#FF69B4' : '#FF6347';
});
