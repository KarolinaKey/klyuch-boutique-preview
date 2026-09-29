import {test} from 'node:test';
import assert from 'node:assert/strict';
import * as shop from './logic.js';
const products=[{id:'a',price:5040,collection:'author',name:'Нежность'},{id:'b',price:3100,collection:'bloom',name:'Свет'},{id:'c',price:null,collection:'baskets',name:'Корзина'}];
test('discard stale products, unpriced items, invalid quantities and client supplied prices',()=>{
 assert.equal(typeof shop.normalizeCart,'function');
 assert.deepEqual(shop.normalizeCart([{id:'a',quantity:2,price:1},{id:'a',quantity:1},{id:'b',quantity:-1},{id:'c',quantity:1},{id:'unknown',quantity:1}],products),[{id:'a',quantity:3}]);
 assert.deepEqual(shop.normalizeCart(null,products),[]);
 assert.deepEqual(shop.normalizeCart([{id:'a',quantity:1.2},{id:'a',quantity:'2'}],products),[]);
});
test('filter numeric prices only for budget, search names and preserve collection',()=>{
 assert.equal(typeof shop.selectProducts,'function');
 assert.deepEqual(shop.selectProducts(products,{budget:5000}).map(x=>x.id),['b']);
 assert.deepEqual(shop.selectProducts(products,{search:' нежН ',collection:'author'}).map(x=>x.id),['a']);
 assert.deepEqual(shop.selectProducts(products,{sort:'price-asc'}).map(x=>x.id),['b','a','c']);
});
test('calculate delivery from mode; empty basket never charges delivery',()=>{
 assert.equal(typeof shop.total,'function');
 assert.deepEqual(shop.total([{id:'a',quantity:2}],products,'pickup'),{subtotal:10080,delivery:0,total:10080,count:2});
 assert.equal(shop.total([{id:'b',quantity:1}],products,'local').total,3350);
 assert.equal(shop.total([{id:'b',quantity:1}],products,'moscow').total,3650);
 assert.equal(shop.total([],products,'moscow').total,0);
});
test('storage corruption or denial never crashes browsing',()=>{
 assert.equal(typeof shop.loadCart,'function');
 assert.deepEqual(shop.loadCart({getItem(){throw Error('denied')}},products),[]);
 assert.deepEqual(shop.loadCart({getItem(){return '{bad'}},products),[]);
 assert.equal(shop.saveCart({setItem(){throw Error('denied')}},[]),false);
});
test('phone allows formatted numbers but requires 10 to 15 actual digits',()=>{
 assert.equal(typeof shop.validPhone,'function');
 assert.equal(shop.validPhone('+7 (999) 123-45-67'),true);
 assert.equal(shop.validPhone('----------'),false);
 assert.equal(shop.validPhone('abc1234567890'),false);
 assert.equal(shop.validPhone('123'),false);
});
