import React from "react";
import moment from "moment";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import axios from "axios";
const Table = ({ data }, callback) => {
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
          timer: 3000,
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
        callback.callback();
      }
    });
  };
  return (
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
          {data.map((book) => {
            return (
              <tr
                className="text-center bg-white border-b-2 border-gray-100"
                key={book.id}
              >
                <td className="p-3 text-sm text-blue-500 font-bold whitespace-nowrap">
                  {book.id}
                </td>
                <td className="p-3 text-sm text-gray-700 whitespace-nowrap">
                  {book.title}
                </td>
                <td className="p-3 text-sm text-gray-700 whitespace-nowrap">
                  {book.author}
                </td>
                <td className="p-3 text-sm text-gray-700 whitespace-nowrap">
                  {<DateFormmat date={book.pubplished} />}
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
  );
};

export default Table;
