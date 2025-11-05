// ============================================
// EMAILJS CONFIGURATION
// ============================================
const EMAILJS_SERVICE_ID = 'service_sku6pwt';
const EMAILJS_TEMPLATE_ID = 'template_0ece4dp';
const RESTAURANT_EMAIL = 'loadedsensations@gmail.com';
// ============================================

(function(){
    emailjs.init('vJa3QR9kWj27f5Er7');
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

// Spices aligned with wheel colors (cyan, yellow, red)
// The wheel pointer is at the top, so we need to account for which section the pointer lands in
const spices = [
    { 
        name: 'Sour Cream & Chives', 
        fact: 'Chives are rich in vitamins A and C, and belong to the allium family alongside garlic and onions, providing a mild onion flavor.', 
        color: 'cyan',
        angleStart: 0,
        angleEnd: 120
    },
    { 
        name: 'Salt and Vinegar with Parsley or Thyme', 
        fact: 'Parsley is more than a garnish - it contains high levels of vitamin K and antioxidants. Thyme has antimicrobial properties used since ancient Egypt.', 
        color: 'yellow',
        angleStart: 120,
        angleEnd: 240
    },
    { 
        name: 'Butter Salt & Rosemary', 
        fact: 'Rosemary contains carnosic acid, which helps protect the brain from free radicals and may improve memory and concentration.', 
        color: 'red',
        angleStart: 240,
        angleEnd: 360
    }
];

// Sauces for Boerewors
const boereworsSauces = [
    { 
        name: 'Lemon & Herb', 
        fact: 'The acidity in lemon juice enhances the aromatic compounds in herbs, making flavors more vibrant and helping preserve the freshness of ingredients.' 
    },
    { 
        name: 'Peri Peri', 
        fact: 'Peri Peri peppers contain capsaicin, which triggers endorphin release. The African Bird\'s Eye chili has been used in Mozambican cuisine for centuries.' 
    },
    { 
        name: 'Chilli with Mint', 
        fact: 'Mint contains menthol which creates a cooling sensation that balances the heat from chili peppers, while both herbs aid in digestion.' 
    }
];

// Flavours for Loaded Fries (customer chooses)
const loadedFriesFlavours = [
    { 
        name: 'Smokey Fiesta Rub', 
        fact: 'This blend combines smoked paprika with cumin and coriander - spices that have been traded along ancient routes for thousands of years.' 
    },
    { 
        name: 'Italian Street Fry', 
        fact: 'Features oregano and basil - Mediterranean herbs rich in antioxidants. Oregano has 42 times more antioxidants than apples!' 
    }
];

let currentStep = 1;
let currentRotation = 0; // Track total rotation

function updateProgress() {
    const totalSteps = orderData.type === 'combo' ? 11 : 8; // Updated for new flavour step
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
        orderData.items = ['popcorn', 'main', 'dessert', 'drink'];
        orderData.total = 75;
        nextStep(4);
    } else {
        nextStep(3);
    }
}

function confirmIndividualItems() {
    const items = [];
    let total = 0;
    
    // Reset orderData
    orderData.items = [];
    orderData.total = 0;
    orderData.popcornSpice = '';
    orderData.main = '';
    orderData.sauce = '';
    orderData.drink = '';
    
    if (document.getElementById('itemPopcorn').checked) {
        items.push('popcorn');
        total += 12;
    }
    if (document.getElementById('itemBoerewors').checked) {
        items.push('main');
        orderData.main = 'Boerewors';
        total += 20;
    }
    if (document.getElementById('itemLoadedFries').checked) {
        items.push('main');
        orderData.main = 'Loaded Fries';
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

    // Check if both mains are selected
    if (document.getElementById('itemBoerewors').checked && document.getElementById('itemLoadedFries').checked) {
        alert('Please select only one main course: either Boerewors OR Loaded Fries');
        return;
    }

    orderData.items = items;
    orderData.total = total;

    if (items.includes('popcorn')) {
        nextStep(4);
    } else if (items.includes('main')) {
        // Route to appropriate step based on main selection
        if (orderData.main === 'Boerewors') {
            nextStep(6); // Sauce generator
        } else if (orderData.main === 'Loaded Fries') {
            nextStep(11); // Flavour selection
        }
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
    
    // Spin clockwise (positive rotation) with 5-8 full rotations
    const spins = 5 + Math.random() * 3;
    const extraDegrees = Math.floor(Math.random() * 360);
    const spinAmount = (spins * 360) + extraDegrees;
    
    // Add to current rotation for cumulative effect
    currentRotation += spinAmount;
    
    wheel.style.transform = `rotate(${currentRotation}deg)`;
    
    setTimeout(function() {
        // Calculate the final angle position (normalize to 0-360)
        let normalizedAngle = currentRotation % 360;
        if (normalizedAngle < 0) normalizedAngle += 360;
        
        // Since the pointer is at the top (12 o'clock position pointing down),
        // we need to find which section the pointer is pointing at
        // The pointer points DOWN, so we need to check what's at the top
        // We invert the angle: what's at top when wheel shows X degrees is actually at (360-X) from wheel's perspective
        let pointerAngle = (360 - normalizedAngle) % 360;
        
        let selectedSpice = null;
        for (let spice of spices) {
            if (pointerAngle >= spice.angleStart && pointerAngle < spice.angleEnd) {
                selectedSpice = spice;
                break;
            }
        }
        
        console.log('=== Spin Debug Info ===');
        console.log('Total rotation:', currentRotation);
        console.log('Normalized angle:', normalizedAngle);
        console.log('Pointer angle:', pointerAngle);
        console.log('Selected color:', selectedSpice.color);
        console.log('Selected spice:', selectedSpice.name);
        console.log('======================');
        
        orderData.popcornSpice = selectedSpice.name;
        document.getElementById('spiceName').textContent = selectedSpice.name;
        document.getElementById('spiceFact').textContent = selectedSpice.fact;
        document.getElementById('spiceResult').style.display = 'block';
    }, 4000);
}

function afterPopcorn() {
    if (orderData.items.includes('main')) {
        // Route to appropriate step based on main type
        if (orderData.main === 'Boerewors') {
            nextStep(6); // Sauce generator
        } else if (orderData.main === 'Loaded Fries') {
            nextStep(11); // Flavour selection
        } else {
            // Main not yet selected (combo flow)
            nextStep(5);
        }
    } else if (orderData.items.includes('drink')) {
        nextStep(7);
    } else {
        displayOrderSummary();
        nextStep(9);
    }
}

function selectMain(main) {
    orderData.main = main;
    
    // Don't add prices here for individual - already added in confirmIndividualItems
    // Only add for combo (which doesn't add in confirmIndividualItems)
    
    // Boerewors gets sauce generator game
    if (main === 'Boerewors') {
        if (orderData.type === 'combo') {
            nextStep(6); // Sauce generator for boerewors
        } else if (orderData.items.includes('drink')) {
            nextStep(7);
        } else {
            displayOrderSummary();
            nextStep(9);
        }
    } 
    // Loaded Fries - customer chooses flavour
    else if (main === 'Loaded Fries') {
        nextStep(11); // New step for flavour selection
    }
}

function generateSauce() {
    const btn = document.getElementById('generateBtn');
    btn.disabled = true;
    
    // Only for Boerewors
    let count = 0;
    const interval = setInterval(() => {
        const num = Math.floor(Math.random() * boereworsSauces.length) + 1;
        document.getElementById('sauceNumber').textContent = num;
        count++;
        
        if (count > 20) {
            clearInterval(interval);
            const finalNum = Math.floor(Math.random() * boereworsSauces.length);
            document.getElementById('sauceNumber').textContent = finalNum + 1;
            
            orderData.sauce = boereworsSauces[finalNum].name;
            document.getElementById('sauceName').textContent = boereworsSauces[finalNum].name;
            document.getElementById('sauceFact').textContent = boereworsSauces[finalNum].fact;
            document.getElementById('sauceResultDiv').style.display = 'block';
        }
    }, 100);
}

function selectFlavour(flavour) {
    // For Loaded Fries flavour selection
    const selectedFlavour = loadedFriesFlavours.find(f => f.name === flavour);
    orderData.sauce = selectedFlavour.name;
    
    // Show the herb fact for the selected flavour
    document.getElementById('flavourFact').textContent = selectedFlavour.fact;
    document.getElementById('flavourFactSection').style.display = 'block';
    
    // Continue to next step after short delay
    setTimeout(() => {
        if (orderData.type === 'combo') {
            if (orderData.items.includes('drink')) {
                nextStep(7);
            } else {
                nextStep(8); // Crossword for combo
            }
        } else if (orderData.items.includes('drink')) {
            nextStep(7);
        } else {
            displayOrderSummary();
            nextStep(9);
        }
    }, 2000);
}

function afterMain() {
    if (orderData.type === 'combo') {
        nextStep(7);
    } else if (orderData.items.includes('drink')) {
        nextStep(7);
    } else {
        displayOrderSummary();
        nextStep(9);
    }
}

function selectDrink(drink) {
    orderData.drink = drink;
    
    // Don't add price here for individual - already added in confirmIndividualItems
    
    if (orderData.type === 'combo') {
        nextStep(8);
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
            orderData.total = 80;
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
    orderData.total = 80;
    displayOrderSummary();
    nextStep(9);
}

function displayOrderSummary() {
    const summary = document.getElementById('orderSummary');
    const fullName = `${orderData.customer.firstName} ${orderData.customer.surname}`;
    let html = '<h3>Your Order Summary</h3>';
    html += `<div class="order-item"><span><strong>Customer:</strong> ${fullName}</span><span></span></div>`;
    
    if (orderData.items.includes('popcorn')) {
        const displayPrice = orderData.type === 'combo' ? 'INCLUDED' : 'R12';
        html += `<div class="order-item"><span>🍿 Popcorn (${orderData.popcornSpice})</span><span>${displayPrice}</span></div>`;
    }
    if (orderData.items.includes('main')) {
        const mainPrice = orderData.main === 'Boerewors' ? 20 : 35;
        const displayPrice = orderData.type === 'combo' ? 'INCLUDED' : `R${mainPrice}`;
        html += `<div class="order-item"><span>🍽️ ${orderData.main}</span><span>${displayPrice}</span></div>`;
        if (orderData.sauce) {
            html += `<div class="order-item"><span>   └─ Sauce: ${orderData.sauce}</span><span></span></div>`;
        }
    }
    if (orderData.items.includes('dessert')) {
        const displayPrice = orderData.type === 'combo' ? 'INCLUDED' : 'R25';
        html += `<div class="order-item"><span>🰰 Peppermint Tart</span><span>${displayPrice}</span></div>`;
    }
    if (orderData.items.includes('drink')) {
        const displayPrice = orderData.type === 'combo' ? 'INCLUDED' : 'R25';
        html += `<div class="order-item"><span>🥤 ${orderData.drink}</span><span>${displayPrice}</span></div>`;
    }
    
    if (orderData.type === 'combo') {
        const popcornPrice = 12;
        const mainPrice = orderData.main === 'Boerewors' ? 20 : 35;
        const dessertPrice = 25;
        const drinkPrice = 25;
        const individualTotal = popcornPrice + mainPrice + dessertPrice + drinkPrice;
        const savings = individualTotal - orderData.total;
        
        if (orderData.discountApplied) {
            html += `<div class="herb-fact" style="margin-top: 20px;"><strong>🎁 Combo Deal Applied!</strong><br>You saved R${savings}! (Individual price: R${individualTotal})</div>`;
        } else {
            html += `<div class="discount-lost" style="margin-top: 20px;"><strong>⚠️ Discount Not Applied</strong><br>Challenge not completed on first attempt.<br>Regular combo price: R80</div>`;
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
            const priceDisplay = fullOrder.type === 'combo' ? 'INCLUDED' : 'R12';
            orderDetails.push(`🍿 Popcorn - ${fullOrder.popcornSpice} - ${priceDisplay}`);
        }
        if (fullOrder.items.includes('main')) {
            const mainPrice = fullOrder.main === 'Boerewors' ? 20 : 35;
            const priceDisplay = fullOrder.type === 'combo' ? 'INCLUDED' : `R${mainPrice}`;
            orderDetails.push(`🍽️ ${fullOrder.main} - ${priceDisplay}`);
            if (fullOrder.sauce) {
                orderDetails.push(`   └─ Sauce: ${fullOrder.sauce}`);
            }
        }
        if (fullOrder.items.includes('dessert')) {
            const priceDisplay = fullOrder.type === 'combo' ? 'INCLUDED' : 'R25';
            orderDetails.push(`🰰 Peppermint Tart - ${priceDisplay}`);
        }
        if (fullOrder.items.includes('drink')) {
            const priceDisplay = fullOrder.type === 'combo' ? 'INCLUDED' : 'R25';
            orderDetails.push(`🥤 ${fullOrder.drink} - ${priceDisplay}`);
        }
        
        if (fullOrder.type === 'combo') {
            const popcornPrice = 12;
            const mainPrice = fullOrder.main === 'Boerewors' ? 20 : 35;
            const dessertPrice = 25;
            const drinkPrice = 25;
            const individualTotal = popcornPrice + mainPrice + dessertPrice + drinkPrice;
            const savings = individualTotal - fullOrder.total;
            
            if (fullOrder.discountApplied) {
                orderDetails.push('');
                orderDetails.push(`✅ Combo Discount Applied: Saved R${savings}`);
                orderDetails.push(`   (Individual price: R${individualTotal})`);
            } else {
                orderDetails.push('');
                orderDetails.push('⚠️ Crossword Discount NOT Applied');
                orderDetails.push('   (Challenge incomplete)');
            }
        }
        
        const templateParams = {
            orderNumber: orderNum,
            customerName: fullName,
            orderType: fullOrder.type === 'combo' ? '4-Course Combo' : 'Individual Items',
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
    localStorage.removeItem('currentOrder');
    window.location.href = 'index.html';
}

updateProgress();