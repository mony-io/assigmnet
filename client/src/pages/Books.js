import React from "react";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import moment from "moment";
import Swal from "sweetalert2";

const Books = () => {
  const [books, setBooks] = useState([]);
  const [query, setQuery] = useState("");

  // fetch book method
  const fetchAllBooks = async () => {
    try {
      const res = await axios.get("http://localhost:3001/api/books");
      setBooks(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    const searchBooks = async () => {
      try {
        const res = await axios.get(
          `http://localhost:3001/api/query?q=${encodeURIComponent(query)}`
        );
        setBooks(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    if (query !== "") {
      searchBooks();
    } else {
      fetchAllBooks();
    }
  }, [query]);

  // ======= formmat date time =========
  function DateFormmat(props) {
    moment.locale("en");
    let dt = props.date;
    let formatDate = moment(dt).format("YYYY-MM-DD");
    return formatDate;
  }

  const handleDelete = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You want to delete...!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        try {
          axios.delete("http://localhost:3001/api/books/" + id);
        } catch (err) {
          console.log(err);
        }
        const Toast = Swal.mixin({
          toast: true,
          position: "top-end",
          showConfirmButton: false,
          timer: 5000,
          timerProgressBar: true,
          didOpen: (toast) => {
            toast.addEventListener("mouseenter", Swal);
            toast.addEventListener("mouseleave", Swal);
          },
        });
        Toast.fire({
          icon: "success",
          title: "Book has been deleted successfully.",
        });
        fetchAllBooks();
      }
    });
  };

  return (
    <>
      <div className="p-5 h-screen bg-gray-100">
        <h1 className="text-xl mb-5 font-bold text-center">Your Books</h1>
        <div className="flex justify-between mb-3">
          <button className="hidden md:block ml-1 px-4 py-1.5 rounded-lg font-medium tracking-wider bg-teal-400 text-neutral-900 hover:text-white hover:shadow">
            <Link to={"/add"}>Add Books</Link>
          </button>
          <input
            className="hidden md:block bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-xl shadow-sm text-center p-2.5 hover:shadow mr-2"
            placeholder="Search..."
            type="text"
            style={{ width: "20rem" }}
            onChange={(e) => {
              setQuery(e.target.value);
            }}
          />
        </div>
        <div className="rounded-lg shadow overflow-auto hidden md:block">
          <table className="w-full table-auto">
            <thead className="bg-gray-50 border-gray-200">
              <tr className="border-b-2 border-gray-100">
                <th className="p-3 text-sm font-semibold tracking-wide text-center">
                  ID
                </th>
                <th className="p-3 text-sm font-semibold tracking-wide text-center">
                  Title
                </th>
                <th className="p-3 text-sm font-semibold tracking-wide text-center">
                  Author
                </th>
                <th className="p-3 text-sm font-semibold tracking-wide text-center">
                  Year of published
                </th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {books.map((book) => {
                return (
                  <tr
                    className="text-center bg-white border-b-2 border-gray-100"
                    key={book.id}
                  >
                    <td className="p-3 text-sm text-blue-500 font-bold whitespace-nowrap">
                      {"100" + book.id}
                    </td>
                    <td className="p-3 text-sm text-gray-700 whitespace-nowrap">
                      {book.title}
                    </td>
                    <td className="p-3 text-sm text-gray-700 whitespace-nowrap">
                      {book.author}
                    </td>
                    <td className="p-3 text-sm text-gray-700 whitespace-nowrap">
                      {<DateFormmat date={book.published} />}
                    </td>
                    <td className="p-3 whitespace-nowrap">
                      <button className="mx-2 px-5 py-1.5 rounded-lg font-medium tracking-wider text-blue-700 bg-blue-200 hover:shadow">
                        <Link to={`/update/${book.id}`}>Edite</Link>
                      </button>
                      <button
                        className="px-4 py-1.5 rounded-lg font-medium tracking-wider text-red-600 bg-red-200 hover:shadow"
                        onClick={() => handleDelete(book.id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <div className="grid grid-cols-1 gap-6 md:hidden">
          {books.map((book) => {
            return (
              <div
                className="bg-white space-y-3 p-4 rounded-lg shadow"
                key={book.id}
              >
                <div className="flex items-center space-x-2 text-sm">
                  <div>
                    <h2 className="text-blue-500 font-bold">
                      {"100" + book.id}
                    </h2>
                  </div>
                  <div className="text-gray-500">{book.title}</div>
                  <div className="text-gray-500">{book.author}</div>
                  <div className="text-gray-500">
                    {<DateFormmat date={book.published} />}
                  </div>
                </div>
                <div>
                  <button className="px-5 py-1 text-sm rounded-lg font-sm tracking-wider text-blue-700 bg-blue-200">
                    Edite
                  </button>
                  <button className="mx-2 text-sm px-4 py-1 rounded-lg font-sm tracking-wider text-red-600 bg-red-200">
                    Delete
                  </button>
                  <button className="text-sm px-4 py-1 rounded-lg font-sm tracking-wider bg-teal-400 text-neutral-900">
                    Add Books
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
};

export default Books;
