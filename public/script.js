async function search(){
    const q = document.getElementById('search').value;
    const res = await fetch(`/books?search=${q}`);
    const data = await res.json();
    const list = document.getElementById('books');
    list.innerHTML = '';
    data.forEach(b=>{
        list.innerHTML += `<li>${b.title} - ${b.author} (${b.category || 'Nėra kategorijos'})</li>`;
    });
}
