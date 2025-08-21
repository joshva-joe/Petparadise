import { useState } from 'react';
import { IoNotificationsOutline } from "react-icons/io5";
import { IoSearchOutline } from "react-icons/io5";
import { MdCancel, MdPets } from "react-icons/md";
import { FaHeart, FaPaw } from "react-icons/fa";
import { jsPDF } from 'jspdf';
import { FaFacebook,FaInstagram, FaWhatsapp } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import "./app.css"

//Cards component 
const Cards = ({ addItems, price, name, imgs }) => {
  return (
    <div className="card" >
      <div className="card-image">
        <img src={imgs} alt={name} />
        <div className="card-overlay">
          <FaHeart className="favorite-icon" />
        </div>
      </div>
      <div className="card-content">
        <h3 className="pet-name">{name}</h3>
        <p className="pet-price">₹{price}</p>
        <button 
          className="adopt-button" 
          onClick={() => addItems({ price, name, img: imgs })}
        >
          <MdPets className="paw-icon" /> Adopt Me
        </button>
      </div>
    </div>
  );
};

function App() {
  const [input, setInput] = useState(false);
  const [count, setCount] = useState(0);
  const [slide, setSlide] = useState(false);
  const [store, setStore] = useState([]);
  const [search, setSearch] = useState('');

  // Toggle search input
  function showInput() {
    setInput(!input);
  }

  // Filter items
  function showFilter(search_data) {
    setSearch(search_data.target.value);
  }

  // Add to cart
  function Increase(data_rec) {
    const existingItem = store.find(item => item.name === data_rec.name);
    if (existingItem) {
      setStore(store.map(item =>
        item.name === data_rec.name ? { ...item, quantity: item.quantity + 1 } : item
      ));
    } else {
      setStore([...store, { ...data_rec, quantity: 1 }]);
    }
    setCount(count + 1);
  }

  // Sidebar
  function Slide() {
    setSlide(!slide);
  }

  // Remove item
  function removeItem(itemName) {
    const updatedStore = store.filter(item => item.name !== itemName);
    const removedItem = store.find(item => item.name === itemName);
    setStore(updatedStore);
    if (removedItem) setCount(count - removedItem.quantity);
  }

  // Update quantity
  function updateQuantity(itemName, newQuantity) {
    if (newQuantity <= 0) return;
    const updatedStore = store.map(item =>
      item.name === itemName ? { ...item, quantity: newQuantity } : item
    );
    setStore(updatedStore);
  }

  //  PDF generation
  function downloadPDF() {
    try {
      const doc = new jsPDF();
      
      // Set background color
      doc.setFillColor(255, 255, 255);
      doc.rect(0, 0, 210, 297, 'F');
      
      // Header with colored text
      doc.setTextColor(139, 69, 19); 
      doc.setFontSize(20);
      doc.text("PET PARADISE - ADOPTION RECEIPT", 105, 20, { align: 'center' });
      
      // Subtitle
      doc.setTextColor(34, 139, 34); 
      doc.setFontSize(14);
      doc.text("Thank you for choosing Pet Paradise!", 105, 35, { align: 'center' });
      doc.text("Your furry friends are waiting for you!", 105, 45, { align: 'center' });
      
      // Items section
      doc.setTextColor(0, 0, 0); 
      doc.setFontSize(12);
      doc.text("ADOPTION DETAILS:", 105, 65, { align: 'center' });
      
      let yPos = 80;
      store.forEach((item, index) => {
        doc.setTextColor(139, 69, 19); 
        doc.text(
          `${index + 1}. ${item.name} - ${item.price} x ${item.quantity} = ${item.price * item.quantity}`,
          105, yPos, { align: 'center' }
        );
        yPos += 15;
      });
      
      // Total
      doc.setTextColor(220, 20, 60); 
      doc.setFontSize(16);
      doc.text(
        `TOTAL AMOUNT: ${store.reduce((total, item) => total + item.price * item.quantity, 0)}`,
        105, yPos + 20, { align: 'center' }
      );
      
      // Footer
      doc.setTextColor(34, 139, 34);
      doc.setFontSize(14);
      doc.text("Welcome to the Pet Paradise Family!", 105, yPos + 40, { align: 'center' });
      
      // Save PDF
      doc.save('PetParadise_Adoption_Receipt.pdf');

    } catch (error) {
      console.error('Error generating PDF:', error);
      // jsPDF fails
      const pdfContent = `
PET PARADISE - ADOPTION RECEIPT
==============================

Thank you for choosing Pet Paradise!
Your furry friends are waiting for you!

ADOPTION DETAILS:
${store.map((item, index) => 
  `${index + 1}. ${item.name} - ${item.price} x ${item.quantity} = ${item.price * item.quantity}`
).join('\n')}

TOTAL AMOUNT: ${store.reduce((total, item) => total + item.price * item.quantity, 0)}

Welcome to the Pet Paradise Family!
      `;
      alert("PDF generation failed. Here's your receipt:\n\n" + pdfContent);
    }
  }

  // Pet data
  let data = [
    { price: 150, name: 'Persian Cat', img: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=300' },
    { price: 120, name: 'Siamese Cat', img: 'https://images.unsplash.com/photo-1510704652036-67838c2cfab6?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8U2lhbWVzZSUyMENhdHxlbnwwfHwwfHx8MA%3D%3D' },
    { price: 100, name: 'Tabby Cat', img: 'https://images.unsplash.com/photo-1592194996308-7b43878e84a6?w=300' },
    { price: 250, name: 'Golden Retriever', img: 'https://images.unsplash.com/photo-1552053831-71594a27632d?w=300' },
    { price: 230, name: 'Labrador', img: 'https://images.unsplash.com/photo-1529831129093-0fa4866281ee?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8TGFicmFkb3J8ZW58MHx8MHx8fDA%3D' },
    { price: 200, name: 'Beagle', img: 'https://images.unsplash.com/photo-1707298737261-069e2d529eaa?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8YmVhZ2xlfGVufDB8fDB8fHww' },
    { price: 80, name: 'Canary', img: 'https://images.unsplash.com/photo-1586861256152-6c7e7ce3895d?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8Q2FuYXJ5fGVufDB8fDB8fHww' },
    { price: 60, name: 'Budgie', img: 'https://images.unsplash.com/photo-1703319960774-9b5965701b29?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8QnVkZ2llfGVufDB8fDB8fHww' },
    { price: 100, name: 'Cockatiel', img: 'https://images.unsplash.com/photo-1517101724602-c257fe568157?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8Q29ja2F0aWVsfGVufDB8fDB8fHww' },
    { price: 25, name: 'Goldfish', img: 'https://images.unsplash.com/photo-1522069169874-c58ec4b76be5?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8R29sZGZpc2h8ZW58MHx8MHx8fDA%3D' },
    { price: 35, name: 'Betta Fish', img: 'https://images.unsplash.com/photo-1619491202102-088c4afb271c?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8YmV0dGElMjBmaXNofGVufDB8fDB8fHww' },
    { price: 45, name: 'Angelfish', img: 'https://images.unsplash.com/photo-1510020904390-f245a6de84f5?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8QW5nZWxmaXNofGVufDB8fDB8fHww' },
    { price: 40, name: 'Syrian Hamster', img: 'https://images.unsplash.com/photo-1425082661705-1834bfd09dca?w=300' },
    { price: 35, name: 'Dwarf Hamster', img: 'https://images.unsplash.com/photo-1548767797-d8c844163c4c?w=300' },
    { price: 45, name: 'Robo Hamster', img: 'https://images.unsplash.com/photo-1592159371936-61a70cbeb5f7?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8Um9ibyUyMEhhbXN0ZXJ8ZW58MHx8MHx8fDA%3D' },
    { price: 300, name: 'African Grey Parrot', img: 'https://images.unsplash.com/photo-1557001232-8b87133123dc?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8QWZyaWNhbiUyMEdyZXklMjBQYXJyb3R8ZW58MHx8MHx8fDA%3D' },
    { price: 250, name: 'Cockatoo', img: 'https://plus.unsplash.com/premium_photo-1709307939610-25c07bf7e536?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8Q29ja2F0b298ZW58MHx8MHx8fDA%3D' },
    { price: 200, name: 'Macaw', img: 'https://images.unsplash.com/photo-1604826010917-65cf53d6249b?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTF8fE1hY2F3fGVufDB8fDB8fHww' },
    { price: 80, name: 'Holland Lop Rabbit', img: 'https://images.unsplash.com/photo-1585110396000-c9ffd4e4b308?w=300' },
    { price: 70, name: 'Mini Rex Rabbit', img: 'https://images.unsplash.com/photo-1718211766344-ffee848d88de?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8TWluaSUyMFJleCUyMFJhYmJpdHxlbnwwfHwwfHx8MA%3D%3D' },
    { price: 90, name: 'Flemish Giant', img: 'https://images.unsplash.com/photo-1556838803-cc94986cb631?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8RmxlbWlzaCUyMEdpYW50JTIwcmFiYml0fGVufDB8fDB8fHww' },
  ];

  let data_search = data.filter((item) =>
    item.name.toLowerCase().includes(search.toLowerCase())
  );

  const totalPrice = store.reduce((total, item) => total + item.price * item.quantity, 0);

  return (
    <div className='overall'>
      

      {/* Navbar */}
      <nav className='navbar'>
        <h1>
          <FaPaw style={{color: '#e74c3c'}} />
          <span className='logo'>Pet Paradise</span>
        </h1>
        <div className='subnav'>
          {input && <input type='search' placeholder='Search for your perfect pet...' onChange={showFilter} />}
          <IoSearchOutline className='note' onClick={showInput} />
          <IoNotificationsOutline className='note' onClick={Slide} />
          {count > 0 && <div className='circle'>{count}</div>}
        </div>
      </nav>

      {/* Hero Section */}
      <div className="hero">
        <h2>🏠 Find Your Perfect Companion 🐾</h2>
        <p>Bringing families and pets together with love and care</p>
      </div>

      {/* Sidebar */}
      <div className={`sidebar ${slide ? "open" : ""}`}>
        <MdCancel onClick={Slide} className='close-btn' />
        <h2>🛒 Adoption Cart</h2>
        <div className="cart-items">
          {store.length === 0 ? (
            <div style={{textAlign: 'center', color: '#7f8c8d', fontStyle: 'italic'}}>
              <FaPaw style={{fontSize: '3rem', marginBottom: '1rem'}} />
              <p>Your cart is empty. Start adopting some furry friends!</p>
            </div>
          ) : null}
          {store.map((data, index) => (
            <div key={index} className="cart-item">
              <p>🐾 {data.name} - ₹{data.price} × {data.quantity} = ₹{data.price * data.quantity}</p>
              <input
                type="number"
                value={data.quantity}
                min="1"
                onChange={(e) => updateQuantity(data.name, parseInt(e.target.value))}
              />
              <button onClick={() => removeItem(data.name)}>Remove</button>
            </div>
          ))}
        </div>
        <h3>💰 Total: ₹{totalPrice}</h3>
        {store.length > 0 && (
          <button onClick={downloadPDF} className="download-button">
            📄 Download Adoption Receipt
          </button>
        )}
      </div>

      {/* Product Cards */}
      <section className='cards'>
        {data_search.map((items, i) => (
          <Cards
            key={i}
            addItems={Increase}
            price={items.price}
            name={items.name}
            imgs={items.img}
          />
        ))}
      </section>
              {/* About Section */}
      <div className="about-section">
        <div className="about-text">
          <h2>About Us</h2>
          <p>
            At <strong>Pet Paradise</strong>, we believe every pet deserves a loving home 
            and every family deserves the joy of companionship. Our mission is to connect 
            adorable pets with caring families, creating bonds that last a lifetime.
          </p>
          <p>
            🐾 From playful puppies and loyal dogs to cuddly cats, chirping birds, 
            and even charming little hamsters – we bring you a wide variety of pets 
            waiting to be adopted.
          </p>
          <p>
            💖 We ensure that all our pets are cared for with love, proper nutrition, 
            and medical attention before they find their forever homes.
          </p>
          <p>
            ✨ When you adopt from Pet Paradise, you’re not just bringing home a pet – 
            you’re welcoming a new family member filled with love, loyalty, and happiness.
          </p>
        </div>

        <div className="about-image">
          <img 
            src="https://plus.unsplash.com/premium_photo-1664298414306-c7978d84b936?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTN8fGhhcHB5JTIwcGV0fGVufDB8fDB8fHww" 
            alt="Happy pet" 
          />
        </div>
      </div>


      <footer className='footer'>
        <div>
          <p><span>Email :</span> petparadise@gmail.com</p>
        </div>
        <div className='footer-icons'>
          <FaFacebook />
          <FaInstagram />
          <FcGoogle />
          <FaWhatsapp />
        </div>
      </footer>
    </div>
  );
}

export default App;

