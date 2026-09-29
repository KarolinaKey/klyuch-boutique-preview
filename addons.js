// Demonstration data only. Replace with owner-approved inventory before launch.
export const addons=[
 {id:'demo-vase',name:'Ваза',price:1200,description:'Чтобы сразу поставить букет',art:'vase'},
 {id:'demo-wrap',name:'Подарочная упаковка',price:350,description:'Ещё один штрих к подарку',art:'wrap'},
 {id:'demo-gift',name:'Небольшой подарок',price:790,description:'Знак внимания к цветам',art:'gift'},
 {id:'demo-card',name:'Открытка',price:150,description:'Для ваших личных слов',art:'card'}
].map(p=>({...p,addon:true,collection:'extras',images:[`./addon-${p.art}.svg`],alt:`Иллюстрация: ${p.name}, тестовый пример`}));
