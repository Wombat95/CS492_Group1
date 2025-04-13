let cart = [];
let currentPizza = {};

// === CUSTOMIZATION MODAL ===
function openCustomizeModal(name, basePrice) {
  currentPizza = { name, basePrice };
  document.getElementById('selected-pizza-name').value = name;
  document.getElementById('customize-modal').style.display = 'block';
}

function closeModal() {
  document.getElementById('customize-modal').style.display = 'none';
}

function submitCustomOrder(event) {
  event.preventDefault();

  const size = document.getElementById('size').value;
  const crust = document.getElementById('crust').value;
  const toppings = Array.from(
    document.querySelectorAll('input[type="checkbox"]:checked')
  ).map(el => el.value);

  const toppingCost = toppings.length * 1.0;
  const totalPrice = currentPizza.basePrice + toppingCost;

  const item = {
    name: `${currentPizza.name} (${size}, ${crust}, Toppings: ${toppings.join(', ') || 'None'})`,
    price: totalPrice,
  };

  cart.push(item);
  updateCartDisplay();
  closeModal();
}

// === CART MANAGEMENT ===
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
    li.innerHTML = `
      ${item.name} - $${item.price.toFixed(2)}
      <button onclick="removeFromCart(${index})">Remove</button>
    `;
    cartItemsEl.appendChild(li);
    total += item.price;
  });

  cartTotalEl.textContent = total.toFixed(2);
}

// === CHECKOUT MODAL ===
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

  const name = document.getElementById('name').value.trim();
  const card = document.getElementById('card').value.trim();

  const orderData = {
    customer: name,
    items: cart,
    total: cart.reduce((acc, item) => acc + item.price, 0),
    timestamp: new Date().toLocaleString()
  };

  const orders = JSON.parse(localStorage.getItem('orders')) || [];
  orders.push(orderData);
  localStorage.setItem('orders', JSON.stringify(orders));

  alert(`Thank you, ${name}! Your order has been placed.`);

  cart = [];
  updateCartDisplay();
  closeCheckoutModal();
  document.getElementById('checkout-form').reset();
}

// === MENU MANAGEMENT (Admin) ===
function loadMenuItems() {
  const menuItems = JSON.parse(localStorage.getItem('menuItems')) || [];
  const menuList = document.getElementById('menu-list');
  if (!menuList) return; // If this is not the admin page

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

// === ADD NEW MENU ITEM (Admin) ===
const menuForm = document.getElementById('menu-form');
if (menuForm) {
  menuForm.addEventListener('submit', function (e) {
    e.preventDefault();

    const name = document.getElementById('item-name').value.trim();
    const desc = document.getElementById('item-desc').value.trim();
    const price = parseFloat(document.getElementById('item-price').value);

    const newItem = { name, description: desc, price };

    const menuItems = JSON.parse(localStorage.getItem('menuItems')) || [];
    menuItems.push(newItem);
    localStorage.setItem('menuItems', JSON.stringify(menuItems));

    this.reset();
    loadMenuItems();
  });
}

// === SETUP EVENT LISTENERS ===
document.addEventListener('DOMContentLoaded', () => {
  const clearCartBtn = document.getElementById('clear-cart-btn');
  const checkoutBtn = document.getElementById('checkout-btn');

  if (clearCartBtn) clearCartBtn.addEventListener('click', clearCart);
  if (checkoutBtn) checkoutBtn.addEventListener('click', openCheckoutModal);

  loadMenuItems();
});
