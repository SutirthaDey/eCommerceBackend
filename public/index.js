// backend is called from e-commerce server

const cart_items = document.querySelector('#cart .cart-items');
const musicContent = document.getElementById('music-content');
const merchContent = document.getElementById('merch-content');
const productPages = document.getElementById('pagination');
const cartPages = document.getElementById('cart-pagination');
const parentContainer = document.getElementById('EcommerceContainer');

/*  for products and cart pages  */

function createCartItem(name,img_src,price,prodId){
    const id = name.split(' ')[0]+prodId;
    if (document.querySelector(`#in-cart-${id}`)){
        alert('This item is already added to the cart');
        return
    }

    let total_cart_price = document.querySelector('#total-value').innerText;
    document.querySelector('.cart-number').innerText = parseInt(document.querySelector('.cart-number').innerText)+1
    const cart_item = document.createElement('div');
    cart_item.classList.add('cart-row');
    total_cart_price = parseFloat(total_cart_price) + parseFloat(price)
    total_cart_price = total_cart_price.toFixed(2)
    document.querySelector('#total-value').innerText = `${total_cart_price}`;
    cart_item.setAttribute('id',`in-cart-${id}`);
    cart_item.innerHTML = `
    <span class='cart-item cart-column'>
    <img class='cart-img' src="${img_src}" alt="">
        <span>${name}</span>
    </span>
    <span class='cart-price cart-column'>${price}</span>
    <span class='cart-quantity cart-column'>
        <input type="text" value="1">
        <button>REMOVE</button>
    </span>`
    const productId = document.createElement('input');
    productId.setAttribute('type','hidden');
    productId.value = prodId;
    cart_item.appendChild(productId);
    cart_items.appendChild(cart_item)
}

function showCartItems(items){
    cart_items.innerHTML = '';
    cartPages.innerHTML = '';

    items.forEach(({title,imageUrl,price,id})=>{
        createCartItem(title,imageUrl,price,id);
    })
}

function showProducts(products){
musicContent.innerHTML = '';
merchContent.innerHTML = '';
productPages.innerHTML = '';

products.forEach((product)=>{
    const {id,title,price,imageUrl} = product;

    //prodId created for each div
    const prodId = title.split(' ')[0]+id;
    
    const div = document.createElement('div');
    div.setAttribute('id', prodId);

    const h3 = document.createElement('h3');
    h3.append(document.createTextNode(`${title}`));
    div.appendChild(h3);

    const imageContainer = document.createElement('div');
    imageContainer.classList.add('image-container');
    const prodImg = document.createElement('img');
    prodImg.src = imageUrl;
    prodImg.classList.add('prod-images');
    imageContainer.appendChild(prodImg);
    div.appendChild(imageContainer);

    const prodDetails = document.createElement('div');
    prodDetails.classList.add('prod-details');
    const span = document.createElement('span');
    span.innerHTML = `$<span>${price}</span>`;
    const addCart = document.createElement('button');
    addCart.innerText = 'ADD TO CART';
    addCart.classList.add("shop-item-button")
    prodDetails.appendChild(span);
    prodDetails.appendChild(addCart);
    div.appendChild(prodDetails);
    const productId = document.createElement('input');
    productId.setAttribute('type','hidden');
    productId.value = id;
    div.appendChild(productId);

    if(title.split(' ')[0]==='Merch')
     merchContent.appendChild(div);
    else
     musicContent.appendChild(div);
})
}

function getProducts(currentPage){
    axios.get(`http://ec2-54-245-195-107.us-west-2.compute.amazonaws.com:3000/products?page=${currentPage}`)
    .then((res)=>{
        const {totalItems,hasNextPage,lastPage} = res.data;
        showProducts(res.data.products);
        const pages = document.getElementById('pagination');
        createPageButtons(pages,totalItems,currentPage,hasNextPage,lastPage);
    });
}

function getCart(currentCart){
    axios.get(`http://ec2-54-245-195-107.us-west-2.compute.amazonaws.com:3000/cart?cart=${currentCart}`)
    .then((res)=>{
        const {totalCartItems,hasNextCart,lastCart} = res.data;
        document.querySelector('#total-value').innerText = '0';
        showCartItems(res.data.products);
        const pages = document.getElementById('cart-pagination');
        document.querySelector('.cart-number').innerText = totalCartItems;
        createPageButtons(pages,totalCartItems,currentCart,hasNextCart,lastCart);
    });
}

// Added pagination for products
function createPageButtons(pages,totalItems,currentPage,hasNextPage,lastPage){
  const firstPageButton = document.createElement('button');
  firstPageButton.setAttribute('type','button');
  const currentPageButton = document.createElement('button');
  currentPageButton.setAttribute('type','button');
  const lastPageButton = document.createElement('button');
  lastPageButton.setAttribute('type','button');

  firstPageButton.innerText = '1';
  lastPageButton.innerText = `${lastPage}`;
  currentPageButton.innerText = `${currentPage}`;
  firstPageButton.classList.add('page-button');
  lastPageButton.classList.add('page-button');
  currentPageButton.classList.add('page-button');
  currentPageButton.classList.add('active');

  if(currentPage === 1){
  firstPageButton.classList.add('active');
  }

  pages.appendChild(firstPageButton);

  if(totalItems<=1) return;

  if(currentPage > 2)
  {
    const previousPageButton = document.createElement('button');
    previousPageButton.setAttribute('type','button');
    previousPageButton.innerText = currentPage - 1;
    previousPageButton.classList.add('page-button');
    pages.appendChild(previousPageButton);
  }

  if(currentPage!=1 && currentPage!=lastPage){
    pages.appendChild(currentPageButton);
  }

  if(hasNextPage && currentPage+1 != lastPage){
    const nextPageButton = document.createElement('button');
    nextPageButton.setAttribute('type','button');
    nextPageButton.innerText = currentPage + 1;
    nextPageButton.classList.add('page-button');
    pages.appendChild(nextPageButton);
  }
  
  if(currentPage == lastPage){
  lastPageButton.classList.add('active');
  }

  if(lastPage !== 1){
  lastPageButton.setAttribute('type','button');
  pages.appendChild(lastPageButton);
  }

}

function setQueryParams(e,query){

    if(e.target.className === 'page-button'){
        const target = +e.target.innerText;

        if (history.pushState) {
            let newUrl;
            if(query === 'page'){
                newUrl = window.location.protocol + "//" + window.location.host + window.location.pathname + `?${query}=${target}`;
                getProducts(target);
            }
            else{
                newUrl = window.location.protocol + "//" + window.location.host + window.location.pathname + `?${query}=${target}`; 
                getCart(target);
            }
            window.history.pushState({path:newUrl},'',newUrl);
        }
    }
}

function showToastNotification(message){
    const container = document.getElementById('container');
    const notification = document.createElement('div');
    notification.classList.add('notification');
    notification.innerHTML = message;
    container.appendChild(notification);
    setTimeout(()=>{
    notification.remove();
    },2500)
}

function parentContainerHelper(e){

    if (e.target.className=='shop-item-button'){
        const id = e.target.parentNode.parentNode.id;
        const name = document.querySelector(`#${id} h3`).innerText;
        const img_src = document.querySelector(`#${id} img`).src;
        const price = e.target.parentNode.firstElementChild.firstElementChild.innerText;
        if (document.querySelector(`#in-cart-${id}`)){
            alert('This item is already added to the cart');
            return
        }
        const prodId = document.querySelector(`#${id} input`).value;

        axios.post('http://ec2-54-245-195-107.us-west-2.compute.amazonaws.com:3000/cart',{prodId:prodId})
        .then((res)=> getCart(1));

        showToastNotification(`<h4>Your Product : <span>${name}</span> is added to the cart<h4>`);
    }
    if (e.target.className=='cart-btn-bottom' || e.target.className=='cart-bottom' || e.target.className=='cart-holder'){
        document.querySelector('#cart').style = "display:block;"
    }
    if (e.target.className=='cancel'){
        document.querySelector('#cart').style = "display:none;"
    }
    if (e.target.className=='purchase-btn'){
        if (parseInt(document.querySelector('.cart-number').innerText) === 0){
            alert('You have Nothing in Cart , Add some products to purchase !');
            return
        }

        axios.post('http://ec2-54-245-195-107.us-west-2.compute.amazonaws.com:3000/orders')
        .then((order)=>{
            const orderId = order.data;

            cart_items.innerHTML = ""
            document.querySelector('.cart-number').innerText = 0
            document.querySelector('#total-value').innerText = `0`;
            console.log(orderId);
            showToastNotification(`<h4>Your Order is Placed. : Order-id is :<span>${orderId}</span> <h4>`)
        })
    }

    if (e.target.innerText=='REMOVE'){
        const id = e.target.parentNode.parentNode.id;
        const prodId = document.querySelectorAll(`#${id} input`)[1].value;

        axios.post('http://ec2-54-245-195-107.us-west-2.compute.amazonaws.com:3000/cart-delete-item',{prodId:prodId})
        .then(()=>{
            getCart(1);
        })
        .catch((err)=>console.log(err));
    }
}


/* for orders page */

function createOrderItems({id,products}){
 const orderDiv = document.getElementById('orders');
 
 products.forEach(({title,imageUrl,price})=> {
    const orderRow = document.createElement('div');
    orderRow.classList.add('order-row');

    orderRow.innerHTML = `<span class='order-item order-column'>
    <img class='order-img' src="${imageUrl}" alt="">
    <span>${title}</span>
    </span>
    <span class='order-price order-column'>$${price}</span>
    <span class='order-id order-column'>
    <span>${id}</span>
    </span>`
 
    orderDiv.appendChild(orderRow);
 })
}

function showOrders(orders){
    orders.forEach((order)=>{
        createOrderItems(order);
    })
}

function getOrders(){
    axios.get('http://ec2-54-245-195-107.us-west-2.compute.amazonaws.com:3000/orders')
    .then((orders)=>{
        showOrders(orders.data);
    })
}


window.addEventListener('DOMContentLoaded',(e)=>{
    let params = (new URL(document.location)).searchParams;
    let currentPage = +params.get("page") || 1;
    let currentCart = +params.get("cart") || 1;

    const href = window.location.href.split('/');
    const endPoint = href[href.length-1];
    getCart(currentCart);

    if(endPoint.startsWith('dynamicstore.html',0)){
        getProducts(currentPage);

        productPages.addEventListener('click',(e)=> setQueryParams(e,'page'));
        cartPages.addEventListener('click',(e)=> setQueryParams(e,'cart'));
        parentContainer.addEventListener('click', parentContainerHelper)
    }
    else if(endPoint.startsWith('orders.html',0)){
        getOrders();
    }
});


