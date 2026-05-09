const dessertWrapper = document.querySelector('.desserts-wrapper')!;
const noOfCartItems = document.querySelector('.no-of-items-in-cart')!;
const cartItems = document.querySelector('.cart-items')!;
const totalPrice = document.querySelector('.total-order-amount')!;
const noItem = document.querySelector('.no-item')!;
const cartFooter = document.querySelector('.cart-display-footer')!;
const decreaseBtn = document.querySelectorAll('.decrease-btn')!;
const increaseBtn = document.querySelectorAll('.increase-btn')!;
const shade = document.querySelector('.cover')! as HTMLElement;
const cancelBtns = document.querySelectorAll('.cancel')!;
const confirmBtn = document.querySelector('.confirm-btn')!;
const orderConfirmationSection = document.querySelector('.order-confirmation-section')! as HTMLElement;
const newOrderBtn = document.querySelector('.new-order-btn')!;
const orderTotal = document.querySelector('.total-order-amount-2')!;

interface ProductImage {
    mobile: string
    tablet: string
    desktop: string
    thumbnail: string
}

interface Product {
    name: string
    category: string
    price: number
    image: ProductImage
    quantity: number
}

interface CartItem {
    name: string
    price: number
    image: string
    quantity: number
}




let cart: CartItem[] = []

fetchProducts()

ifInCart()



async function fetchProducts(): Promise<void> {
    try {
        const response = await fetch("./data.json")
        const datas = await response.json()
        const products = datas.map((product: Product) => ({...product, quantity: 1}))
        renderProducts(products)
        getFromLocalStorage()
    } catch (error) {
        console.error('Error fetching products:', error)
    }
}



function saveToLocalStorage(): void {
    localStorage.setItem('cart', JSON.stringify(cart))
}

function getFromLocalStorage() {
    let savedData = localStorage.getItem('cart')
    if (savedData) {
        cart = JSON.parse(savedData)
        updateCart()

     cart.forEach(item => {
        let addToCartBtn = document.querySelector(`.add-to-cart[data-name='${item.name}']`) as HTMLButtonElement;
        let quantityComponent = document.querySelector(`.quantity[data-name='${item.name}']`) as HTMLDivElement;
        let cartComponent = addToCartBtn.parentElement!;
        let cardImg = cartComponent.parentElement!; //I changed something here

       
            addToCartBtn.style.display = 'none';
            quantityComponent.style.display = 'flex';
            cartComponent.style.border = '0px';
            cardImg.style.border = '2px solid var(--red)';
       
        let qtyNumber = document.querySelector(`.quantity-number[data-name='${item.name}']`) as HTMLParagraphElement;
        if (qtyNumber) {
            qtyNumber.textContent = String(item.quantity);
        }
     })
    }
}



function renderProducts(products: Product[]) {
    products.forEach((dessert, index) => {
        const screenWidth = window.innerWidth;
        let imageUrl = "";

        if (screenWidth <= 650) {
            imageUrl = dessert.image.mobile;
        } else if (screenWidth > 650 && screenWidth < 1000) {
            imageUrl = dessert.image.tablet;
        } else if (screenWidth >= 1000) {
            imageUrl = dessert.image.desktop;
        }
        
        
// the dessert.image did not display in the order container until i added .thumbnail
        const dessertHTML = `
            <div class="dessert-card">
                <div class="dessert-image" style="background-image: url('${imageUrl}')">
                    <div class="cart-component">
                        <div class="add-to-cart" onclick="addToCart('${dessert.name}', '${dessert.price.toFixed(2)}', '${dessert.quantity}', '${dessert.image.thumbnail}')" data-name="${dessert.name}">
                                <img src="assets/images/icon-add-to-cart.svg" alt="Add to cart icon" class="cart-icon">
                            <p>Add to Cart</p>
                        </div>
                        <div class="quantity" data-name="${dessert.name}">
                            <div class="decrease-btn" data-name="${dessert.name}" onclick="decrement('${dessert.name}')">
                                <svg xmlns="http://www.w3.org/2000/svg" width="10" height="2" fill="none" viewBox="0 0 10 2"><path fill="#fff" d="M0 .375h10v1.25H0V.375Z"/></svg>
                            </div>
                            <p class="quantity-number" data-name="${dessert.name}">${dessert.quantity}</p>
                            <div class="increase-btn" data-name="${dessert.name}" onclick="increment('${dessert.name}')">
                               <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" fill="none" viewBox="0 0 10 10"><path fill="#fff" d="M10 4.375H5.625V0h-1.25v4.375H0v1.25h4.375V10h1.25V5.625H10v-1.25Z"/></svg>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="dessert-card-text">
                    <p class="dessert-name">${dessert.category}</p>
                    <p class="dessert-description">${dessert.name}</p>
                    <p class="dessert-price">$${dessert.price.toFixed(2)}</p>
                </div>
            </div>
        `;

        dessertWrapper.insertAdjacentHTML('beforeend', dessertHTML);
        
});

}

function addToCart(name: string, price: string, quantity: string, image: string): void {
    let addToCartBtn = document.querySelector(`.add-to-cart[data-name='${name}']`)! as HTMLElement
    let quantityOfItem  = document.querySelector(`.quantity[data-name='${name}']`)! as HTMLElement
    let cartComponent = document.querySelector(`.add-to-cart[data-name='${name}']`)!.parentElement!
    let cardImg = document.querySelector(`.add-to-cart[data-name='${name}']`)!.parentElement!.parentElement!
    const parsedPrice = parseFloat(price)
    let parsedQuantity = parseInt(quantity)
    
    let isItemPresent = cart.some(item => item.name === name)
    if (isItemPresent) {
        return;
    } else {
        cart.push({name, price: parsedPrice, quantity: parsedQuantity, image})
    }

    addToCartBtn.style.display = 'none'
    quantityOfItem.style.display = 'flex'
    cartComponent.style.border = '0px'
    cardImg.style.border = '2px solid var(--red)'
    
    updateCart()
    saveToLocalStorage()
}

function updateCart() {
    cartItems.innerHTML = ""
    cart.forEach(item => {
        let cartItemContents = `<div class="cart-item-info">
                        <p class="cart-item-name">${item.name}</p>
                        <div class="cart-item-description">
                            <p class="number-of-item">${item.quantity}×</p>
                            <p class="cart-item-price">@ $${item.price}</p>
                            <p class="cart-item-total-price">$${(item.price * item.quantity).toFixed(2)}</p>
                        </div>
                    </div>
                    <div class="cancel" onclick="removeFromCart('${item.name}')">
                        <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" fill="none" viewBox="0 0 10 10"><path fill="#CAAFA7" d="M8.375 9.375 5 6 1.625 9.375l-1-1L4 5 .625 1.625l1-1L5 4 8.375.625l1 1L6 5l3.375 3.375-1 1Z"/></svg>
                    </div>`
    let cartItem = document.createElement('li')
    cartItem.classList.add('cart-item')
    cartItem.innerHTML = cartItemContents
    cartItems.appendChild(cartItem)
    saveToLocalStorage()
    })
    noOfItemInCart()
if (cart.length === 0) {
    noOfCartItems.textContent = String(0)
} 
ifInCart()
updateCartTotal()

}

function updateOrder() {
    let ordersContainer = document.querySelector('.desserts-ordered')!
    ordersContainer.innerHTML= ''
    cart.forEach(item => {
        let orderItemContents = `<div class="order-info">
                     <div class="order-img" style="background-image: url('${item.image}')"></div>
                     <div class="order-text">
                         <p class="order-name">${item.name}</p>
                     
                     <div class="order-description">
                         <p class="order-amount">${item.quantity}x</p>
                         <p class="order-price">@$${item.price}</p>
                     </div>
                     </div>
                 </div>
                 <p class="order-total">$${(item.price * item.quantity).toFixed(2)}</p>`
    let orderItem = document.createElement('li')
    orderItem.classList.add('order')
    orderItem.innerHTML = orderItemContents
    ordersContainer.appendChild(orderItem)
    })
    
updateOrderTotal()
}

function updateOrderTotal() {
    let total = cart.reduce((acc, item) => {
    return acc + item.price * item.quantity      
    }, 0)
    orderTotal.textContent = '$' + total.toFixed(2)
}

function noOfItemInCart() {
    let total = cart.reduce((acc, item) => {
        return acc + Number(item.quantity)    
        }, 0)
        noOfCartItems.textContent = String(total)
}

function updateCartTotal() {
    let total = cart.reduce((acc, item) => {
    return acc + item.price * item.quantity      
    }, 0)
    totalPrice.textContent = '$' + total.toFixed(2)
}

function removeFromCart(name: string): void {
    let itemToBeRemoved = cart.findIndex(item => item.name === name)
    cart.splice(itemToBeRemoved, 1)
    updateCart()
    let addToCartBtn = document.querySelector(`.add-to-cart[data-name='${name}']`)! as HTMLElement
    let quantityOfItem  = document.querySelector(`.quantity[data-name='${name}']`)! as HTMLElement
    let cartComponent = document.querySelector(`.add-to-cart[data-name='${name}']`)!.parentElement! as HTMLElement
    let card = document.querySelector(`.add-to-cart[data-name='${name}']`)!.parentElement!.parentElement! as HTMLElement
    addToCartBtn.style.display = 'flex'
    quantityOfItem.style.display = 'none'
    cartComponent.style.border = '1.5px'
    card.style.border = '0px'
    saveToLocalStorage()
}

function ifInCart() {
    if (cart.length === 0) {
        noItem.classList.remove('hidden');
        cartFooter.classList.add('hidden');
        cartItems.classList.add('hidden');
    } else {
        noItem.classList.add('hidden');
        cartFooter.classList.remove('hidden');
        cartItems.classList.remove('hidden');
    }
}

function increment(name: string) : void {
    let qtyNumber = document.querySelector(`.quantity-number[data-name='${name}']`) as HTMLParagraphElement
    let item = cart.find(item => item.name === name)

    if (!item) return

    item.quantity = Number(item.quantity) + 1
    qtyNumber.textContent = String(item.quantity)
    updateCart()
    saveToLocalStorage()
}
function decrement(name: string): void {
    let qtyNumber = document.querySelector(`.quantity-number[data-name='${name}']`) as HTMLParagraphElement
    let item = cart.find(item => item.name === name)

    if (!item) return
    
    if (item.quantity > 1) {
        item.quantity -= 1
        qtyNumber.textContent = String(item.quantity)
    updateCart()
    } else {
        removeFromCart(name)
    }
    saveToLocalStorage()
}

confirmBtn.addEventListener('click', function() {
    orderConfirmationSection.style.display = 'block'
    shade.style.display = 'block'
    updateOrder()
})

newOrderBtn.addEventListener('click', function() {
    while (cart.length > 0) {
        cart.pop()
    }
    updateCart()
    orderConfirmationSection.style.display = 'none'
    shade.style.display = 'none'
    let addToCartBtns = document.querySelectorAll<HTMLElement>('.add-to-cart')
    let quantityOfItems  = document.querySelectorAll<HTMLElement>('.quantity')
    let qtyNumber = document.querySelectorAll<HTMLElement>('.quantity-number');
    addToCartBtns.forEach(btn => {
    btn.style.display = 'flex'
    btn.parentElement?.style.setProperty('border', '1.5px solid var(--rose-300)')
    btn.parentElement?.parentElement?.style.setProperty('border', '0px') 
       
    })
    quantityOfItems.forEach(qty => {
        qty.style.display = 'none' 
        })

   qtyNumber.forEach(num => {
    num.textContent = '1'
    
   })
   
    
})
