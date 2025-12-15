import { useEffect, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";

// FontAwesome 쓰면 아래 주석 해제해서 사용
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { faTicket, faUser, faBars, faTimes } from "@fortawesome/free-solid-svg-icons";

export default function Header() {
    const navigate = useNavigate();

    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    useEffect(() => {
        const onScroll = () => setIsScrolled(window.scrollY > 10);
        onScroll();
        window.addEventListener("scroll", onScroll);
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    const toggleMobileMenu = () => setIsMobileMenuOpen((p) => !p);

    // Angular removeKey() 대응: 로그아웃(로컬스토리지 정리) + /signin 이동
    const removeKey = () => {
        localStorage.removeItem("TMDb-Key");
        localStorage.removeItem("auth"); // 너 useAuth에서 쓰는 키가 auth면 유지
        setIsMobileMenuOpen(false);
        navigate("/signin", { replace: true });
    };

    return (
        <div id="container">
            <header className={`app-header ${isScrolled ? "scrolled" : ""}`}>
                <div className="header-left">
                    <div className="logo">
                        <Link to="/">
                            {/* FontAwesome 쓰면 아래로 교체 */}
                            {/* <FontAwesomeIcon icon={faTicket} style={{ height: "100%", color: "#E50914" }} /> */}
                            <span style={{ color: "#E50914", fontWeight: 900 }}>🎟</span>
                        </Link>
                    </div>

                    <nav className="nav-links desktop-nav">
                        <ul>
                            <li><NavLink to="/">홈</NavLink></li>
                            <li><NavLink to="/popular">대세 콘텐츠</NavLink></li>
                            <li><NavLink to="/wishlist">내가 찜한 리스트</NavLink></li>
                            <li><NavLink to="/search">찾아보기</NavLink></li>
                        </ul>
                    </nav>
                </div>

                <div className="header-right">
                    <button className="icon-button" onClick={removeKey} aria-label="logout">
                        {/* <FontAwesomeIcon icon={faUser} /> */}
                        👤
                    </button>

                    <button
                        className="icon-button mobile-menu-button"
                        onClick={toggleMobileMenu}
                        aria-label="menu"
                    >
                        {/* <FontAwesomeIcon icon={faBars} /> */}
                        ☰
                    </button>
                </div>
            </header>

            {/* Mobile Navigation */}
            <div className={`mobile-nav ${isMobileMenuOpen ? "open" : ""}`}>
                <button className="close-button" onClick={toggleMobileMenu} aria-label="close">
                    {/* <FontAwesomeIcon icon={faTimes} /> */}
                    ✕
                </button>

                <nav>
                    <ul>
                        <li><Link to="/" onClick={toggleMobileMenu}>홈</Link></li>
                        <NavLink
                            to="/popular"
                            className={({ isActive }) => (isActive ? "active" : "")}
                        >
                            대세 콘텐츠
                        </NavLink>
                        <li><Link to="/wishlist" onClick={toggleMobileMenu}>내가 찜한 리스트</Link></li>
                        <li><Link to="/search" onClick={toggleMobileMenu}>찾아보기</Link></li>
                    </ul>
                </nav>
            </div>
        </div>
    );
}