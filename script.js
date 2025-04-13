let cart = [];
let currentPizza = {};

function renderMenu() {
  const container = document.getElementById('menu-items-container');
  const menuItems = JSON.parse(localStorage.getItem('menuItems')) || [];

  container.innerHTML = '';

  if (menuItems.length === 0) {
    container.innerHTML = '<p>No menu items available.</p>';
    return;
  }

  const pizzaSection = document.createElement('div');
  pizzaSection.innerHTML = '<h3>Pizza</h3>';

  const pastaSection = document.createElement('div');
  pastaSection.innerHTML = '<h3>Pasta</h3>';

  menuItems.forEach(item => {
    const div = document.createElement('div');
    div.className = 'menu-item';
    div.innerHTML = `
      <h4>${item.name}</h4>
      <p>${item.description}</p>
      <button onclick="openCustomizeModal('${item.name}')">Order</button>
    `;

    if (item.category === 'Pizza') pizzaSection.appendChild(div);
    else if (item.category === 'Pasta') pastaSection.appendChild(div);
  });

  container.appendChild(pizzaSection);
  container.appendChild(pastaSection);
}

function openCustomizeModal(name) {
  const menuItems = JSON.parse(localStorage.getItem('menuItems')) || [];
  const item = menuItems.find(i => i.name === name);
  if (!item) return alert("Item not found.");

  currentPizza = item;
  document.getElementById('selected-pizza-name').value = item.name;
  document.getElementById('size').value = 'Small';
  document.getElementById('customize-modal').style.display = 'block';

  updatePriceDisplay();
}

function updatePriceDisplay() {
  const size = document.getElementById('size').value;
  const priceText = document.getElementById('dynamic-price');
  if (currentPizza.price && currentPizza.price[size]) {
    priceText.textContent = `Price: $${currentPizza.price[size].toFixed(2)}`;
  } else {
    priceText.textContent = '';
  }
}

function closeModal() {
  document.getElementById('customize-modal').style.display = 'none';
}

function submitCustomOrder(event) {
  event.preventDefault();
  const size = document.getElementById('size').value;
  const crust = document.getElementById('crust').value;
  const toppings = Array.from(document.querySelectorAll('input[type="checkbox"]:checked')).map(el => el.value);

  const basePrice = currentPizza.price[size];
  const toppingCost = toppings.length * 1.0;
  const totalPrice = basePrice + toppingCost;

  const item = {
    name: `${currentPizza.name} (${size}, ${crust}, Toppings: ${toppings.join(', ') || 'None'})`,
    price: totalPrice
  };

  cart.push(item);
  alert(`${item.name} added to cart for $${totalPrice.toFixed(2)}`);
  closeModal();
}

document.addEventListener('DOMContentLoaded', renderMenu);
