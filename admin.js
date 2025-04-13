document.addEventListener('DOMContentLoaded', () => {
  const menuForm = document.getElementById('menu-form');
  const menuList = document.getElementById('menu-list');

  menuForm.addEventListener('submit', function (e) {
    e.preventDefault();

    const name = document.getElementById('item-name').value;
    const description = document.getElementById('item-desc').value;
    const category = document.getElementById('item-category').value;

    const price = {
      Small: parseFloat(document.getElementById('price-small').value),
      Medium: parseFloat(document.getElementById('price-medium').value),
      Large: parseFloat(document.getElementById('price-large').value)
    };

    const newItem = { name, description, price, category };

    const menuItems = JSON.parse(localStorage.getItem('menuItems')) || [];
    menuItems.push(newItem);
    localStorage.setItem('menuItems', JSON.stringify(menuItems));

    this.reset();
    loadMenuItems();
  });

  function loadMenuItems() {
    const menuItems = JSON.parse(localStorage.getItem('menuItems')) || [];
    menuList.innerHTML = '';

    if (menuItems.length === 0) {
      menuList.innerHTML = '<li>No items yet.</li>';
      return;
    }

    menuItems.forEach((item, index) => {
      const li = document.createElement('li');
      li.innerHTML = `
        <strong>${item.name}</strong> (${item.category})<br>
        <em>${item.description}</em><br>
        Small: $${item.price.Small.toFixed(2)} | 
        Medium: $${item.price.Medium.toFixed(2)} | 
        Large: $${item.price.Large.toFixed(2)}<br>
        <button onclick="removeMenuItem(${index})">Remove</button>
      `;
      menuList.appendChild(li);
    });
  }

  window.removeMenuItem = function(index) {
    const menuItems = JSON.parse(localStorage.getItem('menuItems')) || [];
    menuItems.splice(index, 1);
    localStorage.setItem('menuItems', JSON.stringify(menuItems));
    loadMenuItems();
  }

  loadMenuItems();
});
