// ============================================
// 🎌 Anime Shop - JavaScript সম্পূর্ণ লজিক
// ============================================

// ========== গ্লোবাল ভেরিয়েবল ==========
let currentUser = null;
let users = [];
let cart = [];
let orders = [];

// পণ্যের ডেটাবেস
const productsDatabase = [
    {
        id: 1,
        name: "Naruto Figurine",
        category: "figures",
        price: 1500,
        emoji: "🧡",
        description: "নারুটো উজুমাকির সুন্দর ফিগার"
    },
    {
        id: 2,
        name: "One Piece Manga Vol 1",
        category: "manga",
        price: 800,
        emoji: "📗",
        description: "ওয়ান পিস ম্যাঙ্গার প্রথম খণ্ড"
    },
    {
        id: 3,
        name: "Death Note Poster",
        category: "merchandise",
        price: 600,
        emoji: "🖼️",
        description: "ডেথ নোট এর সুন্দর পোস্টার"
    },
    {
        id: 4,
        name: "Demon Slayer Hoodie",
        category: "clothing",
        price: 2500,
        emoji: "👕",
        description: "ডেমন স্লেয়ার হুডি (সব সাইজ উপলব্ধ)"
    },
    {
        id: 5,
        name: "Attack on Titan Figure",
        category: "figures",
        price: 2000,
        emoji: "💚",
        description: "এরেন ইয়েগারের অসাধারণ ফিগার"
    },
    {
        id: 6,
        name: "Tokyo Ghoul Manga Set",
        category: "manga",
        price: 3500,
        emoji: "📕",
        description: "টোকিও ঘোল সম্পূর্ণ সিরিজ"
    },
    {
        id: 7,
        name: "My Hero Academia Sticker Pack",
        category: "merchandise",
        price: 300,
        emoji: "✨",
        description: "বিভিন্ন চরিত্রের ২০টি স্টিকার"
    },
    {
        id: 8,
        name: "Jujutsu Kaisen T-Shirt",
        category: "clothing",
        price: 1200,
        emoji: "👔",
        description: "জুজুৎসু কাইসেন টি-শার্ট"
    },
    {
        id: 9,
        name: "Steins;Gate Keychain",
        category: "merchandise",
        price: 400,
        emoji: "🔑",
        description: "স্টেইন্স গেট কীচেইন"
    },
    {
        id: 10,
        name: "Sword Art Online Figure",
        category: "figures",
        price: 1800,
        emoji: "⚔️",
        description: "কিরিটো এবং অ্যাসুনার কম্বো ফিগার"
    },
    {
        id: 11,
        name: "Anime Socks Collection",
        category: "clothing",
        price: 500,
        emoji: "🧦",
        description: "বিভিন্ন অ্যানিমের মোজার সেট (৩ জোড়া)"
    },
    {
        id: 12,
        name: "Ergo Proxy Manga",
        category: "manga",
        price: 900,
        emoji: "📙",
        description: "এর্গো প্রক্সি সম্পূর্ণ সিরিজ"
    }
];

// ========== পেজ লোড করা হলে ==========
document.addEventListener('DOMContentLoaded', function() {
    loadFromLocalStorage();
    setupEventListeners();
    updateCartCount();
    checkAuthStatus();
});

// ========== ইভেন্ট লিসেনার সেটআপ ==========
function setupEventListeners() {
    // লগইন ফর্ম
    document.getElementById('loginForm').addEventListener('submit', handleLogin);
    
    // সাইন আপ ফর্ম
    document.getElementById('signupForm').addEventListener('submit', handleSignup);
    
    // সার্চ এবং ফিল্টার
    document.getElementById('searchInput').addEventListener('input', filterProducts);
    document.getElementById('categoryFilter').addEventListener('change', filterProducts);
    
    // হ্যামবার্গার মেনু
    document.getElementById('hamburger').addEventListener('click', toggleMenu);
    
    // চেকআউট ফর্ম
    document.getElementById('checkoutForm').addEventListener('submit', handleCheckout);
}

// ========== অথেন্টিকেশন ফাংশন ==========

// লগইন হ্যান্ডলার
function handleLogin(e) {
    e.preventDefault();
    const email = document.getElementById('loginEmail').value.trim();
    const password = document.getElementById('loginPassword').value;
    
    // ভ্যালিডেশন
    if (!validateEmail(email)) {
        showError('loginEmailError', 'সঠিক ইমেইল লিখুন');
        return;
    }
    
    if (password.length < 6) {
        showError('loginPasswordError', 'পাসওয়ার্ড কমপক্ষে ৬ অক্ষর হতে হবে');
        return;
    }
    
    // ব্যবহারকারী খুঁজে বের করা
    const user = users.find(u => u.email === email && u.password === password);
    
    if (user) {
        currentUser = user;
        saveToLocalStorage();
        document.getElementById('loginForm').reset();
        showSuccess('loginMessage', 'লগইন সফল! আপনি স্বাগত জানাই!');
        setTimeout(() => {
            document.getElementById('authSection').style.display = 'none';
            document.getElementById('homeSection').style.display = 'block';
            updateNavigation();
            clearMessages();
        }, 1500);
    } else {
        showError('loginMessage', 'ইমেইল বা পাসওয়ার্ড ভুল!');
    }
}

// সাইন আপ হ্যান্ডলার
function handleSignup(e) {
    e.preventDefault();
    const name = document.getElementById('signupName').value.trim();
    const email = document.getElementById('signupEmail').value.trim();
    const password = document.getElementById('signupPassword').value;
    const confirmPassword = document.getElementById('signupConfirmPassword').value;
    
    let isValid = true;
    
    // নাম ভ্যালিডেশন
    if (name.length < 3) {
        showError('signupNameError', 'নাম কমপক্ষে ৩ অক্ষর হতে হবে');
        isValid = false;
    }
    
    // ইমেইল ভ্যালিডেশন
    if (!validateEmail(email)) {
        showError('signupEmailError', 'সঠিক ইমেইল লিখুন');
        isValid = false;
    }
    
    // ইমেইল ইতিমধ্যে রেজিস্টার্ড কি না
    if (users.some(u => u.email === email)) {
        showError('signupEmailError', 'এই ইমেইল ইতিমধ্যে ব্যবহার করা হয়েছে');
        isValid = false;
    }
    
    // পাসওয়ার্ড ভ্যালিডেশন
    if (password.length < 6) {
        showError('signupPasswordError', 'পাসওয়ার্ড কমপক্ষে ৬ অক্ষর হতে হবে');
        isValid = false;
    }
    
    // পাসওয়ার্ড ম্যাচিং
    if (password !== confirmPassword) {
        showError('confirmPasswordError', 'পাসওয়ার্ড মেলেনি');
        isValid = false;
    }
    
    if (isValid) {
        // নতুন ব্যবহারকারী যোগ করা
        const newUser = { name, email, password };
        users.push(newUser);
        currentUser = newUser;
        saveToLocalStorage();
        
        document.getElementById('signupForm').reset();
        showSuccess('signupMessage', 'সাইন আপ সফল! স্বাগতম!');
        
        setTimeout(() => {
            document.getElementById('authSection').style.display = 'none';
            document.getElementById('homeSection').style.display = 'block';
            updateNavigation();
            clearMessages();
        }, 1500);
    }
}

// লগআউট ফাংশন
function logout() {
    if (confirm('আপনি কি নিশ্চিত লগআউট করতে?')) {
        currentUser = null;
        cart = [];
        saveToLocalStorage();
        
        // সব সেকশন লুকান
        document.querySelectorAll('.section').forEach(s => s.style.display = 'none');
        document.getElementById('authSection').style.display = 'block';
        
        // ফর্ম রিসেট
        document.getElementById('loginForm').reset();
        document.getElementById('signupForm').reset();
        
        // লগইন ফর্ম দেখান
        showLoginForm();
        updateNavigation();
    }
}

// ========== পণ্য ফাংশন ==========

// সব পণ্য দেখান
function showProducts() {
    document.querySelectorAll('.section').forEach(s => s.style.display = 'none');
    document.getElementById('productsSection').style.display = 'block';
    displayProducts(productsDatabase);
}

// পণ্য ডিসপ্লে করা
function displayProducts(products) {
    const grid = document.getElementById('productsGrid');
    grid.innerHTML = '';
    
    if (products.length === 0) {
        grid.innerHTML = '<p style="grid-column: 1/-1; text-align: center; color: #cbd5e1;">কোনো পণ্য পাওয়া যায়নি</p>';
        return;
    }
    
    products.forEach(product => {
        const card = document.createElement('div');
        card.className = 'product-card';
        card.innerHTML = `
            <div class="product-emoji">${product.emoji}</div>
            <div class="product-info">
                <div class="product-category">${getCategoryName(product.category)}</div>
                <div class="product-name">${product.name}</div>
                <div class="product-description">${product.description}</div>
                <div class="product-price">${product.price} ৳</div>
                <div class="product-actions">
                    <button onclick="addToCart(${product.id})">🛒 কার্টে যোগ করুন</button>
                </div>
            </div>
        `;
        grid.appendChild(card);
    });
}

// কার্টে পণ্য যোগ করা
function addToCart(productId) {
    if (!currentUser) {
        alert('প্রথমে লগইন করুন');
        return;
    }
    
    const product = productsDatabase.find(p => p.id === productId);
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity++;
    } else {
        cart.push({
            ...product,
            quantity: 1
        });
    }
    
    saveToLocalStorage();
    updateCartCount();
    alert(`${product.name} কার্টে যোগ হয়েছে!`);
}

// পণ্য ফিল্টার করা
function filterProducts() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    const category = document.getElementById('categoryFilter').value;
    
    let filtered = productsDatabase;
    
    if (category) {
        filtered = filtered.filter(p => p.category === category);
    }
    
    if (searchTerm) {
        filtered = filtered.filter(p => 
            p.name.toLowerCase().includes(searchTerm) || 
            p.description.toLowerCase().includes(searchTerm)
        );
    }
    
    displayProducts(filtered);
}

// ========== শপিং কার্ট ফাংশন ==========

// কার্ট দেখান
function showCart() {
    if (!currentUser) {
        alert('প্রথমে লগইন করুন');
        return;
    }
    
    document.querySelectorAll('.section').forEach(s => s.style.display = 'none');
    document.getElementById('cartSection').style.display = 'block';
    displayCart();
}

// কার্ট প্রদর্শন করা
function displayCart() {
    const cartContainer = document.getElementById('cartItems');
    cartContainer.innerHTML = '';
    
    if (cart.length === 0) {
        cartContainer.innerHTML = `
            <div class="empty-cart">
                <div class="empty-cart-emoji">🛒</div>
                <p>আপনার কার্ট খালি</p>
                <button class="btn-primary" style="margin-top: 1rem;" onclick="showProducts()">শপিং করুন</button>
            </div>
        `;
        updateCartSummary();
        return;
    }
    
    cart.forEach((item, index) => {
        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';
        cartItem.innerHTML = `
            <div class="cart-item-emoji">${item.emoji}</div>
            <div class="cart-item-details">
                <div class="cart-item-name">${item.name}</div>
                <div class="cart-item-price">${item.price} ৳ × ${item.quantity} = ${item.price * item.quantity} ৳</div>
                <div class="cart-item-quantity">
                    <button class="qty-btn" onclick="changeQuantity(${index}, -1)">−</button>
                    <span>${item.quantity}</span>
                    <button class="qty-btn" onclick="changeQuantity(${index}, 1)">+</button>
                </div>
            </div>
            <button class="cart-item-remove" onclick="removeFromCart(${index})">মুছুন</button>
        `;
        cartContainer.appendChild(cartItem);
    });
    
    updateCartSummary();
}

// পরিমাণ পরিবর্তন করা
function changeQuantity(index, change) {
    cart[index].quantity += change;
    
    if (cart[index].quantity <= 0) {
        removeFromCart(index);
    } else {
        saveToLocalStorage();
        displayCart();
    }
}

// কার্ট থেকে মুছে ফেলা
function removeFromCart(index) {
    cart.splice(index, 1);
    saveToLocalStorage();
    updateCartCount();
    displayCart();
}

// কার্ট সারসংক্ষেপ আপডেট করা
function updateCartSummary() {
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    const totalPrice = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const deliveryCharge = 50;
    const grandTotal = totalPrice + deliveryCharge;
    
    document.getElementById('totalItems').textContent = totalItems;
    document.getElementById('totalPrice').textContent = totalPrice + ' টাকা';
    document.getElementById('grandTotal').textContent = grandTotal + ' টাকা';
}

// কার্ট কাউন্ট আপডেট করা
function updateCartCount() {
    const count = cart.reduce((sum, item) => sum + item.quantity, 0);
    document.getElementById('cartCount').textContent = count;
}

// ========== চেকআউট ফাংশন ==========

function handleCheckout(e) {
    e.preventDefault();
    
    if (cart.length === 0) {
        alert('কার্ট খালি। পণ্য যোগ করুন।');
        return;
    }
    
    const name = document.getElementById('deliveryName').value.trim();
    const phone = document.getElementById('deliveryPhone').value.trim();
    const address = document.getElementById('deliveryAddress').value.trim();
    const paymentMethod = document.querySelector('input[name="paymentMethod"]:checked').value;
    
    let isValid = true;
    
    // নাম ভ্যালিডেশন
    if (name.length < 3) {
        alert('সঠিক নাম লিখুন');
        isValid = false;
        return;
    }
    
    // ফোন ভ্যালিডেশন (বাংলাদেশ ফরম্যাট)
    if (!validatePhoneNumber(phone)) {
        document.getElementById('phoneError').textContent = 'সঠিক ফোন নম্বর লিখুন (01XXXXXXXXX)';
        isValid = false;
        return;
    }
    
    if (!address || address.length < 10) {
        alert('সঠিক ঠিকানা লিখুন');
        isValid = false;
        return;
    }
    
    if (isValid) {
        // অর্ডার তৈরি করা
        const orderId = 'ORD-' + Date.now();
        const totalPrice = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        const grandTotal = totalPrice + 50;
        
        const order = {
            id: orderId,
            date: new Date().toLocaleDateString('bn-BD'),
            items: [...cart],
            deliveryInfo: { name, phone, address },
            paymentMethod: paymentMethod,
            totalPrice: totalPrice,
            deliveryCharge: 50,
            grandTotal: grandTotal,
            status: 'pending'
        };
        
        orders.push(order);
        
        // পেমেন্ট মেথড অনুযায়ী মেসেজ
        let message = '';
        if (paymentMethod === 'bkash') {
            message = `আপনার bKash পেমেন্ট রেফারেন্স: ${orderId}\n\nপেমেন্ট সম্পূর্ণ করুন এবং অর্ডার নিশ্চিত হবে।`;
        } else {
            message = `আপনার অর্ডার রেজিস্টার হয়েছে!\n\nডেলিভারি চার্জ সহ মোট: ${grandTotal} টাকা\nআমরা শীঘ্রই আপনার সাথে যোগাযোগ করব।`;
        }
        
        // কার্ট খালি করা
        cart = [];
        saveToLocalStorage();
        updateCartCount();
        
        // সাফল্য বার্তা
        alert(`অর্ডার সফল!\n\n${message}`);
        
        // অর্ডার পেজে যান
        showOrders();
    }
}

// ========== অর্ডার ফাংশন ==========

function showOrders() {
    if (!currentUser) {
        alert('প্রথমে লগইন করুন');
        return;
    }
    
    document.querySelectorAll('.section').forEach(s => s.style.display = 'none');
    document.getElementById('ordersSection').style.display = 'block';
    displayOrders();
}

function displayOrders() {
    const ordersList = document.getElementById('ordersList');
    ordersList.innerHTML = '';
    
    if (orders.length === 0) {
        ordersList.innerHTML = `
            <div class="empty-cart">
                <div class="empty-cart-emoji">📦</div>
                <p>কোনো অর্ডার নেই</p>
                <button class="btn-primary" style="margin-top: 1rem;" onclick="showProducts()">এখনই কিনুন</button>
            </div>
        `;
        return;
    }
    
    orders.forEach(order => {
        const orderCard = document.createElement('div');
        orderCard.className = 'order-card';
        
        const statusClass = order.status === 'completed' ? 'status-completed' : 'status-pending';
        const statusText = order.status === 'completed' ? 'সম্পন্ন' : 'পেন্ডিং';
        
        let itemsHTML = '';
        order.items.forEach(item => {
            itemsHTML += `<div class="order-item">
                <span>${item.name} × ${item.quantity}</span>
                <span>${item.price * item.quantity} ৳</span>
            </div>`;
        });
        
        orderCard.innerHTML = `
            <div class="order-id">অর্ডার #${order.id}</div>
            <div class="order-date">তারিখ: ${order.date}</div>
            <span class="order-status ${statusClass}">${statusText}</span>
            
            <div class="order-items">
                ${itemsHTML}
            </div>
            
            <div><strong>প্রাপকের নাম:</strong> ${order.deliveryInfo.name}</div>
            <div><strong>ফোন:</strong> ${order.deliveryInfo.phone}</div>
            <div><strong>ঠিকানা:</strong> ${order.deliveryInfo.address}</div>
            <div><strong>পেমেন্ট:</strong> ${order.paymentMethod === 'bkash' ? 'bKash' : 'ক্যাশ অন ডেলিভারি'}</div>
            
            <div class="order-total">
                মোট মূল্য: ${order.grandTotal} ৳
            </div>
        `;
        ordersList.appendChild(orderCard);
    });
}

// ========== প্রোফাইল ফাংশন ==========

function showProfile() {
    if (!currentUser) {
        alert('প্রথমে লগইন করুন');
        return;
    }
    
    document.querySelectorAll('.section').forEach(s => s.style.display = 'none');
    document.getElementById('profileSection').style.display = 'block';
    displayProfile();
}

function displayProfile() {
    const profileInfo = document.getElementById('profileInfo');
    
    const totalOrders = orders.length;
    const totalSpent = orders.reduce((sum, order) => sum + order.grandTotal, 0);
    
    profileInfo.innerHTML = `
        <div class="info-row">
            <span class="info-label">নাম:</span>
            <span class="info-value">${currentUser.name}</span>
        </div>
        <div class="info-row">
            <span class="info-label">ইমেইল:</span>
            <span class="info-value">${currentUser.email}</span>
        </div>
        <div class="info-row">
            <span class="info-label">মোট অর্ডার:</span>
            <span class="info-value">${totalOrders}</span>
        </div>
        <div class="info-row">
            <span class="info-label">মোট খরচ:</span>
            <span class="info-value">${totalSpent} ৳</span>
        </div>
        <div class="info-row">
            <span class="info-label">সদস্যপদ তারিখ:</span>
            <span class="info-value">${new Date().toLocaleDateString('bn-BD')}</span>
        </div>
    `;
}

// ========== নেভিগেশন ফাংশন ==========

function showHome() {
    if (!currentUser) return;
    document.querySelectorAll('.section').forEach(s => s.style.display = 'none');
    document.getElementById('homeSection').style.display = 'block';
}

function showLoginForm() {
    document.getElementById('loginForm').classList.add('active');
    document.getElementById('signupForm').classList.remove('active');
    document.querySelector('.auth-btn:first-child').classList.add('active');
    document.querySelector('.auth-btn:last-child').classList.remove('active');
}

function showSignupForm() {
    document.getElementById('signupForm').classList.add('active');
    document.getElementById('loginForm').classList.remove('active');
    document.querySelector('.auth-btn:last-child').classList.add('active');
    document.querySelector('.auth-btn:first-child').classList.remove('active');
}

function updateNavigation() {
    if (currentUser) {
        document.getElementById('profileLink').style.display = 'block';
        document.getElementById('logoutBtn').style.display = 'block';
    } else {
        document.getElementById('profileLink').style.display = 'none';
        document.getElementById('logoutBtn').style.display = 'none';
    }
}

// হ্যামবার্গার মেনু টগল করা
function toggleMenu() {
    const navMenu = document.getElementById('navMenu');
    navMenu.classList.toggle('active');
}

// ========== ভ্যালিডেশন ফাংশন ==========

// ইমেইল ভ্যালিডেশন
function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// ফোন নম্বর ভ্যালিডেশন (বাংলাদেশ)
function validatePhoneNumber(phone) {
    const phoneRegex = /^01[0-9]{9}$/;
    return phoneRegex.test(phone);
}

// ========== হেল্পার ফাংশন ==========

// ত্রুটি দেখান
function showError(elementId, message) {
    const element = document.getElementById(elementId);
    if (element) {
        element.textContent = message;
        element.style.color = '#ef4444';
    }
}

// সাফল্য দেখান
function showSuccess(elementId, message) {
    const element = document.getElementById(elementId);
    if (element) {
        element.textContent = message;
        element.className = 'form-message success';
    }
}

// মেসেজ সাফ করা
function clearMessages() {
    document.querySelectorAll('.error').forEach(el => el.textContent = '');
    document.querySelectorAll('.form-message').forEach(el => el.textContent = '');
}

// ক্যাটেগরি নাম পান
function getCategoryName(category) {
    const names = {
        'figures': 'ফিগার',
        'manga': 'ম্যাঙ্গা',
        'merchandise': 'মার্চেন্ডাইজ',
        'clothing': 'পোশাক'
    };
    return names[category] || category;
}

// ========== LocalStorage ফাংশন ==========

// LocalStorage এ সেভ করা
function saveToLocalStorage() {
    localStorage.setItem('currentUser', JSON.stringify(currentUser));
    localStorage.setItem('users', JSON.stringify(users));
    localStorage.setItem('anime-shop-cart', JSON.stringify(cart));
    localStorage.setItem('anime-shop-orders', JSON.stringify(orders));
}

// LocalStorage থেকে লোড করা
function loadFromLocalStorage() {
    const savedUser = localStorage.getItem('currentUser');
    const savedUsers = localStorage.getItem('users');
    const savedCart = localStorage.getItem('anime-shop-cart');
    const savedOrders = localStorage.getItem('anime-shop-orders');
    
    if (savedUser) currentUser = JSON.parse(savedUser);
    if (savedUsers) users = JSON.parse(savedUsers);
    if (savedCart) cart = JSON.parse(savedCart);
    if (savedOrders) orders = JSON.parse(savedOrders);
}

// অথ স্ট্যাটাস চেক করা
function checkAuthStatus() {
    if (currentUser) {
        document.getElementById('authSection').style.display = 'none';
        document.getElementById('homeSection').style.display = 'block';
    }
    updateNavigation();
}
