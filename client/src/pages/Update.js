import React from "react";
import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import moment from "moment";
const Update = () => {
  // ========== books ==============
  const [book, setBook] = useState({
    title: "",
    author: "",
    published: "",
  });

  // set error message
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  // convert letter to capitalize
  const capitalLetter = (str) => {
    if (str !== "") {
      return str[0].toUpperCase() + str.substring(1, str.length);
    } else {
      return "";
    }
  };

  const bookId = parseInt(location.pathname.split("/")[2]);
  //console.log(location.pathname.split("/")[2]);

  const check_update = async (value) => {
    const res = await axios.get(
      `http://localhost:3001/api/valupdate?q=${encodeURIComponent(value)}`
    );
    if (res.data) {
      if (res.data[0].id !== bookId && value === res.data[0].title) {
        setError("Book already exist...!");
      } else {
        setError("");
      }
    } else {
      setError("");
    }
  };

  useEffect(() => {
    try {
      axios.get(`http://localhost:3001/api/books/${bookId}`).then((res) => {
        setBook({ ...res.data[0], published: dateFormmat(res.data[0]) });
      });
    } catch (err) {
      console.log(err);
    }
  }, [bookId]);

  // ======= formmat date time =========
  function dateFormmat(date) {
    moment.locale("en");
    let formatDate = moment(date).format("YYYY-MM-DD");
    return formatDate;
  }

  // handle on change
  const handleChange = (e) => {
    setBook((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleClick = () => {
    Swal.fire({
      title: "Are you sure?",
      text: "You want to update...!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, update it!",
    }).then((result) => {
      if (result.isConfirmed) {
        try {
          axios.put("http://localhost:3001/api/books/" + bookId, book);
          navigate("/");
        } catch (err) {
          console.log(err);
        }
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
          title: "Book has been updated successfully.",
        });
      }
    });
  };

  return (
    <div className="p-5 h-screen bg-gray-100">
      <section className="w-4/6 my-6 mx-auto p-2 lg:p-10 bg-white rounded-lg shadow sm:p-10">
        <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white text-center">
          Update Books
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
              onChange={(e) => {
                handleChange(e);
                check_update(capitalLetter(e.target.value));
              }}
            />
            <span className="text-red-600 font-sm">{error}</span>
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
              Year of published<span className="text-red-600">*</span>
            </label>
            <input
              className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg block w-full p-3"
              type="date"
              name="published"
              id="date"
              value={book.published}
              required
              onChange={handleChange}
            />
          </div>
          <div className="mt-4">
            <button
              className="mr-3 bg-blue-500 px-7 py-2 rounded-lg text-white font-medium tracking-wide hover:shadow-lg"
              onClick={(e) => {
                if (
                  book.title !== "" &&
                  book.author !== "" &&
                  book.date !== "" &&
                  error === ""
                ) {
                  e.preventDefault();
                  handleClick();
                } else if (
                  book.title !== "" &&
                  book.author !== "" &&
                  book.date !== ""
                ) {
                  e.preventDefault();
                  setError("");
                  try {
                    axios
                      .get(`http://localhost:3001/api/books/${bookId}`)
                      .then((res) => {
                        setBook({ ...res.data[0] });
                      });
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
                      icon: "error",
                      title: "Book has been updated fail.",
                    });
                  } catch (err) {
                    console.log(err);
                  }
                }
              }}
            >
              Update Book
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

export default Update;
