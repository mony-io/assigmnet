import React from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";

const Add = () => {
  // ========== books ==============
  const [book, setBook] = useState({
    title: "",
    author: "",
    date: "",
  });

  // navigate
  let navigate = useNavigate();
  // error message
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    // validate book
    const validate_book = async () => {
      try {
        const res = await axios.get(
          `http://localhost:3001/api/validate?q=${encodeURIComponent(
            book.title
          )}`
        );
        if (res.data.length !== 0) {
          if (res.data[0].title === book.title) {
            setErrorMessage("Book already exist!!....");
          } else {
            setErrorMessage("");
          }
        } else {
          setErrorMessage("");
        }
      } catch (err) {
        console.log(err);
      }
    };
    if (book.title !== "") {
      validate_book();
    } else {
      setErrorMessage("");
    }
  }, [book.title]);

  const toastMessage = () => {
    const Toast = Swal.mixin({
      toast: true,
      position: "top-end",
      showConfirmButton: false,
      timer: 2500,
      timerProgressBar: true,
      didOpen: (toast) => {
        toast.addEventListener("mouseenter", Swal);
        toast.addEventListener("mouseleave", Swal);
      },
    });
    Toast.fire({
      icon: "error",
      title: "Book has been added fail.",
    });
  };

  // handle on change
  const handleChange = (e) => {
    setBook((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };
  const handleClick = async () => {
    try {
      await axios.post("http://localhost:3001/api/books", book);
      const Toast = Swal.mixin({
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        didOpen: (toast) => {
          toast.addEventListener("mouseenter", Swal);
          toast.addEventListener("mouseleave", Swal);
        },
      });
      Toast.fire({
        icon: "success",
        title: "Book has been added successfully.",
      });
      navigate("/");
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="p-5 h-screen bg-gray-100">
      <section className="w-4/6 my-6 mx-auto p-2 lg:p-10 bg-white rounded-lg shadow sm:p-10">
        <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white text-center">
          Add Books
        </h1>
        <form>
          <div className="mb-2">
            <label
              htmlFor="title"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              Book Title<span className="text-red-500">*</span>
            </label>
            <input
              className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg block w-full p-3"
              placeholder="Book Title"
              type="text"
              name="title"
              id="title"
              value={book.title}
              required
              onChange={handleChange}
            />
            <span className="text-red-400 font-sm">{errorMessage}</span>
          </div>
          <div className="mb-2">
            <label
              htmlFor="author"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              Author Name<span className="text-red-600">*</span>
            </label>
            <input
              className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg block w-full p-3"
              placeholder="Author Name"
              type="text"
              name="author"
              id="author"
              value={book.author}
              required
              onChange={handleChange}
            />
          </div>
          <div className="mb-2">
            <label
              htmlFor="date"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              Year of published
            </label>
            <input
              className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg block w-full p-3"
              type="date"
              name="date"
              id="date"
              value={book.date}
              required
              onChange={handleChange}
            />
          </div>
          <div className="mt-4">
            <button
              className="mr-3 bg-blue-500 px-5 py-2 rounded-lg text-white font-medium tracking-wide hover:shadow-lg"
              onClick={(e) => {
                if (
                  book.title !== "" &&
                  book.author !== "" &&
                  book.date !== "" &&
                  errorMessage === ""
                ) {
                  e.preventDefault();
                  handleClick();
                } else if (
                  book.title !== "" &&
                  book.author !== "" &&
                  book.date !== ""
                ) {
                  e.preventDefault();
                  setBook({ title: "", author: "", date: "" });
                  toastMessage();
                } else {
                  e.preventDefault();
                }
              }}
            >
              Submit
            </button>
          </div>
        </form>
      </section>
      <div style={{ marginLeft: "17vw" }}>
        <span className="text-blue-700 font-bold hover:underline hover:shadow-md">
          <Link to="/">Go Back!!</Link>
        </span>
      </div>
    </div>
  );
};

export default Add;
