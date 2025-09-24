import "./header.css";

export default function Header() {
  return (
    <header className="main-header">
      <div className="main-container">
        <div className="brand">
          <img className="logo" src="/images/dog-icon.jpg" alt="Dogbnb logo" />
          <h1 className="title">Dogbnb</h1>
        </div>

        <nav aria-label="Navegación principal">
          <ul className="nav">
            <li className="button-auxiliar"><a href="/iniciar-sesion">Iniciar sesión</a></li>
            <li className="button-auxiliar"><a href="/registro">Registrarse</a></li>
            <li className="button-auxiliar"><a href="/ayuda">Ayuda</a></li>
          </ul>
        </nav>
      </div>
    </header>
  );
}
