export const CART_KEY='klyuch-preview-cart-v1';
export function normalizeCart(value, products) {
 if(!Array.isArray(value)) return [];
 const valid=new Map(products.filter(p=>Number.isFinite(p.price)&&p.price>0).map(p=>[p.id,p]));
 const entries=new Map();
 for(const row of value) if(row && valid.has(row.id) && Number.isInteger(row.quantity) && row.quantity>0) entries.set(row.id,Math.min(valid.get(row.id).addon?1:99,(entries.get(row.id)||0)+row.quantity));
 if(![...entries.keys()].some(id=>!valid.get(id).addon))return [];
 return [...entries].map(([id,quantity])=>({id,quantity}));
}
export function selectProducts(products,{collection='all',budget='',search='',sort='curated'}={}) {
 let result=products.filter(p=>(collection==='all'||!collection||p.collection===collection)&&(!budget||(Number.isFinite(p.price)&&p.price<=Number(budget)))&&p.name.toLocaleLowerCase('ru').includes(search.trim().toLocaleLowerCase('ru')));
 if(sort==='price-asc'||sort==='price-desc') result.sort((a,b)=>a.price==null?1:b.price==null?-1:sort==='price-asc'?a.price-b.price:b.price-a.price);
 return result;
}
export function total(cart,products,mode='pickup') {
 const rows=normalizeCart(cart,products);const count=rows.reduce((s,r)=>s+r.quantity,0);
 const subtotal=rows.reduce((s,r)=>s+products.find(p=>p.id===r.id).price*r.quantity,0);
 const delivery=count?({local:250,moscow:550}[mode]||0):0;
 return {subtotal,delivery,total:subtotal+delivery,count};
}
export function loadCart(storage,products) {try{return normalizeCart(JSON.parse(storage.getItem(CART_KEY)),products);}catch{return [];}}
export function saveCart(storage,cart) {try{storage.setItem(CART_KEY,JSON.stringify(cart));return true;}catch{return false;}}

export function validPhone(value){return /^[+0-9 ()-]+$/.test(value)&&value.replace(/\D/g,'').length>=10&&value.replace(/\D/g,'').length<=15;}
