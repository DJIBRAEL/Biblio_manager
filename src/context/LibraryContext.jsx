import { createContext, useContext, useState, useEffect, useMemo } from 'react';

const LibraryContext = createContext();

export const useLibrary = () => useContext(LibraryContext);

export const LibraryProvider = ({ children }) => {
  // Initial Data Mock
  const [books, setBooks] = useState(() => {
    try {
      const saved = localStorage.getItem('biblio_books');
      return saved ? JSON.parse(saved) : [
        { id: '1', isbn: '978-2-07-036002-4', title: 'L\'Étranger', author: 'Albert Camus', publisher: 'Gallimard', year: 1942, category: 'Roman', words: 'Absurde' },
        { id: '2', isbn: '978-2-02-047989-5', title: '1984', author: 'George Orwell', publisher: 'Seuil', year: 1949, category: 'Science Fiction', words: 'Dystopie' },
      ];
    } catch (e) {
      console.error("Error parsing books from localStorage", e);
      return [];
    }
  });

  const [users, setUsers] = useState(() => {
    try {
      const saved = localStorage.getItem('biblio_users');
      return saved ? JSON.parse(saved) : [
        { id: '1', name: 'Alice Dupont', email: 'alice@univ.edu', type: 'Etudiant', matricule: 'ET-2023-001', phone: '+221 77 123 45 67', address: 'Dakar, Plateau', joinDate: '2023-11-15' },
        { id: '2', name: 'Prof. Martin', email: 'martin@univ.edu', type: 'Professeur', matricule: 'PR-2022-042', phone: '+221 78 987 65 43', address: 'Saint-Louis, Ndiolofène', joinDate: '2022-09-01' },
      ];
    } catch (e) {
      console.error("Error parsing users from localStorage", e);
      return [];
    }
  });

  const [copies, setCopies] = useState(() => {
    try {
      const saved = localStorage.getItem('biblio_copies');
      return saved ? JSON.parse(saved) : [
        { id: '101', bookId: '1', code: 'CAM-001', etat: 'Neuf', localization: 'Rayon A1', status: 'Disponible', acquisitionYear: 2023 },
        { id: '102', bookId: '2', code: 'ORW-001', etat: 'Bon', localization: 'Rayon B2', status: 'Disponible', acquisitionYear: 2023 },
      ];
    } catch (e) {
      console.error("Error parsing copies from localStorage", e);
      return [];
    }
  });

  const [borrowings, setBorrowings] = useState(() => {
    try {
      const saved = localStorage.getItem('biblio_borrowings');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      console.error("Error parsing borrowings from localStorage", e);
      return [];
    }
  });

  const [reservations, setReservations] = useState(() => {
    try {
      const saved = localStorage.getItem('biblio_reservations');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      console.error("Error parsing reservations from localStorage", e);
      return [];
    }
  });

  // Save to LocalStorage on change
  useEffect(() => {
    localStorage.setItem('biblio_books', JSON.stringify(books));
  }, [books]);

  useEffect(() => {
    localStorage.setItem('biblio_users', JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    localStorage.setItem('biblio_copies', JSON.stringify(copies));
  }, [copies]);

  useEffect(() => {
    localStorage.setItem('biblio_borrowings', JSON.stringify(borrowings));
  }, [borrowings]);

  useEffect(() => {
    localStorage.setItem('biblio_reservations', JSON.stringify(reservations));
  }, [reservations]);

  // Book Actions
  const addBook = (book) => setBooks([...books, { ...book, id: Date.now().toString() }]);
  const updateBook = (id, updatedPart) => setBooks(books.map(b => b.id === id ? { ...b, ...updatedPart } : b));
  const deleteBook = (id) => {
    setBooks(books.filter(b => b.id !== id));
    setCopies(copies.filter(c => c.bookId !== id)); // Cleanup copies
  };

  // Copy (Exemplaire) Actions
  const addCopy = (copy) => setCopies(prev => [...prev, { ...copy, id: (Date.now() + Math.random()).toString() }]);
  const updateCopy = (id, updatedPart) => setCopies(copies.map(c => c.id === id ? { ...c, ...updatedPart } : c));
  const deleteCopy = (id) => setCopies(copies.filter(c => c.id !== id));

  // User Actions
  const addUser = (user) => setUsers([...users, { ...user, id: Date.now().toString() }]);
  const deleteUser = (id) => setUsers(users.filter(u => u.id !== id));

  // Borrowing Actions
  const borrowBook = (borrowing) => setBorrowings([...borrowings, { ...borrowing, id: Date.now().toString(), returnDate: null }]);
  const returnBook = (id) => setBorrowings(borrowings.map(b => b.id === id ? { ...b, returnDate: new Date().toISOString().split('T')[0] } : b));
  const deleteBorrowing = (id) => setBorrowings(borrowings.filter(b => b.id !== id));

  // Reservation Actions
  const addReservation = (reservation) => setReservations([...reservations, { ...reservation, id: Date.now().toString(), status: 'En attente' }]);
  const updateReservation = (id, newStatus) => setReservations(reservations.map(r => r.id === id ? { ...r, status: newStatus } : r));
  const deleteReservation = (id) => setReservations(reservations.filter(r => r.id !== id));

  // Derived state useful for stats
  const totalBooks = books.length;
  const totalCopies = copies.length;
  const activeBorrowings = borrowings.filter(b => !b.returnDate);
  const totalBorrowed = activeBorrowings.length;
  const totalAvailable = totalCopies - totalBorrowed;

  const value = useMemo(() => ({
    books, addBook, updateBook, deleteBook,
    copies, addCopy, updateCopy, deleteCopy,
    users, addUser, deleteUser,
    borrowings, borrowBook, returnBook, deleteBorrowing,
    reservations, addReservation, updateReservation, deleteReservation,
    stats: {
      totalBooks,
      totalCopies,
      totalBorrowed,
      totalAvailable,
      activeBorrowingsCount: activeBorrowings.length,
      activeReservationsCount: reservations.filter(r => r.status === 'En attente').length
    }
  }), [books, copies, users, borrowings, reservations, totalBooks, totalCopies, totalBorrowed, totalAvailable, activeBorrowings.length]);

  return (
    <LibraryContext.Provider value={value}>
      {children}
    </LibraryContext.Provider>
  );
};
