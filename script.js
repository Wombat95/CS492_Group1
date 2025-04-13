let cart = [];
let currentPizza = {};

// Open customization modal
function openCustomizeModal(name) {
  const menuItems = JSON.parse(localStorage.getItem('menuItems')) || [];
  const item = menuItems.find(i => i.name === name);

  if (!item) {
    alert("Item not found.");
    return;
  }

  currentPizza = item;
  document.getElementById('selected-pizza-name').value = item.name;
  document.getElementById('size').value = "Small"; // default
  document.getElementById('customize-modal').style.display = 'block';

  updatePriceDisplay();
}

//Update Price Display
function updatePriceDisplay() {
  const size = document.getElementById('size').value;
  const priceText = document.getElementById('dynamic-price');

  if (currentPizza.price && currentPizza.price[size]) {
    priceText.textContent = `Price: $${currentPizza.price[size].toFixed(2)}`;
  } else {
    priceText.textContent = '';
  }
}

// Close modal
function closeModal() {
  document.getElementById('customize-modal').style.display = 'none';
}

// Submit custom pizza to cart
function submitCustomOrder(event) {
  event.preventDefault();

  const size = document.getElementById('size').value;
  const crust = document.getElementById('crust').value;
  const toppings = Array.from(
    document.querySelectorAll('input[type="checkbox"]:checked')
  ).map(el => el.value);

  const basePrice = currentPizza.price[size];
  const toppingCost = toppings.length * 1.0;
  const totalPrice = basePrice + toppingCost;

  const item = {
    name: `${currentPizza.name} (${size}, ${crust}, Toppings: ${toppings.join(', ') || 'None'})`,
    price: totalPrice
  };

  cart.push(item);
  updateCartDisplay();
  closeModal();
}

function removeFromCart(index) {
  cart.splice(index, 1);
  updateCartDisplay();
}

function clearCart() {
  cart = [];
  updateCartDisplay();
}

function updateCartDisplay() {
  const cartItemsEl = document.getElementById('cart-items');
  const cartTotalEl = document.getElementById('cart-total');

  cartItemsEl.innerHTML = '';
  let total = 0;

  cart.forEach((item, index) => {
    const li = document.createElement('li');
    li.innerHTML = `${item.name} - $${item.price.toFixed(2)} 
      <button onclick="removeFromCart(${index})">Remove</button>`;
    cartItemsEl.appendChild(li);
    total += item.price;
  });

  cartTotalEl.textContent = total.toFixed(2);
}

function openCheckoutModal() {
  if (cart.length === 0) {
    alert("Your cart is empty!");
    return;
  }
  document.getElementById('checkout-modal').style.display = 'block';
}

function closeCheckoutModal() {
  document.getElementById('checkout-modal').style.display = 'none';
}

function submitOrder(event) {
  event.preventDefault();

  const name = document.getElementById('name').value;
  const card = document.getElementById('card').value;

  const orderData = {
    customer: name,
    items: cart,
    total: cart.reduce((acc, item) => acc + item.price, 0),
    timestamp: new Date().toLocaleString()
  };

  let orders = JSON.parse(localStorage.getItem('orders')) || [];
  orders.push(orderData);
  localStorage.setItem('orders', JSON.stringify(orders));

  alert(`Thank you, ${name}! Your order has been placed.`);

  cart = [];
  updateCartDisplay();
  closeCheckoutModal();
  document.getElementById('checkout-form').reset();
}

// Setup event listeners after DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('clear-cart-btn').addEventListener('click', clearCart);
  document.getElementById('checkout-btn').addEventListener('click', openCheckoutModal);
});
function loadMenuItems() {
  const menuItems = JSON.parse(localStorage.getItem('menuItems')) || [];
  const menuList = document.getElementById('menu-list');
  menuList.innerHTML = '';

  menuItems.forEach((item, index) => {
    const li = document.createElement('li');
    li.innerHTML = `
      <strong>${item.name}</strong> - $${item.price.toFixed(2)}<br>
      <em>${item.description}</em>
      <button onclick="removeMenuItem(${index})">Remove</button>
    `;
    menuList.appendChild(li);
  });
}

function removeMenuItem(index) {
  const menuItems = JSON.parse(localStorage.getItem('menuItems')) || [];
  menuItems.splice(index, 1);
  localStorage.setItem('menuItems', JSON.stringify(menuItems));
  loadMenuItems();
}

document.getElementById('menu-form').addEventListener('submit', function (e) {
  e.preventDefault();

  const name = document.getElementById('item-name')?.value;
  const description = document.getElementById('item-desc')?.value;
  const category = document.getElementById('item-category')?.value;

  const priceSmall = parseFloat(document.getElementById('price-small')?.value);
  const priceMedium = parseFloat(document.getElementById('price-medium')?.value);
  const priceLarge = parseFloat(document.getElementById('price-large')?.value);

  // Guard clause if any value is missing or invalid
  if (!name || !description || !category || isNaN(priceSmall) || isNaN(priceMedium) || isNaN(priceLarge)) {
    alert("Please fill out all fields with valid values.");
    return;
  }

  const price = {
    Small: priceSmall,
    Medium: priceMedium,
    Large: priceLarge
  };

  const newItem = { name, description, price, category };

  const menuItems = JSON.parse(localStorage.getItem('menuItems')) || [];
  menuItems.push(newItem);
  localStorage.setItem('menuItems', JSON.stringify(menuItems));

  this.reset();
  loadMenuItems();
});

});

loadMenuItems();
