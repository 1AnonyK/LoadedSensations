// ============================================
// EMAILJS CONFIGURATION
// ============================================
const EMAILJS_SERVICE_ID = 'service_i4tx58m';
const EMAILJS_TEMPLATE_ID = 'template_n62fnor';
const RESTAURANT_EMAIL = 'anonymouskaygee@gmail.com';
// ============================================

(function(){
    emailjs.init('A4iyMCLFKXtKCK3o6');
})();

let orderData = {
    type: '',
    items: [],
    popcornSpice: '',
    main: '',
    sauce: '',
    drink: '',
    total: 0,
    customer: {
        firstName: '',
        surname: ''
    },
    crosswordAttempts: 0,
    discountApplied: true
};

const spices = [
    { 
        name: 'Spicy Paprika & Rosemary', 
        fact: 'Rosemary enhances memory and concentration!', 
        color: 'red',
        angleStart: 0,
        angleEnd: 120
    },
    { 
        name: 'Caramel & Basil', 
        fact: 'Basil is known as the "king of herbs" and can improve mood!', 
        color: 'blue',
        angleStart: 120,
        angleEnd: 240
    },
    { 
        name: 'Cheese & Chives with Coriander', 
        fact: 'Coriander aids digestion and has been used for over 7,000 years!', 
        color: 'yellow',
        angleStart: 240,
        angleEnd: 360
    }
];

const sauces = [
    { name: 'BBQ with Rosemary', fact: 'Rosemary has powerful antioxidant and anti-inflammatory properties!' },
    { name: 'Garlic Aioli with Thyme', fact: 'Thyme has antibacterial properties and boosts immunity!' },
    { name: 'Sweet Chili with Cilantro', fact: 'Cilantro helps remove heavy metals from the body!' }
];

let currentStep = 1;

function updateProgress() {
    const totalSteps = orderData.type === 'combo' ? 10 : 7;
    const progress = (currentStep / totalSteps) * 100;
    document.getElementById('progressBar').style.width = progress + '%';
}

function nextStep(step) {
    document.querySelectorAll('.step').forEach(s => s.classList.remove('active'));
    document.getElementById('step' + step).classList.add('active');
    currentStep = step;
    updateProgress();
    window.scrollTo(0, 0);
}

function validateCustomerDetails() {
    const firstName = document.getElementById('customerName').value.trim();
    const surname = document.getElementById('customerSurname').value.trim();

    let isValid = true;

    document.getElementById('nameError').textContent = '';
    document.getElementById('surnameError').textContent = '';

    if (!firstName) {
        document.getElementById('nameError').textContent = 'Please enter your first name';
        document.getElementById('customerName').classList.add('error');
        isValid = false;
    } else {
        document.getElementById('customerName').classList.remove('error');
    }

    if (!surname) {
        document.getElementById('surnameError').textContent = 'Please enter your surname';
        document.getElementById('customerSurname').classList.add('error');
        isValid = false;
    } else {
        document.getElementById('customerSurname').classList.remove('error');
    }

    if (isValid) {
        orderData.customer.firstName = firstName;
        orderData.customer.surname = surname;
        nextStep(2);
    }
}

function selectOrderType(type) {
    orderData.type = type;
    if (type === 'combo') {
        orderData.items = ['main', 'dessert', 'drink'];
        orderData.total = 75;
        nextStep(5); // Skip to main selection for combo
    } else {
        nextStep(3);
    }
}

function confirmIndividualItems() {
    const items = [];
    let total = 0;
    
    if (document.getElementById('itemPopcorn').checked) {
        items.push('popcorn');
        total += 12;
    }
    if (document.getElementById('itemBoerewors').checked) {
        items.push('main');
        total += 20;
    }
    if (document.getElementById('itemLoadedFries').checked) {
        items.push('main');
        total += 35;
    }
    if (document.getElementById('itemDessert').checked) {
        items.push('dessert');
        total += 25;
    }
    if (document.getElementById('itemDrink').checked) {
        items.push('drink');
        total += 25;
    }

    if (items.length === 0) {
        alert('Please select at least one item!');
        return;
    }

    orderData.items = items;
    orderData.total = total;

    if (items.includes('popcorn')) {
        nextStep(4);
    } else if (items.includes('main')) {
        nextStep(5);
    } else if (items.includes('drink')) {
        nextStep(7);
    } else {
        displayOrderSummary();
        nextStep(9);
    }
}

function spinWheel() {
    const wheel = document.getElementById('spinWheel');
    const btn = document.getElementById('spinBtn');
    btn.disabled = true;
    
    const spins = 5 + Math.random() * 3;
    const extraDegrees = Math.floor(Math.random() * 360);
    const totalRotation = (spins * 360) + extraDegrees;
    
    wheel.style.transform = `rotate(${totalRotation}deg)`;
    
    setTimeout(function() {
        let finalAngle = extraDegrees % 360;
        
        let selectedSpice = null;
        for (let spice of spices) {
            if (finalAngle >= spice.angleStart && finalAngle < spice.angleEnd) {
                selectedSpice = spice;
                break;
            }
        }
        
        console.log('Spin Debug Info:');
        console.log('Final angle:', finalAngle);
        console.log('Selected section:', selectedSpice.color);
        console.log('Spice name:', selectedSpice.name);
        
        orderData.popcornSpice = selectedSpice.name;
        document.getElementById('spiceName').textContent = selectedSpice.name;
        document.getElementById('spiceFact').textContent = selectedSpice.fact;
        document.getElementById('spiceResult').style.display = 'block';
    }, 4000);
}

function afterPopcorn() {
    if (orderData.items.includes('main')) {
        nextStep(5);
    } else if (orderData.items.includes('drink')) {
        nextStep(7);
    } else {
        displayOrderSummary();
        nextStep(9);
    }
}

function selectMain(main) {
    orderData.main = main;
    
    if (orderData.type === 'individual') {
        // Add main price for individual orders
        if (main === 'Boerewors') {
            orderData.total += 20;
        } else if (main === 'Loaded Fries') {
            orderData.total += 35;
        }
    }
    
    if (orderData.type === 'combo') {
        nextStep(6); // Sauce generator for combo
    } else if (orderData.items.includes('drink')) {
        nextStep(7);
    } else {
        displayOrderSummary();
        nextStep(9);
    }
}

function generateSauce() {
    const btn = document.getElementById('generateBtn');
    btn.disabled = true;
    
    let count = 0;
    const interval = setInterval(() => {
        const num = Math.floor(Math.random() * 3) + 1;
        document.getElementById('sauceNumber').textContent = num;
        count++;
        
        if (count > 20) {
            clearInterval(interval);
            const finalNum = Math.floor(Math.random() * 3);
            document.getElementById('sauceNumber').textContent = finalNum + 1;
            
            orderData.sauce = sauces[finalNum].name;
            document.getElementById('sauceName').textContent = sauces[finalNum].name;
            document.getElementById('sauceFact').textContent = sauces[finalNum].fact;
            document.getElementById('sauceResultDiv').style.display = 'block';
        }
    }, 100);
}

function afterMain() {
    if (orderData.type === 'combo') {
        nextStep(7); // Drink selection for combo
    } else if (orderData.items.includes('drink')) {
        nextStep(7);
    } else {
        displayOrderSummary();
        nextStep(9);
    }
}

function selectDrink(drink) {
    orderData.drink = drink;
    
    if (orderData.type === 'individual') {
        orderData.total += 25;
    }
    
    if (orderData.type === 'combo') {
        nextStep(8); // Crossword game for combo
    } else {
        displayOrderSummary();
        nextStep(9);
    }
}

function moveNext(current, nextIndex) {
    if (current.value.length === 1 && nextIndex < 10) {
        document.getElementById('c' + nextIndex).focus();
    }
}

function checkCrossword() {
    let answer = '';
    for (let i = 0; i < 10; i++) {
        answer += document.getElementById('c' + i).value.toUpperCase();
    }
    
    orderData.crosswordAttempts++;
    
    if (answer === 'PEPPERMINT') {
        if (orderData.crosswordAttempts === 1) {
            document.getElementById('crosswordFeedback').style.color = '#27ae60';
            document.getElementById('crosswordFeedback').textContent = '✓ Correct! Well done! You earned your discount!';
            orderData.discountApplied = true;
        } else {
            document.getElementById('crosswordFeedback').style.color = '#27ae60';
            document.getElementById('crosswordFeedback').textContent = '✓ Correct! But discount only applies on first attempt.';
            orderData.discountApplied = false;
            orderData.total = 80; // Remove R5 discount
        }
        setTimeout(() => {
            document.getElementById('congratsSection').style.display = 'block';
            displayOrderSummary();
            nextStep(9);
        }, 2000);
    } else {
        document.getElementById('crosswordFeedback').style.color = '#e74c3c';
        document.getElementById('crosswordFeedback').textContent = '✗ Not quite right. Try again or skip to continue without discount.';
    }
}

function skipCrossword() {
    orderData.discountApplied = false;
    orderData.total = 80; // Remove R5 discount
    displayOrderSummary();
    nextStep(9);
}

function displayOrderSummary() {
    const summary = document.getElementById('orderSummary');
    const fullName = `${orderData.customer.firstName} ${orderData.customer.surname}`;
    let html = '<h3>Your Order Summary</h3>';
    html += `<div class="order-item"><span><strong>Customer:</strong> ${fullName}</span><span></span></div>`;
    
    if (orderData.items.includes('popcorn')) {
        html += `<div class="order-item"><span>🍿 Popcorn (${orderData.popcornSpice})</span><span>R12</span></div>`;
    }
    if (orderData.items.includes('main')) {
        const mainPrice = orderData.main === 'Boerewors' ? 20 : 35;
        const displayPrice = orderData.type === 'combo' ? 'INCLUDED' : `R${mainPrice}`;
        html += `<div class="order-item"><span>🍽️ ${orderData.main}</span><span>${displayPrice}</span></div>`;
        if (orderData.sauce) {
            html += `<div class="order-item"><span>   └ Sauce: ${orderData.sauce}</span><span></span></div>`;
        }
    }
    if (orderData.items.includes('dessert')) {
        const displayPrice = orderData.type === 'combo' ? 'INCLUDED' : 'R25';
        html += `<div class="order-item"><span>🍰 Peppermint Tart</span><span>${displayPrice}</span></div>`;
    }
    if (orderData.items.includes('drink')) {
        const displayPrice = orderData.type === 'combo' ? 'INCLUDED' : 'R25';
        html += `<div class="order-item"><span>🥤 ${orderData.drink}</span><span>${displayPrice}</span></div>`;
    }
    
    if (orderData.type === 'combo') {
        if (orderData.discountApplied) {
            html += `<div class="herb-fact" style="margin-top: 20px;"><strong>🎁 Combo Deal Applied!</strong><br>You saved R5! (Regular price: R80)</div>`;
        } else {
            html += `<div class="discount-lost" style="margin-top: 20px;"><strong>⚠️ Discount Not Applied</strong><br>Challenge not completed on first attempt.<br>Regular price: R80</div>`;
        }
    }
    
    html += `<div class="total">Total: R${orderData.total}</div>`;
    summary.innerHTML = html;
}

function submitOrder() {
    const orderNum = 'LS' + Math.floor(1000 + Math.random() * 9000);
    
    const orders = JSON.parse(localStorage.getItem('orders') || '[]');
    const fullOrder = {
        orderNumber: orderNum,
        ...orderData,
        timestamp: new Date().toISOString()
    };
    orders.push(fullOrder);
    localStorage.setItem('orders', JSON.stringify(orders));
    
    const btn = event.target;
    btn.disabled = true;
    btn.textContent = 'Sending Order...';
    
    sendOrderToRestaurant(orderNum, fullOrder)
        .then(() => {
            document.getElementById('orderNumber').textContent = orderNum;
            nextStep(10);
        })
        .catch((error) => {
            console.error('Failed to send order:', error);
            document.getElementById('orderNumber').textContent = orderNum;
            nextStep(10);
            alert('Order placed but email notification may have failed. Please show your order number at the stall.');
        });
}

function sendOrderToRestaurant(orderNum, fullOrder) {
    return new Promise((resolve, reject) => {
        const fullName = `${fullOrder.customer.firstName} ${fullOrder.customer.surname}`;
        
        let orderDetails = [];
        if (fullOrder.items.includes('popcorn')) {
            orderDetails.push(`🍿 Popcorn - ${fullOrder.popcornSpice} - R12`);
        }
        if (fullOrder.items.includes('main')) {
            const mainPrice = fullOrder.main === 'Boerewors' ? 20 : 35;
            const priceDisplay = fullOrder.type === 'combo' ? 'INCLUDED' : `R${mainPrice}`;
            orderDetails.push(`🍽️ ${fullOrder.main} - ${priceDisplay}`);
            if (fullOrder.sauce) {
                orderDetails.push(`   └ Sauce: ${fullOrder.sauce}`);
            }
        }
        if (fullOrder.items.includes('dessert')) {
            const priceDisplay = fullOrder.type === 'combo' ? 'INCLUDED' : 'R25';
            orderDetails.push(`🍰 Peppermint Tart - ${priceDisplay}`);
        }
        if (fullOrder.items.includes('drink')) {
            const priceDisplay = fullOrder.type === 'combo' ? 'INCLUDED' : 'R25';
            orderDetails.push(`🥤 ${fullOrder.drink} - ${priceDisplay}`);
        }
        
        if (fullOrder.type === 'combo') {
            if (fullOrder.discountApplied) {
                orderDetails.push('');
                orderDetails.push('✅ Discount Applied: -R5');
            } else {
                orderDetails.push('');
                orderDetails.push('⚠️ Discount NOT Applied (Challenge incomplete)');
            }
        }
        
        const templateParams = {
            orderNumber: orderNum,
            customerName: fullName,
            orderType: fullOrder.type === 'combo' ? '3-Course Combo' : 'Individual Items',
            timestamp: new Date().toLocaleString(),
            orderDetails: orderDetails.join('\n'),
            total: fullOrder.total,
            to_email: RESTAURANT_EMAIL
        };
        
        console.log('=== SENDING ORDER VIA EMAILJS ===');
        console.log('Service ID:', EMAILJS_SERVICE_ID);
        console.log('Template ID:', EMAILJS_TEMPLATE_ID);
        console.log('Order Data:', templateParams);
        console.log('================================\n');
        
        emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, templateParams)
            .then((response) => {
                console.log('✅ Email sent successfully!', response.status, response.text);
                
                const notifications = JSON.parse(localStorage.getItem('restaurantOrders') || '[]');
                notifications.push({
                    orderNumber: orderNum,
                    customerName: fullName,
                    orderDetails: orderDetails,
                    total: fullOrder.total,
                    timestamp: new Date().toISOString(),
                    emailSent: true
                });
                localStorage.setItem('restaurantOrders', JSON.stringify(notifications));
                
                resolve(response);
            })
            .catch((error) => {
                console.error('❌ Failed to send email:', error);
                reject(error);
            });
    });
}

function startNewOrder() {
    // Clear any stored order data if needed
    localStorage.removeItem('currentOrder');
    
    // Redirect back to the main page
    window.location.href = 'index.html';
}

updateProgress();