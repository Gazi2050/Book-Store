import { useState, useEffect } from 'react';
import 'daisyui/dist/full.css';
function App() {
  const [books, setBooks] = useState([]);
  const [selectedBooks, setSelectedBooks] = useState([]);
  const [creditRemaining, setCreditRemaining] = useState(150);
  useEffect(() => {
    fetch('book.json')
      .then((response) => response.json())
      .then((data) => setBooks(data))
      .catch((error) => console.error('Error fetching data:', error));
  }, []);
  const handleSelectBook = (selectedBook) => {
    const bookPrice = parseFloat(selectedBook['Price'].replace('$', ''));
    if (selectedBooks.some((book) => book.id === selectedBook.id)) {
      const updatedSelectedBooks = selectedBooks.filter(
        (book) => book.id !== selectedBook.id
      );
      setSelectedBooks(updatedSelectedBooks);
      setCreditRemaining((prevCredit) =>
        parseFloat((prevCredit + bookPrice).toFixed(2))
      );
    } else if (creditRemaining - bookPrice >= 0 && selectedBooks.length < 21) {
      setSelectedBooks([...selectedBooks, selectedBook]);
      setCreditRemaining((prevCredit) =>
        parseFloat((prevCredit - bookPrice).toFixed(2))
      );
    } else {
      window.alert(
        'You do not have enough credit or have reached the book limit.'
      );
    }
  };
  return (
    <div>
      <h1 className='text-4xl text-black font-bold text-center mt-10'>
        <span className='text-emerald-600'>Book</span> <span className='text-orange-600'>Store!!!</span>
      </h1>
      <section className='p-5 w-full mx-auto grid lg:grid-cols-4 gap-4 lg:my-24 md:grid-cols-2 md:my-16 sm:grid-cols-1 sm:my-12 md:items-center'>
        <div className='lg:col-span-3 md:col-span-2 sm:col-span-1 grid lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1 gap-4'>
          {books.map((book) => (
            <div key={book.id}>
              <div className='rounded-md bg-white p-5 lg:col-span-1 md:col-span-1 sm:col-span-1'>
                <div className='flex justify-center'>
                  <img src={book['Book Cover']} alt='' />
                </div>
                <h2 className='text-xl font-semibold text-center mt-4'>
                  {book['Book Name']}
                </h2>
                <p className='text-justify text-sm mt-2 text-zinc-600'>
                  Author: {book['Author']}
                </p>
                <div className='text-base font-medium mt-2'>
                  <span>Price: {book['Price']}</span>
                </div>
                <div className='flex justify-center items-center'>
                  <button
                    className='btn w-full p-2 bg-blue-500 rounded-lg text-white hover:bg-blue-700'
                    onClick={() => handleSelectBook(book)}
                    disabled={selectedBooks.length >= 21}
                  >
                    {selectedBooks.some(
                      (selected) => selected.id === book.id
                    )
                      ? 'Deselect'
                      : 'Select'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className='bg-white rounded-md p-10 col-span-1 lg:mt-[-1000px]'>
          <p className='text-lg text-sky-600 font-bold'>
            Credit Remaining ${creditRemaining.toFixed(2)}
          </p>
          <hr />
          <p className='text-lg font-bold'>Book Name:</p>
          <ul>
            {selectedBooks.map((selectedBook, index) => (
              <li
                className='text-xl font-medium border border-indigo-400 rounded-md p-2 m-2 bg-slate-100'
                key={index}
              >
                {selectedBook['Book Name']}
              </li>
            ))}
          </ul>
          <p>Total Price: ${selectedBooks.reduce(
            (total, book) =>
              total + parseFloat(book['Price'].replace('$', '')),
            0
          ).toFixed(2)}</p>
        </div>
      </section>
    </div>
  );
}
export default App;