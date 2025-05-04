import { useEffect, useState } from "react";
import axios from "axios";
import { Container, Navbar, Nav } from "react-bootstrap";
import { Link } from "react-router-dom";
import "../App.css";

function Pokedex() {
  const [pokemons, setPokemons] = useState([]);

  useEffect(() => {
    const fetchPokemons = async () => {
      const promises = [];
      for (let i = 1; i <= 50; i++) {
        promises.push(axios.get(`https://pokeapi.co/api/v2/pokemon/${i}`));
      }
      const results = await Promise.all(promises);
      const fetchedPokemons = results.map((res) => ({
        id: res.data.id,
        name: res.data.name,
        image: res.data.sprites.other["official-artwork"].front_default,
        types: res.data.types.map((t) => t.type.name),
      }));
      setPokemons(fetchedPokemons);
    };

    fetchPokemons();
  }, []);

  return (
    <>
      {/* Navbar */}
      <Navbar bg="dark" variant="dark" expand="lg" className="shadow-lg">
        <Container>
          <Navbar.Brand as={Link} to="/" className="text-warning">
            <span className="ms-2">Pokédex</span>
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ms-auto">
              <Nav.Link as={Link} to="/" className="text-light">
                Home
              </Nav.Link>
              <Nav.Link as={Link} to="/team" className="text-light">
                Team
              </Nav.Link>
              <Nav.Link as={Link} to="/battle" className="text-light">
                Battle
              </Nav.Link>
              <Nav.Link as={Link} to="/history" className="text-light">
                History
              </Nav.Link>
            </Nav>
            <Link to="/pokedex" className="btn btn-danger ms-3">
              Open Pokédex
            </Link>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      {/* Pokedex Content */}
      <div className="pokedex-container">
        <h1 className="pokedex-title">Pokédex</h1>
        <div className="pokedex-grid">
          {pokemons.map((pokemon) => (
            <div key={pokemon.id} className="pokemon-card">
              <img src={pokemon.image} alt={pokemon.name} className="pokemon-img" />
              <h2 className="pokemon-name">{pokemon.name}</h2>
              <div className="pokemon-types">
                {pokemon.types.map((type) => (
                  <span key={type} className={`type-badge type-${type}`}>
                    {type}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export default Pokedex;
