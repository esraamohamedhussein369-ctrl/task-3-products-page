import { useEffect, useState } from 'react'
import { Link, Route, Routes, useNavigate, useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { ArrowLeft, ArrowRight, Bath, ChevronLeft, ChevronRight, Gem, Heart, Search, ShoppingCart, Sparkles, Star, Syringe, WandSparkles } from 'lucide-react'
import { Card, CardContent } from './components/ui/card'
import { getProductById, getProducts, PAGE_SIZE } from './api'
import type { Product } from './types'

const categories = [
  { label: 'All Products', icon: Sparkles, query: '' },
  { label: 'Skincare', icon: Heart, query: 'skin' },
  { label: 'Haircare', icon: Syringe, query: 'hair' },
  { label: 'Makeup', icon: WandSparkles, query: 'makeup' },
  { label: 'Bath & Body', icon: Bath, query: 'body' },
]
function money(price: number) { return `$${price.toFixed(2)}` }
function Header({ search, onSearch }: { search: string; onSearch: (value: string) => void }) {
  const navigate = useNavigate()
  return <header className="topbar">
    <Link to="/" className="brand" aria-label="Crystal home"><Gem className="brand-mark" size={21} fill="currentColor"/><span>crystal.</span></Link>
    <nav className="nav-links" aria-label="Main navigation"><Link to="/">SHOP</Link><a href="#collections">COLLECTIONS</a><a href="#contact">CONTACT</a><a href="#about">ABOUT</a></nav>
    <form className="searchbox" role="search" onSubmit={(event) => { event.preventDefault(); navigate('/'); window.dispatchEvent(new CustomEvent('products-search', { detail: search })) }}>
      <input aria-label="Search products" placeholder="SEARCH" value={search} onChange={(event) => onSearch(event.target.value)} />
      <button aria-label="Submit search" type="submit"><Search size={21}/></button>
    </form>
    <button className="cart-button" onClick={() => window.alert('Your cart is ready for your favorite finds.')}><ShoppingCart size={17}/> VIEW CART</button>
  </header>
}
function Hero() { return <section className="hero" id="about"><div className="sparkle-line"/><h1>Explore Our Shop</h1><div className="hero-bottom"><p>From skincare to makeup, our platform features a wide range of products that cater to<br className="desktop-break"/> all your beauty needs. We strive to provide our customers with a luxury shopping<br className="desktop-break"/> experience, from browsing through our carefully selected products to receiving them in<br className="desktop-break"/> our signature packaging. Shop with us for the ultimate in beauty luxury.</p></div></section> }
function ProductCard({ product }: { product: Product }) {
  return <Card className="product-card"><Link to={`/products/${product.id}`} aria-label={`View ${product.title} details`}>
    <div className="product-image"><img src={product.thumbnail} alt={product.title} loading="lazy" onError={(event) => { event.currentTarget.style.visibility = 'hidden' }}/></div>
    <CardContent className="product-info"><h2 className="product-title" title={product.title}>{product.title}</h2><p className="product-brand">{product.brand || product.category}</p><p className="product-price">{money(product.price)}</p><div className="rating"><Star size={12} fill="#d3a84e" color="#d3a84e"/> {product.rating.toFixed(1)} <span>·</span> {product.stock > 0 ? 'In stock' : 'Sold out'}</div><span className="details-link">VIEW DETAILS <ArrowRight size={12}/></span></CardContent>
  </Link></Card>
}
function ProductsPage() {
  const [searchInput, setSearchInput] = useState('')
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [category, setCategory] = useState('All Products')
  useEffect(() => { const handler = (event: Event) => { const value = (event as CustomEvent<string>).detail; setSearchInput(value); setSearch(value.trim()); setPage(1); setCategory('All Products') }; window.addEventListener('products-search', handler); return () => window.removeEventListener('products-search', handler) }, [])
  useEffect(() => { const timeout = window.setTimeout(() => { setSearch(searchInput.trim()); setPage(1) }, 350); return () => window.clearTimeout(timeout) }, [searchInput])
  const { data, isPending, isError, error, refetch } = useQuery({ queryKey: ['products', search, page], queryFn: () => getProducts({ query: search, page }), placeholderData: (previousData) => previousData })
  const totalPages = Math.max(1, Math.ceil((data?.total ?? 0) / PAGE_SIZE))
  function chooseCategory(label: string, query: string) { setCategory(label); setSearchInput(query); setSearch(query); setPage(1) }
  return <><Hero/><main className="catalog" id="collections">
    <div className="category-row" aria-label="Product categories">{categories.map(({ label, icon: Icon, query }) => <button key={label} className={`category-btn ${category === label ? 'active' : ''}`} onClick={() => chooseCategory(label, query)}><Icon size={15}/>{label}</button>)}</div>
    {isPending ? <div className="status" role="status"><strong>Finding your favorites…</strong>Loading products for you.</div> : isError ? <div className="status" role="alert"><strong>We couldn’t load the products.</strong>{error instanceof Error ? error.message : 'Please check your connection and try again.'}<br/><button className="error-button" onClick={() => void refetch()}>Try again</button></div> : data?.products.length ? <>
      <div className="product-grid">{data.products.map((product) => <ProductCard key={product.id} product={product}/>)}</div>
      <div className="pagination" aria-label="Products pagination"><button className="page-btn" aria-label="Previous page" disabled={page <= 1} onClick={() => { setPage((current) => current - 1); document.querySelector('.catalog')?.scrollIntoView({ behavior: 'smooth' }) }}><ChevronLeft size={16}/></button>{Array.from({ length: Math.min(totalPages, 5) }, (_, index) => { const pageNumber = totalPages <= 5 ? index + 1 : Math.min(Math.max(1, page - 2), totalPages - 4) + index; return <button key={pageNumber} className={`page-btn ${page === pageNumber ? 'active' : ''}`} aria-current={page === pageNumber ? 'page' : undefined} onClick={() => setPage(pageNumber)}>{pageNumber}</button> })}<button className="page-btn" aria-label="Next page" disabled={page >= totalPages} onClick={() => { setPage((current) => current + 1); document.querySelector('.catalog')?.scrollIntoView({ behavior: 'smooth' }) }}><ChevronRight size={16}/></button></div>
      <p className="footer-note">Showing {data.products.length} of {data.total} products · Your discoveries, beautifully curated.</p>
    </> : <div className="status"><strong>No products found</strong>Try another keyword or choose All Products.<br/><button className="error-button" onClick={() => chooseCategory('All Products', '')}>Show all products</button></div>}
  </main></>
}
function ProductDetails() {
  const { id = '' } = useParams()
  const navigate = useNavigate()
  const { data: product, isPending, isError, refetch } = useQuery({ queryKey: ['product', id], queryFn: () => getProductById(id), enabled: Boolean(id) })
  if (isPending) return <main className="details-wrap"><div className="status"><strong>Loading product…</strong>Getting the details.</div></main>
  if (isError || !product) return <main className="details-wrap"><button className="back-link" onClick={() => navigate(-1)}><ArrowLeft size={15}/> Back to shop</button><div className="status"><strong>Product details unavailable</strong>We couldn’t find this product.<br/><button className="error-button" onClick={() => void refetch()}>Try again</button></div></main>
  return <main className="details-wrap"><Link className="back-link" to="/"><ArrowLeft size={15}/> Back to shop</Link><div className="details-content"><div className="details-image"><img src={product.images?.[0] || product.thumbnail} alt={product.title}/></div><div className="details-copy"><span className="stock">{product.stock > 0 ? 'IN STOCK' : 'CURRENTLY UNAVAILABLE'}</span><h1>{product.title}</h1><p className="product-brand">{product.brand || product.category}</p><div className="rating" style={{ justifyContent: 'flex-start', margin: '12px 0' }}><Star size={14} fill="#d3a84e" color="#d3a84e"/> {product.rating.toFixed(1)} / 5</div><div className="product-price">{money(product.price)}</div><p>{product.description}</p><p><strong>Category:</strong> {product.category}</p><p><strong>Available stock:</strong> {product.stock}</p><button className="cart-button" style={{ height: 48, padding: '0 22px', marginTop: 14 }} onClick={() => window.alert(`${product.title} is ready to add to your cart.`)}><ShoppingCart size={17}/> ADD TO CART</button></div></div></main>
}
export default function App() {
  const [search, setSearch] = useState('')
  return <div className="page-shell"><Header search={search} onSearch={setSearch}/><Routes><Route path="/" element={<ProductsPage/>}/><Route path="/products/:id" element={<ProductDetails/>}/><Route path="*" element={<main className="details-wrap"><h1>Page not found</h1><Link className="back-link" to="/"><ArrowLeft size={15}/> Back to shop</Link></main>}/></Routes><footer className="footer-note" id="contact">CRYSTAL BEAUTY · A LITTLE LUXURY, EVERY DAY</footer></div>
}
