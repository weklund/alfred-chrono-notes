import alfy from 'alfy';
// ts-ignore
const data = await alfy.fetch('https://jsonplaceholder.typicode.com/posts');
alfy.log("this is a log message");
const items = [
    { title: 'banlk' },
    { title: '2' },
    { title: 'banlk123' },
    { title: 'ban22lk' },
];
// alfy.output(items);
