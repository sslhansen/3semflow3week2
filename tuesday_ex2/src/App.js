import "./App.css";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  NavLink,
  Prompt,
  Link,
  useRouteMatch,
  useParams,

} from "react-router-dom";
import React, { useState } from "react";

function App(props) {
  return (
    <div>
      <Header />
      <Switch>
        <Route exact path="/">
          <Home />
        </Route>
        <Route path="/products">
          <Products bookFacade={props.bookFacade} />
        </Route>
        <Route path="/company">
          <Company />
        </Route>
        <Route path="/add-book">
          <AddBook bookFacade={props.bookFacade} />
        </Route>
        <Route>
          <NoMatch />
        </Route>
      </Switch>
    </div>
  );
}
export default App;
function Home() {
  return "hello";
}
function Products({bookFacade}) {
  let { path, url } = useRouteMatch();
  const listOfBooks = bookFacade.getBooks().map((x) => (
    <li key={x.id}>
      {x.title} <Link to={`${url}/components/${x.id}`}>details</Link>
    </li>
  ));
  return (
    <div>
      <h1> Products </h1>
      {listOfBooks}
      <Switch>
        <Route path={`${path}/components/:id`}>
          <Details bookFacade={bookFacade}/> 
        </Route>
      </Switch>
    </div>
  );
}

function Company() {
  return "hello";
}

function AddBook({ bookFacade }) {
  const emptyBook = { id: "", title: "", info: "" };
  const [book, setBook] = useState({ ...emptyBook });
  let [isBlocking, setIsBlocking] = useState(false);

  function handleTitleChange(event) {
    const target = event.target;
    const value = target.value;
    setIsBlocking(value.length > 0);
    book.title = value;
    setBook({ ...book });
  }

  function handleInfoChange(event) {
    const target = event.target;
    const value = target.value;
    setIsBlocking(value.length > 0);
    book.info = value;
    setBook({ ...book });
  }

  function handleSubmit(event) {
    event.preventDefault();
    event.target.reset();
    setIsBlocking(false);
    bookFacade.addBook(book);
    setBook({ ...emptyBook });
  }

  return (
    <div>
      <h1>Add Book</h1>

      <form onSubmit={handleSubmit}>
        <Prompt
          when={isBlocking}
          message={(location) =>
            `Are you sure you want to go to ${location.pathname}`
          }
        />
        <label>
          title:
          <input
            id="title"
            type="text"
            value={book.title}
            onChange={handleTitleChange}
          />
          info:
          <input
            id="info"
            type="text"
            value={book.info}
            name="info"
            onChange={handleInfoChange}
          />
        </label>
        <input type="submit" value="Submit" />
      </form>
    </div>
  );
}

function NoMatch() {
  return "no match";
}

function Details({bookFacade}) {
  let { id } = useParams();
  let book = bookFacade.findBook(id)
return <h1>{book.title} {book.id} {book.info}</h1>;
}

function Header() {
  return (
    <ul className="header">
      <li>
        <NavLink exact activeClassName="active" to="/">
          Home
        </NavLink>
      </li>
      <li>
        <NavLink activeClassName="active" to="/products">
          Products
        </NavLink>
      </li>
      <li>
        <NavLink activeClassName="active" to="/add-book">
          Add Book
        </NavLink>
      </li>
      <li>
        <NavLink activeClassName="active" to="/company">
          Company
        </NavLink>
      </li>
    </ul>
  );
}
